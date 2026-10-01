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
