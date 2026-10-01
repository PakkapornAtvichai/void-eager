# Asynchronous Gameplay Loop v2

## Purpose

Replace the linear demonstration loop with a minimal research-informed interruption/resumption loop in which context preservation has practical value.

## Keep

- Coupler mystery content
- Maintenance, Storage, secondary task, deduction, reflection
- React/Vite client-only architecture
- evidence vs. knowledge separation
- neutral reflection
- existing visual shell as placeholder structure

## Add only three things

1. system-timed interruption while a primary task is underway;
2. persistent/minimized Quick Pin retrieval cue;
3. one lightweight concurrent investigation thread: Power Spike.

No additional NPC system, rooms, inventory, or branching story engine.
## Canonical v2 loop

PRIMARY TASK UNDERWAY
-> asynchronous incoming incident
-> short preparation window
-> optional Quick Pin
-> forced/accepted context switch
-> bounded secondary task
-> return to open investigation hub
-> choose what to resume
-> use or ignore pinned retrieval cue
-> continue investigation
-> save hypotheses without instant truth feedback
-> later evidence may support or contradict them
-> reflection focuses on strategy/process

## Primary task timing

The interruption must not be caused by clicking "Inspect".

Opening the Maintenance report starts the primary task. After the player has been inside the report for a short scripted period, the incident arrives while the report remains visible.

Prototype timing:
- report opened;
- 12 seconds of reading time;
- incoming incident warning appears;
- 8-second preparation window;
- player may Pin current context during that window;
- player may handle immediately;
- otherwise the interruption takes over when the preparation window expires.

The timing is scripted for reliability, but asynchronous from the player's perspective.
## Quick Pin behavior

Quick Pin is not a note-taking reward and does not state whether a theory is correct.

When used, it stores:
- active thread;
- current document/scene;
- current section or evidence focus;
- player's current question.

It then minimizes into a persistent retrieval card.

The card remains available during and after the interruption until the player explicitly resumes or dismisses it.

## Two active threads

### Thread A — Coupler
Question: Was the stabilizer coupler actually replaced?
Evidence: maintenance work order, replacement serial, physical coupler in Storage.

### Thread B — Power Spike
Question: What caused the 21:11 power anomaly?
Evidence: Engineering power log showing a spike at 21:11 and protection active at 21:12.

Thread B is intentionally small. It exists to give the player a plausible competing task after interruption, not to recreate the full mystery.
## Hypotheses instead of quiz correctness

The game must allow the player to save a wrong theory.

Prototype behavior:
- player may save a current theory at the Coupler deduction screen;
- no immediate "correct/incorrect" message;
- the theory is stored as part of the case state;
- reflection reports what theory the player ended with and which evidence they used;
- later versions may let subsequent evidence weaken or overturn earlier theories.

For this v2 slice, the final theory may be:
- replacement happened;
- replacement did not happen.

The game does not deny either choice at submission time.

## Reflection

Reflection may show:
- interruption encountered;
- Quick Pin used or not;
- which thread was resumed first;
- final saved theory;
- evidence viewed;
- prompts about what helped the player recover context.

It must not label the player as good/bad at switching and must not score a theory as right/wrong.

## Definition of done

v2 is ready for frontend testing when:
- interruption arrives while reading without requiring a trigger click;
- the preparation window is visible;
- Quick Pin minimizes into a persistent cue;
- after the secondary task the player chooses between Coupler and Power Spike;
- the Pin can resume Coupler directly;
- the player can save either Coupler theory without instant correction;
- reflection records process rather than correctness;
- production build passes.
