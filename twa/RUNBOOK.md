# Welltread TWA — Build & Publish Runbook

End-to-end runbook for building the Android TWA wrapper, signing the AAB, and getting it onto Google Play Console's Internal Testing track.

**Prerequisites already done:**
- Play Console app created (`co.welltread.app`)
- Listing checklist complete + creatives uploaded
- `twa-manifest.json` config prepared (this directory)
- `/.well-known/assetlinks.json` route deployed (welltread.app/.well-known/assetlinks.json — currently with placeholder fingerprint)
- Middleware passThrough updated for `/.well-known/*`

**Required hands-on time: ~30-60 min** (most of it is JDK + Android SDK download on first run, then 5-15 min of build).

---

## Step 1 — Use Node 20 (Bubblewrap doesn't fully support Node 21+)

```bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
node --version  # should show v20.x.x
```

Add to your shell profile if you want it permanent, or just prefix the commands below.

## Step 2 — Run Bubblewrap doctor (installs JDK 17 + Android SDK)

```bash
cd /Users/liorme/Projects/welltread/twa
npx --yes @bubblewrap/cli@latest doctor
```

Answer **Yes** to:
- Install the JDK 17 (~200 MB)
- Install the Android SDK (~3 GB — this is the long step)

Re-run `doctor` until all green checks. Bubblewrap installs everything to `~/.bubblewrap/` so it doesn't pollute your system.

## Step 3 — Initialize the TWA project from our manifest

```bash
cd /Users/liorme/Projects/welltread/twa
npx @bubblewrap/cli init --manifest=https://welltread.app/manifest.webmanifest --directory=.
```

When prompted:
- **Confirm package name:** `co.welltread.app` (already set in `twa-manifest.json`)
- **App name:** `Welltread`
- **Display mode:** `standalone`
- **Status bar color:** `#2D4F4A` (sage)
- **Splash background:** `#FAF7F2` (paper)
- **Generate signing key?** `Yes`
- **Keystore password:** pick a strong password — **save it to your password manager AND to `_private/credentials.md`**. Cannot be recovered if lost.
- **Key alias:** `android` (default)
- **Key password:** can be same as keystore password for simplicity
- **Country/Org details:** Welltread, Inc. / your country / etc. (these go in the cert subject)

Bubblewrap will fetch icons from the manifest, generate the Android Studio project structure, and create the keystore at `./android.keystore`.

## Step 4 — Build the signed AAB

```bash
cd /Users/liorme/Projects/welltread/twa
npx @bubblewrap/cli build
```

Enter the keystore password when prompted. Build takes ~5-15 min.

**Output:** `app-release-bundle.aab` in this directory.

## Step 5 — Get the SHA-256 fingerprint

```bash
keytool -list -v -keystore ./android.keystore -alias android | grep "SHA256:"
```

Copy the 64-char fingerprint (format: `AB:CD:EF:01:23:...`).

## Step 6 — Update assetlinks.json with the real fingerprint

Edit [`src/app/.well-known/assetlinks.json/route.ts`](../src/app/.well-known/assetlinks.json/route.ts):

Replace the placeholder string `REPLACE_WITH_SHA256_FINGERPRINT_FROM_BUBBLEWRAP_BUILD` with the fingerprint from step 5.

```bash
cd /Users/liorme/Projects/welltread
git add src/app/.well-known/assetlinks.json/route.ts
git commit -m "fix(twa): real SHA-256 fingerprint in assetlinks"
git push origin main
```

GH Actions deploys; verify at:
```bash
curl -s https://welltread.app/.well-known/assetlinks.json | jq
```

The fingerprint should appear in the response. If anything other than 200 + JSON, debug before continuing.

## Step 7 — Validate the digital asset link

```bash
curl -s "https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://welltread.app&relation=delegate_permission/common.handle_all_urls" | jq
```

Should return a JSON object with the matching `package_name` and `sha256_cert_fingerprints`. If empty, your assetlinks.json isn't valid yet — recheck step 6.

## Step 8 — Upload AAB to Play Console Internal Testing

1. Go to **Play Console → Test and release → Testing → Internal testing → Create new release**.
2. Upload `app-release-bundle.aab`.
3. Set release name (e.g., `1.0.0 (1)`) and release notes (e.g., `Initial TWA wrapper for Welltread.`).
4. **Save → Review → Roll out to Internal Testing.**

It takes 5-30 minutes for the build to be processable on devices.

## Step 9 — Add testers + install on your device

1. **Testers tab:** create an email list with your own Gmail and any internal testers.
2. **Copy the opt-in URL** (something like `https://play.google.com/apps/internaltest/...`).
3. On your Android device: open the URL → "Become a tester" → click "Download it on Google Play" → install.
4. Open the app. **Verify:**
   - Full-screen launch (no browser chrome — if you see the URL bar, assetlinks isn't right; recheck step 7)
   - Splash screen with sage background + brand mark
   - Welltread.app loads correctly
   - Login + auth flow works (Supabase + magic link)
   - Navigation between /app/today, /app/session, /app/profile works smoothly
   - "Back" button navigates within the web app, not out of it

## Step 10 — Record the keystore details to KB credentials

Open `~/Documents/knowledge-base/_private/credentials.md`, find the Welltread Android section, and fill in:
- Keystore password
- Key password
- SHA-256 fingerprint
- Any Play App Signing details once enrolled

**Back up the keystore file:**
```bash
cp /Users/liorme/Projects/welltread/twa/android.keystore ~/Documents/_keystores/welltread-upload-key.keystore
```

(Create the directory if needed. Consider also storing in a password manager that supports file attachments, or in a sealed encrypted backup.)

## Step 11 — Move to Closed Testing (when Internal Testing passes)

After the app works on your device:

1. **Play Console → Testing → Closed testing → Create track** (e.g., "Beta").
2. Recruit ≥12 testers. They need to install the app and use it for ≥14 continuous days before Google grants production access for new developer accounts.
3. Same upload flow as Internal Testing but the audience is wider.

## Step 12 — Production access + first launch

After 14+ days of closed testing:

1. **Play Console → Test and release → Apply for production access.** Fill in the questionnaire.
2. Approval: 1-7 days typical.
3. After approval: **Production → Create new release → Promote from Closed Testing.** Submit for review.
4. First production review: 1-7 days. Subsequent updates: <24 hours.

---

## Troubleshooting

**TWA opens with browser chrome (URL bar visible):**
- Asset Links failed verification. Recheck step 7. Most common causes:
  - Wrong fingerprint in `route.ts` (typo, wrong key)
  - Wrong package_name (must match `co.welltread.app` exactly)
  - assetlinks.json not reachable on welltread.app (middleware blocking, deploy not propagated)
  - Caching: Chrome caches verification for ~24h; uninstall + reinstall the app to force re-verification

**Bubblewrap build fails on Java version:**
- Ensure `JAVA_HOME` points to JDK 17 (Bubblewrap installed it at `~/.bubblewrap/jdk/jdk-17.x.x/Contents/Home` on macOS)
- `export JAVA_HOME=$(ls -d ~/.bubblewrap/jdk/jdk-17* | head -1)/Contents/Home`

**Keystore lost or password forgotten:**
- Cannot recover. Must publish a NEW app under a different package name and migrate users. Don't lose the keystore.

**Play App Signing prompt during upload:**
- Recommended: Yes, enroll. Google manages the distribution signing key going forward; you only manage the upload key.
- After enrollment, retrieve the Google-managed signing-key SHA-256 from Play Console → App integrity → and add it as a SECOND fingerprint in `assetlinks.json` route. Both must be present.

---

## What's already done (so you don't redo it)

- ✅ `twa-manifest.json` config (this directory)
- ✅ `/.well-known/assetlinks.json` route in Next.js (with placeholder fingerprint to swap)
- ✅ Middleware passThrough for `/.well-known/*` so welltread.app serves it
- ✅ `.gitignore` excludes the keystore + AAB files
- ✅ KB credentials section ready for fingerprint + password fields
