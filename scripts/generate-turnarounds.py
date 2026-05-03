#!/usr/bin/env python3
"""Generate 16 character turnaround stills via Gemini 3.1 Flash Image.

4 characters x 4 angles (front / three_quarter / profile / back).
Each call conditions on the character's canonical hero PNG.

Usage:
    GEMINI_API_KEY=AIza... python3 scripts/generate-turnarounds.py

Idempotent: skips angles whose output already exists. Delete a file to regen it.
"""
import base64
import json
import os
import sys
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY env var required (see knowledge-base/_private/credentials.md)")
MODEL = "gemini-3.1-flash-image-preview"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

CAST_DIR = Path("/Users/liorme/Projects/welltread/public/cast")
OUT_BASE = CAST_DIR / "turnarounds"

CHARACTERS = {
    "eleanor": {
        "ref": CAST_DIR / "eleanor.png",
        "block": """A 67-year-old white woman with feminine gender presentation. Slim build, narrow shoulders, slightly elongated frame, soft natural posture. Shoulder-length silver-grey hair worn loose with a slight wave (no styling product, naturally falling). Soft smile lines around warm hazel eyes. Subtle wrinkles around eyes and mouth — age-affirming, never softened or smoothed. Skin shows real texture and tone variation. No makeup or barely-there natural makeup.
Wardrobe: fitted sage-green (#2D4F4A) long-sleeve henley with the top button open, no logos. Natural-color (off-white / oat) linen wide-leg pants. Barefoot. No jewelry. No watch.""",
    },
    "james": {
        "ref": CAST_DIR / "james.png",
        "block": """A 70-year-old Black man with masculine gender presentation. Tall, lean, athletic build. Broad shoulders, dignified upright posture. Full short-cropped grey hair, neatly trimmed grey beard along the jawline (close-cropped, never bushy). Deep brown eyes with gentle smile lines at the corners. Skin shows real texture and tone variation — age-affirming. No styling product visible in hair.
Wardrobe: soft sage-green (#2D4F4A) long-sleeve henley with the top button closed, no logos. Loose charcoal cotton joggers (no logos, no stripes). Barefoot. No jewelry. No watch.""",
    },
    "maria": {
        "ref": CAST_DIR / "maria.png",
        "block": """A 52-year-old Latina woman with feminine gender presentation. Athletic-but-real body type — toned with slight midsection softness, real proportional shape, never gym-airbrushed. Dark brown hair pulled back into a low casual ponytail at the nape of her neck with a few loose strands framing the face. Warm brown almond-shaped eyes. Full natural eyebrows. Warm olive skin with real texture. Light natural makeup acceptable (no contouring, no heavy eye makeup).
Wardrobe: fitted sage-green (#2D4F4A) tank top, no logos. Natural-color (off-white / oat) linen wide-leg pants. Barefoot. No jewelry. No watch.""",
    },
    "david": {
        "ref": CAST_DIR / "david.png",
        "block": """A 47-year-old white man with masculine gender presentation. Average build with slight desk-job softness around the midsection — real proportions, not gym-perfect, midsection softness visible and intentional (do not slim it). Salt-and-pepper hair, mostly brown with grey at the temples, worn short and slightly tousled. Brown eyes behind subtle round wire-frame glasses (always on, clean lenses, no light reflections obscuring the eyes). Light brown two-day beard stubble. Warm tan skin with real texture.
Wardrobe: sage-green (#2D4F4A) long-sleeve henley with the top two buttons open, no logos. Tan cotton chinos rolled at the ankle (a small amount of ankle visible). Barefoot. No jewelry. No watch. The round wire-frame glasses are always present and identical to the reference image.""",
    },
}

ANGLES = {
    "front": """Subject faces the camera directly, body squared to the lens, shoulders parallel to the camera plane. Both feet visible, planted hip-width apart, toes pointing forward. Both arms relaxed at the sides, palms facing the body, fingers softly curved. Head facing forward, eyes meeting the camera lens with calm acknowledgment.
Camera height: chest-level (camera lens aligned with the subject's sternum). Lens equivalent 50mm full-frame, no perspective distortion.""",
    "three_quarter": """Subject's body rotated 45° to the camera's right (subject's left shoulder is closer to the camera, right shoulder further away). Both feet remain hip-width apart, planted naturally, not crossed — feet rotate with the body. Both arms relaxed at the sides. Head turned to face the camera (counter-rotated against the body) with calm acknowledgment, eyes meeting the camera lens. This is the default editorial three-quarter pose.
Camera height: chest-level. Lens equivalent 50mm full-frame.""",
    "profile": """Subject's body rotated 90° to the camera's right — pure side profile, fully perpendicular to the lens. Far shoulder fully behind the near shoulder. Both feet planted hip-width apart along the profile axis. Both arms relaxed at the sides. Head facing forward in the body's direction (NOT turned toward camera) — eyes look forward into the negative space ahead of the subject, soft focus, calm. Visible ear, jawline, and full body silhouette in clean profile.
Camera height: chest-level. Lens equivalent 50mm full-frame.""",
    "back": """Subject faces directly away from the camera, body squared away from the lens, shoulders parallel to the camera plane. Both feet planted hip-width apart, heels visible, toes pointing away from camera. Both arms relaxed at the sides. Head facing forward (away from camera) — back of the head fills the upper third of the subject. Hair, neckline of the garment, and full back silhouette clearly visible. NO turning back to look over the shoulder — pure back view.
Camera height: chest-level. Lens equivalent 50mm full-frame.""",
}

PROMPT_TEMPLATE = """A hyperrealistic full-body editorial portrait of a single person standing in a neutral A-pose (feet hip-width apart, arms relaxed at sides, weight evenly distributed, shoulders soft and level, head facing forward and slightly tilted into the camera with calm acknowledgment).

This image is one frame in a four-angle character turnaround sheet. It must match the reference image's identity exactly — same face, same hair, same body proportions, same skin tone, same eye color, same age. Treat the reference image as the canonical truth for who this person is.

— SUBJECT —
{character}

— ANGLE —
{angle}

— SETTING —
Sun-lit minimalist home studio. Warm wood floor (mid-tone oak, not red, not bleached). Paper-cream colored walls (#FAF7F2) with subtle paper-grain texture. The room is empty — no props, no furniture, no plants, no posters, no wall art, no books, no dumbbells, no resistance bands, no clocks, no mirrors, no candles, no water bottles. Nothing in frame except the subject and the wall/floor.

— LIGHTING —
Soft natural daylight from a single large window positioned camera-left, just outside the frame. Color temperature ~3500K (warm, golden-hour edge — never blue-white, never sterile). Gentle falloff across the body. No harsh shadows, no hard rim light, no artificial fill that flattens the face. Subtle shadow side preserves form on the face and body.

— APPAREL RULES (strict) —
Exactly the wardrobe described in the character block. No additions. No jewelry of any kind (no rings, bracelets, necklaces, earrings). No watch. No visible logos. No socks — barefoot. No hat, cap, or headband. Hair exactly as described in the character block.

— DEMEANOR —
Soft natural slight smile suggesting calm contentment — the warm gentle smile someone gives across a room when greeting a friend. NOT a wide grin, NOT teeth-showing, NOT laughing, NOT smirking, NOT detached, NOT stern. Eyes meeting camera (or the implied camera direction for non-front angles) with kind acknowledgment. Posture upright but never stiff — natural weight distribution, soft knees, relaxed hands, fingers neither rigid nor curled.

— STYLE —
Editorial wellness photography register, not fitness-app aspirational. Subject occupies the center vertical of the frame. Generous negative space above and below. Subtle 35mm film grain pass. Brand color palette evoked through wardrobe and warm wall/floor — sage green (#2D4F4A) on apparel, paper cream walls, warm wood floor, warm skin tones. No oversaturation. No HDR. No clarity push.

— FRAMING —
Full body head-to-toe. Approximately 10% headroom above the head and 10% foot room below the feet. Vertical 4:5 aspect ratio. Subject sharp from head to feet — even depth of field across the body.

— FORBIDDEN —
No text, numerals, watermarks, captions, or typography of any kind anywhere in the image.
No other people, no body parts of others, no implied second figure.
No reflective surfaces (no mirrors, no glass) that could fragment identity.
No environmental storytelling props — pure neutral turnaround backdrop only.
No extra accessories beyond what the character block specifies.
No costume changes from the reference image.
No expression that breaks the demeanor rule above."""


def generate_one(char_id: str, angle_id: str) -> tuple[str, str, bool, str]:
    """Generate a single turnaround. Returns (char, angle, ok, message)."""
    char = CHARACTERS[char_id]
    out_path = OUT_BASE / char_id / f"{angle_id}.png"
    if out_path.exists():
        return char_id, angle_id, True, f"skipped (exists): {out_path}"

    ref_b64 = base64.b64encode(char["ref"].read_bytes()).decode("ascii")
    prompt = PROMPT_TEMPLATE.format(character=char["block"], angle=ANGLES[angle_id])

    body = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {"inline_data": {"mime_type": "image/png", "data": ref_b64}},
            ]
        }],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }

    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        return char_id, angle_id, False, f"HTTP {e.code}: {e.read().decode('utf-8', errors='replace')[:500]}"
    except Exception as e:
        return char_id, angle_id, False, f"ERR: {type(e).__name__}: {e}"

    # Find the inline_data image part
    try:
        parts = data["candidates"][0]["content"]["parts"]
        for p in parts:
            if "inlineData" in p:
                img_b64 = p["inlineData"]["data"]
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(base64.b64decode(img_b64))
                return char_id, angle_id, True, f"saved {out_path} ({len(img_b64)//1024}KB b64)"
            if "inline_data" in p:
                img_b64 = p["inline_data"]["data"]
                out_path.parent.mkdir(parents=True, exist_ok=True)
                out_path.write_bytes(base64.b64decode(img_b64))
                return char_id, angle_id, True, f"saved {out_path} ({len(img_b64)//1024}KB b64)"
        return char_id, angle_id, False, f"no image in response: {json.dumps(data)[:500]}"
    except (KeyError, IndexError) as e:
        return char_id, angle_id, False, f"parse error {e}: {json.dumps(data)[:500]}"


def main():
    jobs = [(c, a) for c in CHARACTERS for a in ANGLES]
    print(f"Generating {len(jobs)} turnarounds with {MODEL}...")
    results = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        futures = {ex.submit(generate_one, c, a): (c, a) for c, a in jobs}
        for fut in as_completed(futures):
            r = fut.result()
            results.append(r)
            status = "OK " if r[2] else "FAIL"
            print(f"  [{status}] {r[0]:8s} {r[1]:14s}  {r[3]}")
    ok = sum(1 for r in results if r[2])
    print(f"\nDone: {ok}/{len(jobs)} succeeded.")
    return 0 if ok == len(jobs) else 1


if __name__ == "__main__":
    sys.exit(main())
