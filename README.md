# Void-eager — 3-Day Serious-Game Prototype

Void-eager is a browser-based mystery prototype about interruption, task switching, and recovering a train of thought.

## Current production rule

Build one complete gameplay loop first. New mystery pieces may reuse that loop; they must not expand the engine until the core loop is playable and tested.

## Prototype loop

FOCUS -> INTERRUPTION -> SAVE CONTEXT -> SWITCH -> RETURN -> RECOVER -> DEDUCE

The first vertical slice is the Coupler puzzle: the player checks whether a stabilizer coupler was actually replaced, gets interrupted, optionally uses Quick Pin, handles a short secondary task, resumes the investigation, cross-checks evidence, and makes a deduction.

## Three-day scope

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

## Implementation checkpoint

T01–T04 are implemented: app skeleton, explicit client-side game state, Maintenance work-order investigation, scripted interruption, and Quick Pin/non-pin switching.

The secondary task screen is intentionally a placeholder. Continue with T05 only after reviewing this checkpoint.

T05–T06 are also complete: the interruption now contains a bounded classification task and returns to Maintenance with different resumption support depending on whether Quick Pin was used.

## Frontend-test boundary

T01–T09 are implemented. The vertical slice is complete through reflection and is ready for frontend playthrough testing.

Use `docs/15-FRONTEND-TEST-BRIEF.md` before changing UX or adding visual polish.

## Frontend-test readiness

T07–T09 are implemented. The Coupler vertical slice now runs from Maintenance through interruption/recovery, Storage cross-check, evidence-supported deduction, and reflection.

Frontend test instructions live in `docs/15-FRONTEND-TEST-HANDOFF.md`.

## Asynchronous Loop v2

The current experimental build replaces the linear interruption flow with a research-informed asynchronous loop.

Key differences:
- interruption arrives while the Maintenance report is already being read;
- the player gets a brief preparation window;
- Quick Pin minimizes and persists;
- Pin restores the saved report reading position;
- after the interruption, the player chooses between Coupler and Power Spike threads;
- final Coupler output is a saved theory, not an instantly graded quiz answer.

See `docs/17-ASYNCHRONOUS-LOOP-V2.md` and `docs/18-FRONTEND-TEST-BRIEF-V2.md`.
