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
        // Welltread upload key (generated 2026-05-04 via keytool, stored at twa/android.keystore).
        // Used to sign AABs uploaded to Play Console.
        "8E:56:48:5C:28:80:51:84:0E:27:C0:ED:AC:84:C3:C2:E5:54:E5:18:5D:38:7C:5C:B5:80:43:CC:16:03:09:0D",
        // Play App Signing key (Google-managed, enrolled 2026-05-04).
        // Used to sign APKs distributed to end users via Play Store.
        "4A:73:43:02:94:B0:F0:06:6F:2A:D9:BF:AC:56:19:D0:0F:29:E2:6A:CF:84:C2:CC:0A:26:D5:09:26:EB:4A:F9",
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
