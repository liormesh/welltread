"""Prompt fragments for cat-cow (mat-based, hands-and-knees).

Used in S8 (James lead + David override), S11 (Eleanor). tier 2, mat only.

Hands-and-knees on the mat, full quadruped cat-cow flow. 8s covers one full
cycle (cow → cat → return to neutral).
"""
from pathlib import Path
from cast import CHARACTERS, SETTING, FORBIDDEN_PORTRAIT, cast_refs


WIDE_CAMERA = """Camera: locked tripod side angle from the subject's LEFT (camera positioned to the subject's left side at low floor-adjacent height, ~12-18 inches above the floor). 35mm lens equivalent. THIS IS A 9:16 VERTICAL PORTRAIT FRAME.

Clean side profile of the subject in tabletop quadruped position on a yoga mat. Visible: hands flat on the mat directly under the shoulders, knees on the mat directly under the hips, body forming a tabletop with the spine in neutral horizontal alignment. Spine clearly visible from the side for cat-cow articulation."""


def _pose_block() -> str:
    return """— POSE (cat-cow on hands-and-knees, neutral tabletop) —
Subject in tabletop quadruped on a yoga mat. Hands flat on the mat directly under the shoulders, fingers spread, weight distributed across the palms. Knees on the mat directly under the hips, hip-width apart. Tops of feet flat on the mat behind the knees.

Spine in NEUTRAL alignment — long, level, parallel to the floor. Neither arched (cow) nor rounded (cat). Head in neutral, gaze softly down at the mat between the hands. Belly drawn slightly in for core engagement, but spine itself is neutral. Calm focused expression."""


def build_stills(cast: str, angle: str, scenes_dir: Path) -> dict:
    prompt = f"""A hyperrealistic cinematic 9:16 VERTICAL PORTRAIT still of a single person on hands-and-knees on a yoga mat in the neutral tabletop position of a cat-cow yoga flow. Mobile-phone aspect ratio.

— SUBJECT —
{CHARACTERS[cast]['block']}

Match the reference images' identity exactly.

{_pose_block()}

{WIDE_CAMERA}

{SETTING}

{FORBIDDEN_PORTRAIT}

Style: editorial wellness register. Hyperrealistic skin and fabric texture. Anatomically plausible quadruped position with no impossible angles or hyperextension."""
    out = scenes_dir / f"{cast}_cat_cow_W_pose_9x16.png"
    return {"start": (prompt, cast_refs(cast), out)}


def build_veo_prompt(cast: str, angle: str) -> str:
    return """A single person performing one slow controlled cat-cow yoga cycle on hands-and-knees on a yoga mat, filmed in 9:16 vertical portrait orientation for mobile.

The subject begins in tabletop position (hands under shoulders, knees under hips, spine neutral). Over 8 seconds:

  Frames 0-2s: starting tabletop position, spine neutral, calm centering breath.
  Frames 2-4s: SLOWLY moves into COW — inhale, drops the belly toward the mat (gently, not deeply), opens the chest forward. The head follows the spine in a smooth low arc — chin extends slightly forward and the gaze travels softly toward the floor in front of the hands (NOT upward to the ceiling, NOT pulling the head back behind the shoulders). The neck stays long and continuous with the spine. Spine in active gentle extension. Hands and knees stay planted.
  Frames 4-6s: SLOWLY transitions through neutral and into CAT — exhale, rounds the back upward toward the ceiling, gently tucks the chin down toward the chest, gaze travels softly down between the hands. Spine in active gentle flexion. Hands and knees still planted.
  Frames 6-8s: returns through neutral to IDENTICAL starting tabletop. Spine neutral, gaze down at mat, hips back over knees. Frame 8 matches frame 0.

CRITICAL: BOTH HANDS stay PLANTED FLAT on the mat the ENTIRE 8 seconds — palms down, fingers spread, NEVER lifting, NEVER even momentarily floating. NEITHER HAND leaves the mat at any point. Same goes for the knees: BOTH KNEES stay planted flat on the mat the entire 8 seconds, never lifting or sliding. Hand and knee positions are FIXED — only the spine articulates between cow (extension) and cat (flexion).

CRITICAL HEAD/NECK MOTION: the head and neck stay continuous with the spine throughout. The head does NOT pull back behind the shoulders, does NOT lift upward toward the ceiling, does NOT look like the subject is trying to come up to seated. In COW phase, the head extends LOW and FORWARD — the gaze is on the floor a foot or two in front of the hands, NOT up at the ceiling. In CAT phase, the chin tucks DOWN toward the chest. The neck arc is small and smooth — not a craned-back, neck-extended-skyward look.

The cat and cow phases are gentle — natural anatomical range, NOT forced extremes. NO hyperextension of the lumbar in cow. NO collapse of shoulders in cat. If at any frame a hand or knee lifts off the mat, OR the head pulls back/up away from the spine line, the clip is wrong.

Calm focused expression throughout, soft natural slight smile. No camera motion. The frame stays 9:16 vertical portrait throughout. No talking, no mouth movement. Editorial wellness register."""
