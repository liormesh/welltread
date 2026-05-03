#!/usr/bin/env python3
"""Veo 3.1 Fast - 9:16 mobile portrait cat-cow clip (VALIDATED PRODUCTION RECIPE).

Pipeline (proven 2026-05-03):
1. Generate cow-pose still via gemini-3.1-flash-image-preview (orientation anchor)
2. Generate cat-pose still anchored to cow's orientation (prevents flip)
3. Submit both to Veo 3.1 Fast as start + end frame (two-frame conditioning)
4. Strip Veo's audio with ffmpeg (audio is always synthesized, always discarded)

Auto-retries on Veo's audio safety filter (which trips ~50-67% of attempts on Fast).

Usage:
    GEMINI_API_KEY=AIza... python3 scripts/generate-clip-cat-cow.py

Canonical recipe. For new movements, copy this file and modify the SUBJECT / POSE /
PROMPT blocks. Don't abstract until we have 3+ clips and a clear pattern.
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY env var required (see knowledge-base/_private/credentials.md)")
IMG_MODEL = "gemini-3.1-flash-image-preview"
VEO_MODEL = "veo-3.1-fast-generate-preview"
BASE = "https://generativelanguage.googleapis.com/v1beta"

PROJECT = Path("/Users/liorme/Projects/welltread/public")
MARIA_HERO = PROJECT / "cast" / "maria.png"
MARIA_REF_SCENE = PROJECT / "scenes" / "maria_cat_cow.png"
CAT_LANDSCAPE = PROJECT / "scenes" / "maria_cat_pose.png"
COW_LANDSCAPE = PROJECT / "scenes" / "maria_cow_pose.png"

CAT_PORTRAIT = PROJECT / "scenes" / "maria_cat_pose_9x16.png"
COW_PORTRAIT = PROJECT / "scenes" / "maria_cow_pose_9x16.png"
RAW_VIDEO = PROJECT / "videos" / "test" / "maria_cat_cow_v2_mobile_raw.mp4"
FINAL_VIDEO = PROJECT / "videos" / "test" / "maria_cat_cow_v2_mobile.mp4"

MARIA_BLOCK = """A 52-year-old Latina woman with feminine gender presentation. Athletic-but-real body type with slight midsection softness, real proportional shape, never gym-airbrushed. Dark brown hair pulled back into a low casual ponytail at the nape of her neck with a few loose strands framing the face. Warm brown almond-shaped eyes. Full natural eyebrows. Warm olive skin with real texture. Light natural makeup. Match the reference images' identity exactly - same face, same hair, same body proportions, same skin tone."""

WARDROBE = """Wardrobe: fitted sage-green (#2D4F4A) tank top, no logos. Natural-color (off-white / oat) linen wide-leg pants. Barefoot. No jewelry. No watch."""

SETTING = """Setting: sun-lit minimalist home studio. Warm wood floor (mid-tone oak). Paper-cream colored walls (#FAF7F2). Soft natural daylight from a single large window positioned camera-left, just outside the frame. Color temperature ~3500K, warm golden-hour edge. Subtle 35mm film grain. Subject is on a natural-color yoga mat (no logos, no neon colors)."""

PORTRAIT_CAMERA = """Camera: locked tripod side angle from the subject's LEFT side (camera positioned to the subject's left), at low floor-adjacent height (camera approximately 12-18 inches above the floor). 35mm lens equivalent, slight foreshortening to fill the vertical frame. THIS IS A 9:16 VERTICAL PORTRAIT FRAME (mobile / phone-screen aspect) - taller than it is wide.

CRITICAL FRAMING - subject orientation must be EXACT:
- Subject's HEAD is on the RIGHT side of the frame
- Subject's HIPS and KNEES are on the LEFT side of the frame
- Body axis runs left-to-right: hips/knees (left) → torso (center) → head/shoulders (right)
- The subject faces RIGHT (her body is oriented with the head pointing rightward in the frame)
- Hands are planted on the mat below the shoulders, slightly right of center
- This must match a cow-pose reference where the subject also faces right with head on the right

Subject fills the vertical frame: the top of her back/shoulders occupies the upper-right third, her hands and knees and the mat fill the middle and lower thirds. Paper-cream wall behind her, warm wood floor below."""

FORBIDDEN_PORTRAIT = """Forbidden: no text, numerals, watermarks, captions, or typography of any kind. No other people. No props beyond the yoga mat (no plants, no posters, no wall art, no books, no dumbbells, no bands, no clocks, no mirrors, no candles, no water bottles). NO landscape/16:9/horizontal aspect ratio - this MUST be 9:16 vertical portrait orientation, taller than wide."""

CAT_PROMPT = f"""A hyperrealistic cinematic 9:16 VERTICAL PORTRAIT still of a single woman in CAT POSE on a yoga mat. Mobile-phone aspect ratio - taller than wide. This is the peak of a yoga cat-cow flow's exhale phase.

— SUBJECT —
{MARIA_BLOCK}

— POSE —
She is in a quadruped position on hands and knees on the yoga mat. Hands directly under shoulders, palms flat, fingers spread. Knees directly under hips, hip-width apart. The spine is rounded UPWARD into a smooth gentle convex arc - belly drawn UP toward the ceiling, lower back rounded toward the ceiling, shoulder blades spreading wide across her upper back. Her chin is gently tucked toward her chest, head following the natural curve of the spine, gaze toward her navel. Tailbone tucked under. EXHALE phase of cat-cow. Spine in active flexion. Anatomy plausible - no impossible angles, no collapsed shoulders, no hyperflexion of the lumbar.

Calm focused expression, peaceful, soft natural slight smile. Eyes soft, gazing toward the navel.

{WARDROBE}

{PORTRAIT_CAMERA}

{SETTING}

{FORBIDDEN_PORTRAIT}

Style: editorial wellness photography register. No oversaturation, no HDR. Hyperrealistic skin texture and fabric texture."""

COW_PROMPT = f"""A hyperrealistic cinematic 9:16 VERTICAL PORTRAIT still of a single woman in COW POSE on a yoga mat. Mobile-phone aspect ratio - taller than wide. This is the peak of a yoga cat-cow flow's inhale phase.

— SUBJECT —
{MARIA_BLOCK}

— POSE —
She is in a quadruped position on hands and knees on the yoga mat. Hands directly under shoulders, palms flat, fingers spread. Knees directly under hips, hip-width apart. The spine is curved DOWNWARD into a smooth gentle concave arc - belly dropping toward the mat, lower back gently arched (not hyperextended), chest opening forward. Her head is lifted, gaze softly forward and slightly up (NOT cranked back). Tailbone lifted up toward the ceiling. Shoulder blades drawing slightly together. INHALE phase. Spine in active extension - gentle, never extreme. Anatomy plausible - no impossible angles, no overarched lumbar, no hyperextended neck.

Calm focused expression, peaceful, soft natural slight smile. Eyes soft, gazing forward and slightly up.

{WARDROBE}

{PORTRAIT_CAMERA}

{SETTING}

{FORBIDDEN_PORTRAIT}

Style: editorial wellness photography register. No oversaturation, no HDR. Hyperrealistic skin texture and fabric texture."""


def http(req, timeout=180):
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"HTTP {e.code} on {req.full_url}\n{body[:2000]}")


def gen_still(prompt, refs, out_path):
    if out_path.exists():
        print(f"  exists, skipping: {out_path.name}")
        return
    parts = [{"text": prompt}]
    for ref in refs:
        parts.append({"inline_data": {
            "mime_type": "image/png",
            "data": base64.b64encode(ref.read_bytes()).decode("ascii"),
        }})
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "9:16"}}}
    req = urllib.request.Request(
        f"{BASE}/models/{IMG_MODEL}:generateContent?key={API_KEY}",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    res = http(req, timeout=120)
    parts_out = res["candidates"][0]["content"]["parts"]
    for p in parts_out:
        data_obj = p.get("inlineData") or p.get("inline_data")
        if data_obj:
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(base64.b64decode(data_obj["data"]))
            print(f"  saved {out_path.name}")
            return
    raise SystemExit(f"No image: {json.dumps(res)[:600]}")


def submit_veo(start_img, end_img, prompt):
    body = {
        "instances": [{
            "prompt": prompt,
            "image": {"bytesBase64Encoded": base64.b64encode(start_img.read_bytes()).decode("ascii"), "mimeType": "image/png"},
            "lastFrame": {"bytesBase64Encoded": base64.b64encode(end_img.read_bytes()).decode("ascii"), "mimeType": "image/png"},
        }],
        "parameters": {
            "aspectRatio": "9:16",
            "personGeneration": "allow_adult",
            "negativePrompt": "text, captions, subtitles, watermarks, logos, blue-white lighting, harsh shadows, multiple people, camera shake, zoom, pan, fast motion, cartoon, illustration, plastic skin, broken spine, impossible anatomy, hyperflexion, hyperextension, collapsed shoulders, warped limbs, landscape orientation, horizontal aspect",
        },
    }
    req = urllib.request.Request(
        f"{BASE}/models/{VEO_MODEL}:predictLongRunning?key={API_KEY}",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    res = http(req)
    return res["name"]


def poll_veo(op):
    t0 = time.time()
    while True:
        req = urllib.request.Request(f"{BASE}/{op}?key={API_KEY}", method="GET")
        res = http(req, timeout=60)
        elapsed = int(time.time() - t0)
        if res.get("done"):
            print(f"  done after {elapsed}s")
            return res
        print(f"  {elapsed}s elapsed...")
        time.sleep(10)


def fetch_video(res):
    if "error" in res:
        raise RuntimeError(f"Op errored: {res['error']}")
    response = res.get("response", {})
    samples = response.get("generateVideoResponse", {}).get("generatedSamples") or response.get("videos") or response.get("generatedVideos")
    if not samples:
        rai = response.get("generateVideoResponse", {}).get("raiMediaFilteredReasons")
        if rai:
            raise RuntimeError(f"FILTERED: {rai}")
        raise RuntimeError(f"No samples: {json.dumps(response)[:1500]}")
    sample = samples[0]
    video = sample.get("video") or sample
    uri = video.get("uri") or video.get("videoUri")
    if uri:
        if "key=" not in uri:
            sep = "&" if "?" in uri else "?"
            uri = f"{uri}{sep}key={API_KEY}"
        with urllib.request.urlopen(uri, timeout=240) as r:
            return r.read()
    b64 = video.get("bytesBase64Encoded") or video.get("encodedVideo")
    if b64:
        return base64.b64decode(b64)
    raise RuntimeError(f"No video data: {json.dumps(sample)[:1500]}")


def main():
    print("[2/4] Generating cow-pose portrait still (or reuse)...")
    gen_still(COW_PROMPT, [MARIA_HERO, MARIA_REF_SCENE, COW_LANDSCAPE], COW_PORTRAIT)
    print("[1/4] Generating cat-pose portrait still (orientation anchored to cow)...")
    gen_still(CAT_PROMPT, [MARIA_HERO, COW_PORTRAIT, CAT_LANDSCAPE], CAT_PORTRAIT)

    veo_prompt = """A single woman performing one slow controlled cat-cow yoga cycle on a yoga mat, filmed in 9:16 vertical portrait orientation for mobile.

She begins in CAT POSE (spine rounded UPWARD into a gentle convex arc, belly drawn up, chin tucked toward chest). Over 8 seconds she SLOWLY and CONTINUOUSLY transitions through neutral spine into COW POSE (belly dropping toward the mat, lower back gently arched, chest opening forward, gaze softly forward and up). Movement is gradual, deliberate, and anatomically smooth. Her hands stay planted directly under shoulders, palms flat. Her knees stay planted directly under hips. The spine moves through a continuous arc from flexed to extended - never collapsing, never hyperextending, never breaking. No bouncing. No camera motion - completely locked tripod shot.

Slow controlled breath visible in her ribcage. Calm focused expression throughout, soft natural slight smile.

Anatomy is plausible at every moment of the transition. The frame stays 9:16 vertical portrait throughout."""

    print("[3/4] Submitting Veo Fast (9:16)...")
    for attempt in range(1, 5):
        try:
            print(f"  attempt {attempt}/4...")
            op = submit_veo(CAT_PORTRAIT, COW_PORTRAIT, veo_prompt)
            print(f"    operation: {op}")
            res = poll_veo(op)
            raw_bytes = fetch_video(res)
            break
        except RuntimeError as e:
            if "FILTERED" in str(e) and attempt < 4:
                print(f"    {e} - retrying")
                continue
            raise
    else:
        raise SystemExit("All 4 attempts filtered")

    RAW_VIDEO.parent.mkdir(parents=True, exist_ok=True)
    RAW_VIDEO.write_bytes(raw_bytes)
    print(f"  raw saved: {RAW_VIDEO} ({len(raw_bytes)//1024}KB)")

    print("[4/4] Stripping audio...")
    if FINAL_VIDEO.exists():
        FINAL_VIDEO.unlink()
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(RAW_VIDEO), "-c:v", "copy", "-an", str(FINAL_VIDEO)], check=True)
    print(f"  final: {FINAL_VIDEO}")


if __name__ == "__main__":
    main()
