import { NextResponse } from "next/server";

/**
 * Digital Asset Links for the Android TWA wrapper.
 *
 * Required by Google for Trusted Web Activity verification: this file proves
 * that the welltread.app domain owner controls the Android app's signing key.
 * Without it, the TWA launches with browser chrome instead of full-screen.
 *
 * The SHA-256 fingerprint must match the upload-key fingerprint used by
 * Bubblewrap when building the AAB. After running `bubblewrap build`, retrieve
 * the fingerprint via:
 *
 *   keytool -list -v -keystore ./twa/android.keystore -alias android
 *
 * Or after Play App Signing is enabled, also add the Play-managed signing-key
 * fingerprint from Play Console → Setup → App integrity → App signing.
 *
 * To rotate keys: append a new fingerprint object (same package_name, new
 * sha256_cert_fingerprints array). Multiple fingerprints in one entry are
 * also valid.
 */
const ASSETLINKS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "co.welltread.app",
      sha256_cert_fingerprints: [
        // PLACEHOLDER - replace after `bubblewrap build` produces the keystore.
        // Format: 64 hex chars in pairs separated by colons.
        // Example: AB:CD:EF:01:23:45:67:89:AB:CD:EF:01:23:45:67:89:AB:CD:EF:01:23:45:67:89:AB:CD:EF:01:23:45:67:89
        "REPLACE_WITH_SHA256_FINGERPRINT_FROM_BUBBLEWRAP_BUILD",
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(ASSETLINKS, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
