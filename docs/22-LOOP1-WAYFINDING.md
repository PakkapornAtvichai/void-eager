# VOID-EAGER Loop 1 — Current Objective / Optional Hints

Updated: 2026-10-28

## Player problem

In the first-play walkthrough, the player could click scenery and progress through screens but could not tell what to look for or why a particular navigation choice mattered. In particular, Coolant Alert C-17 sends the player to the Incident Hub, while the Storage Lead does not become available until the player intentionally returns to the Coupler work order and uses TRACE SERIAL. The existing HUD showed only the case question and the count of actionable leads, not a clear next action.

## Resolution (wayfinding, not a new case or puzzle)

- A compact **NEXT OBJECTIVE** banner identifies one actionable current goal at a time.
- The **NEED A HINT?** control opens a short, optional explanation of *where* and *why* without selecting answers, opening doors, marking evidence or advancing any state.
- Objectives are derived from existing `GameState` and the currently visible inspection context; the reducer is unchanged.
- When players explore the optional Workbench/Junction or Engineering Power log, objectives acknowledge the exploration rather than declaring the player wrong or teleporting them.
- The Incident Hub directly differentiates return to Workstation, the newly available Storage Lead, Case Review and closing the session.
- Physical Storage objectives follow the existing state of the crate: closed -> opened -> inspected -> serial read.
- The guidance never states whether the replacement was actually installed; the player must still compare the work order with the observed physical part and record a provisional theory.

## Player-facing objectives

| Context | Current objective | Optional hint |
| --- | --- | --- |
| First Maintenance arrival | Find Glint's maintenance work order | Open the central Workstation; other hotspots optional |
| Workstation unopened | Open the maintenance record | Use ACCESS RECORD |
| Report reading | Check the recorded replacement against its proof | Inspect sections 02 and 03, look for installation support |
| System interruption | Respond to coolant alert | Quick Pin optional; choose Handle incident |
| Coolant response | Classify the alert | Compare sensor readings and select/log a response |
| Alert complete | Return to Incident Hub | Travel to Hub and choose what to resume |
| Hub after interruption | Resume Coupler investigation | Return to Workstation or use Quick Pin; trace the serial |
| Coupler report after alert | Use TRACE SERIAL beneath work order | Parts Reference, then select TRACE SERIAL -> STORAGE |
| Storage Lead available | Follow Storage B-04 lead in HUD | Select green Replacement Serial lead; no auto-teleport |
| Storage crate | Open -> inspect -> locate serial | Click corresponding physical object actions |
| Serial observed | Compare the two serials | Read Coupler Plate / Work Order, return to Hub |
| Hub with serial checked | Open Case Review | Record an evidence-supported working theory |
| Theory saved | Return to Hub / end session | Ending is player-directed; can still explore |
| Reflection | Reflect on recovery | Review what helped you resume; restart is optional |
| Optional Power | Inspect 21:11 -> check 21:12 -> return | Understand this is additional context, not the required Coupler evidence |
| Optional Workbench/Junction | Inspect or return to Workstation | Exploration is optional and does not create extra evidence |

## Guardrails

- Scope remains **only Loop 1**.
- No new rooms, characters, hints that auto-complete clues, gated navigation, automatic story transitions, or theory correctness feedback.
- Objective text changes when state changes. Hints close automatically when the objective changes.
- The persistent top banner does not cover primary controls in the 1280x720, 1464x815 or 1920x1080 desktop layouts.
- Only intentional interruptions can take over the player task. Objectives never trigger the interruption.

## Verification

- TypeScript production build passes and `git diff --check` passes.
- Automated player path validated the objective IDs from initial Maintenance to Reflection, including optional exploration/Power, both hint states, physical Storage transitions, theory saving and restart (0 JavaScript page errors).
- Screenshot checks reviewed at the player's 1464x815 scale.
- Multi-resolution overlap check: no collapsed objective banner intersections with relevant interactive scene surfaces at 1280x720, 1464x815 and 1920x1080. At 1024x576, the Coolant monitor has additional space below the banner with an internal scroll if needed.

## Next human playtest

Ask a first-time player to play without an external walkthrough. Observe whether they:
1. understand the question and find the Work Order;
2. recognize the interruption as a separate short task;
3. resume the Coupler thread or intentionally choose the optional Power context;
4. locate and follow the Storage Lead;
5. compare the serials and save a provisional theory;
6. recognize how Quick Pin helps (or does not help) after switching.

Record where they open NEED A HINT?, where they hesitate, and whether labels or goals remain ambiguous. Do not interpret hint usage as a failure.
