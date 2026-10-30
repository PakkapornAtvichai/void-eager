# Void-eager — 3-Day Serious-Game Prototype

Void-eager is a browser-based mystery prototype about interruption, task switching, and recovering a train of thought.

## Current Loop 1 design contract (29 October 2026)

**Implementation status (30 October 2026): P0-A (investigation), P0-B (C-17 and context recovery), P0-C (observed evidence and revisable theory), Graphic Cleanup G0–G3, and the physical Hub/door navigation correction are implemented and tested. Remaining: Workstation focus/HUD graphic cleanup and P0-D interactive reflection.** See [P0-A implementation and tests](docs/25-LOOP1-P0A-IMPLEMENTATION.md). The complete one-loop gameplay direction is in:

- **[Loop 1 Gameplay Design — Thai](docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN-TH.md)** (read this first)
- **[Loop 1 Final Gameplay Design / Implementation Contract](docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN.md)** (full event rules, state and branch tests)
- **[Loop 1 UI Mock Layout Specification](docs/26-LOOP1-UI-MOCK-LAYOUT-SPEC.md)** (Option B: visual wireframes, screen measurements, modal rules, and responsive criteria; design only)
- **[Loop 1 Graphic Cleanup Implementation Checklist](docs/27-LOOP1-UI-IMPLEMENTATION-CHECKLIST.md)** (Option A: exact component/CSS tasks, dependencies, test matrix)
- **[Graphic Cleanup G0–G3 implementation and QA](docs/28-GRAPHIC-CLEANUP-G0-G3-IMPLEMENTED.md)** (centered brief, slim objective, relocated Hub, accessible hotspot labels)
- **[P0-B Interruption & Context Recovery implementation](docs/29-P0B-INTERRUPTION-RECOVERY-IMPLEMENTED.md)** (meaningful C-17, player-chosen cue, deliberate return, guaranteed completed incident)
- **[P0-C Evidence & Deduction implementation](docs/30-P0C-EVIDENCE-DEDUCTION-IMPLEMENTED.md)** (observed-only citations, explicit comparison, Storage-first, revisable theory, optional Power fact gating)
- **[Physical Hub Navigation & Case Board Correction](docs/31-PHYSICAL-NAVIGATION-AND-HUB-CASEBOARD.md)** (left/right corridors are actual room movement, Storage through Maintenance yellow door, Hub central screen is evidence/theory rather than teleport navigation)

These documents supersede conflicting gameplay sequencing in older prototype notes. They do not authorize a return to the historical six-room mystery or new NPC conversations.

## Current production rule

Build one complete gameplay loop first. New mystery pieces may reuse that loop; they must not expand the engine until the core loop is playable and tested.

## Prototype loop

FOCUS -> INTERRUPTION -> [OPTIONAL QUICK PIN] -> SWITCH -> RECOVER -> COMPARE -> DEDUCE -> REFLECT

The first vertical slice is the Coupler puzzle: the player checks whether a stabilizer coupler was actually replaced, gets interrupted, optionally uses Quick Pin, handles a short secondary task, resumes the investigation, cross-checks evidence, and makes a deduction.

## Historical three-day scope (original planning baseline)

- Day 1: core loop skeleton, research lock, placeholder UI
- Day 2: complete Coupler vertical slice, Yoko asset integration
- Day 3: playtest, fixes, reflection, presentation/demo polish

Start with `docs/00-PROJECT-STATUS.md` and `docs/04-3-DAY-ROADMAP.md`.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Historical implementation checkpoint (superseded)

T01–T04 are implemented: app skeleton, explicit client-side game state, Maintenance work-order investigation, scripted interruption, and Quick Pin/non-pin switching.

Historical note: this checkpoint was recorded before the secondary classification screen existed. It is not the current implementation instruction.

T05–T06 are also complete: the interruption now contains a bounded classification task and returns to Maintenance with different resumption support depending on whether Quick Pin was used.

## Frontend-test boundary

T01–T09 are implemented. The vertical slice is complete through reflection and is ready for frontend playthrough testing.

Use `docs/15-FRONTEND-TEST-BRIEF.md` before changing UX or adding visual polish.

## Frontend-test readiness

T07–T09 are implemented. The Coupler vertical slice now runs from Maintenance through interruption/recovery, Storage cross-check, evidence-supported deduction, and reflection.

Frontend test instructions live in `docs/15-FRONTEND-TEST-HANDOFF.md`.

## Historical Asynchronous Loop v2 (superseded by current design contract)

The current experimental build replaces the linear interruption flow with a research-informed asynchronous loop.

Key differences:
- interruption arrives while the Maintenance report is already being read;
- the player gets a brief preparation window;
- Quick Pin minimizes and persists;
- Pin restores the saved report reading position;
- after the interruption, the player chooses between Coupler and Power Spike threads;
- final Coupler output is a saved theory, not an instantly graded quiz answer.

See `docs/17-ASYNCHRONOUS-LOOP-V2.md` and `docs/18-FRONTEND-TEST-BRIEF-V2.md`.
