# Implementation Tickets

These tickets are intentionally small. Complete in order unless a blocker requires a swap.

## T01 — App skeleton
Create Vite + React + TypeScript app, basic scene container, responsive desktop-first layout, and local run/build scripts.

## T02 — Game state
Implement the state shape in `07-GAME-STATE-AND-FLAGS.md` with explicit transitions. No global state library unless clearly necessary.

## T03 — Maintenance investigation
Render replacement record, create the Coupler thread, and persist evidence-found state.

## T04 — Interruption + Quick Pin
Trigger the interruption at the scripted point. Implement Quick Pin and non-pin switch behavior.

## T05 — Secondary task
Implement one short bounded system task. It must return cleanly to the investigation.

## T06 — Resume
Restore the original investigation. If pinned, surface saved context without solving the mystery for the player.

## T07 — Storage cross-check
Implement new-coupler inspection and serial comparison.

## T08 — Deduction
Require the relevant evidence. Wrong answer should prompt reconsideration, not game-over.

## T09 — Reflection
Show interruption encountered, whether Quick Pin was used, and 2–3 neutral reflection prompts.

## T10 — Yoko integration
Replace placeholders only after the complete loop works.

## T11 — Playtest fixes
Fix only issues that block comprehension, completion, or demo stability before visual extras.
