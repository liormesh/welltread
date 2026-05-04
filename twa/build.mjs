/**
 * Programmatic TWA generator for Welltread.
 *
 * Bubblewrap CLI is interactive — this script uses @bubblewrap/core directly
 * to load our pre-filled twa-manifest.json, generate the Android project,
 * and run gradle bundleRelease to produce the signed AAB. No prompts.
 *
 * Run via:
 *   PATH="/opt/homebrew/opt/node@20/bin:$PATH" node build.mjs
 */

import { TwaManifest, TwaGenerator, Config, GradleWrapper, ConsoleLog, JdkHelper, AndroidSdkTools } from "@bubblewrap/core";
import * as path from "path";
import * as fs from "fs/promises";

const here = path.dirname(new URL(import.meta.url).pathname);
const log = new ConsoleLog("welltread-twa");

const config = new Config(
  "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk",
  "/opt/homebrew/share/android-commandlinetools/cmdline-tools/latest"
);

async function main() {
  log.info("Loading TWA manifest from twa-manifest.json…");
  const manifest = await TwaManifest.fromFile(path.join(here, "twa-manifest.json"));

  // Override signing key path to absolute (relative paths can confuse gradle later).
  manifest.signingKey = {
    path: path.join(here, "android.keystore"),
    alias: "android",
  };

  log.info("Generating Android project…");
  const generator = new TwaGenerator();
  await generator.createTwaProject(here, manifest, log);

  log.info("Resolving JDK + Android SDK…");
  const process_env = { ...process.env, JAVA_HOME: "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" };
  const jdkHelper = new JdkHelper({ ...process, env: process_env }, config);
  const androidSdkTools = await AndroidSdkTools.create({ ...process, env: process_env }, config, jdkHelper, log);

  log.info("Running gradle bundleRelease (this may take 5-15 min on first run)…");
  const gradleWrapper = new GradleWrapper({ ...process, env: process_env }, androidSdkTools, here);
  await gradleWrapper.bundleRelease();

  log.info("✅ AAB built: app/build/outputs/bundle/release/app-release.aab");

  // Sign with our keystore.
  log.info("Signing AAB with android.keystore…");
  const password = (await fs.readFile(path.join(here, ".keystore-password.local"), "utf8")).trim();
  const aabPath = path.join(here, "app/build/outputs/bundle/release/app-release.aab");
  const signedAabPath = path.join(here, "app-release-signed.aab");

  // Use jarsigner (bundled with JDK).
  const { execSync } = await import("child_process");
  execSync(
    `cp "${aabPath}" "${signedAabPath}" && ` +
      `"${config.jdkPath}/bin/jarsigner" -verbose -sigalg SHA256withRSA -digestalg SHA-256 ` +
      `-keystore "${path.join(here, "android.keystore")}" ` +
      `-storepass "${password}" -keypass "${password}" ` +
      `"${signedAabPath}" android`,
    { stdio: "inherit" }
  );

  log.info(`✅ Signed AAB ready: ${signedAabPath}`);
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
