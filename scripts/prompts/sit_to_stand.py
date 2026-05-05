"""Prompt fragments for sit-to-stand (no-hands sit-to-stand).

Used in S7 (Eleanor lead + Maria progression-demo override), S11 (Eleanor).
tier 2.5, chair only.

Arms crossed at the chest, subject stands from sitting and sits back down
without using hands. 8s covers ONE complete sit→stand→sit cycle, returning
to the starting seated position.
"""
from pathlib import Path
from cast import CHARACTERS, SETTING, FORBIDDEN_PORTRAIT, cast_refs


WIDE_CAMERA = """Camera: locked tripod three-quarter angle from the subject's LEFT-FRONT (camera at the subject's chest height when seated, ~46 inches above the floor). 50mm lens equivalent. THIS IS A 9:16 VERTICAL PORTRAIT FRAME.

Subject fills the vertical frame seated on a simple wooden chair (oak/walnut tone). Both feet flat on the floor, hip-width apart, knees at 90°. ARMS are CROSSED at the chest — left hand on right shoulder, right hand on left shoulder, forearms crossed forming an X across the upper chest. The chair is fully visible — seat, legs, back. The arm-cross + chair-seated position is the focal element."""


def _pose_block() -> str:
    return """— POSE (sit-to-stand starting seated position) —
Subject seated upright on a simple wooden chair (oak/walnut tone), at the front edge of the seat. Both feet flat on the floor, hip-width apart, slightly back under the knees so the calves are nearly vertical. Knees at roughly 90°.

ARMS CROSSED at the chest — left hand resting on the right shoulder, right hand resting on the left shoulder, forearms crossed forming an X. This arm position prevents using the arms to assist standing.

Spine tall and engaged. Eyes soft, gazing forward. Calm focused expression, ready to stand."""


def build_stills(cast: str, angle: str, scenes_dir: Path) -> dict:
    prompt = f"""A hyperrealistic cinematic 9:16 VERTICAL PORTRAIT still of a single person seated on a wooden chair with arms crossed at the chest, ready to perform a sit-to-stand exercise. Mobile-phone aspect ratio.

— SUBJECT —
{CHARACTERS[cast]['block']}

Match the reference images' identity exactly.

{_pose_block()}

{WIDE_CAMERA}

{SETTING}

{FORBIDDEN_PORTRAIT}

Style: editorial wellness register."""
    out = scenes_dir / f"{cast}_sit_to_stand_W_pose_9x16.png"
    return {"start": (prompt, cast_refs(cast), out)}


def build_veo_prompt(cast: str, angle: str) -> str:
    return """A single person performing one slow controlled sit-to-stand without using hands, filmed in 9:16 vertical portrait orientation for mobile.

The subject begins seated upright on a wooden chair, ARMS CROSSED at the chest. Over 8 seconds:

  Frames 0-1s: starting seated position, arms crossed, calm centered breath.
  Frames 1-3s: NATURAL HUMAN MOTION — first the chest leans forward over the knees with a smooth hip-hinge (a person leaning forward to stand), THEN the legs press into the floor and the body rises with continuous flowing motion. The standing motion is FLUID and ORGANIC, like a real adult standing up — NOT a stiff, segmented, robotic vertical lift. Subtle natural micro-shifts in posture during the rise. The hip-hinge → leg-drive → upright sequence flows together as one continuous human movement. Arms stay crossed at the chest THROUGHOUT — the subject does NOT use the arms to push off the chair or balance. By frame 3, the subject is fully standing with knees soft (slightly bent), spine tall.
  Frames 3-5s: brief hold standing, calm and tall, arms still crossed.
  Frames 5-7s: SLOWLY lowers back down with the same NATURAL HUMAN MOTION — hinges at the hips, sends the hips back, bends the knees with control, lowers smoothly onto the chair seat. The descent is fluid and organic, NOT segmented, NOT robotic — a real person sitting down. Arms still crossed.
  Frames 7-8s: settles in starting seated position — IDENTICAL to frame 0.

CRITICAL: arms stay crossed at the chest the ENTIRE 8 seconds — they do NOT uncross, do NOT swing forward for momentum, do NOT touch the chair, do NOT touch the thighs. The arm-cross is the safety/form mechanic.

CRITICAL MOTION QUALITY: the standing and sitting movements are smooth, organic, human-natural — like watching a real adult get up from a chair. NOT robotic, NOT mechanically segmented, NOT a rigid vertical elevator-lift. The natural sit-to-stand sequence is hip-hinge forward + simultaneous gentle leg drive + smooth rise to upright, all flowing together. Subtle natural sway and weight shifts are expected and good. If the body looks like it's being lifted vertically by an invisible scaffold rather than driven by the legs and hips, the clip is wrong.

Knees soft when standing — never locked, never below 90° when sitting. Calm focused expression. No camera motion. The frame stays 9:16 vertical portrait throughout. Editorial wellness register."""
