# VOID-EAGER — P0-C Evidence & Deduction Implementation

**Date:** 30 October 2026
**Status:** P0-C IMPLEMENTED AND VERIFIED. This report describes source/code changes, not a new narrative branch.

**Design basis:** `docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN.md` sections 7–9, and the independent gameplay review. **Scope preserved:** existing Loop 1 Coupler puzzle, existing Work Order, the Storage B-04 physical unit, optional 21:11/21:12 Power log, one provisional theory. No characters/rooms/AI/new plot facts.

## What changed in-game

1. **Opening a Work Order is not the same as reading evidence.** `OPEN_WORK_ORDER` now sets `workOrderOpened` without adding evidence. Only clicking the individual Service, Completion or Parts Field adds that observation and increments the HUD evidence count. The same existing records and serial are retained.
2. **Source-specific citations.** New `src/game/evidence.ts` defines actual observed-source labels, including `MAI_WO_SERVICE`, `MAI_COUPLER_REPLACEMENT_RECORD`, `MAI_INSTALL_VERIFY_FIELD`, `STO_NEW_COUPLER`, `STO_NEW_COUPLER_SERIAL` and the two optional Engineering logs. Case Review shows only items actually inspected. The reducer rejects empty and unobserved citations, not just the UI.
3. **Storage condition and unit serial can be inspected independently.** The crate must first be opened; after that, the player may inspect the condition or serial in either order. These are two separate physical observations, not an automated verdict. `storageCrateOpen` persists on revisits and through C-17 task switching.
4. **Player-initiated source comparison.** The COMPARE SOURCES action is offered **only after** both a Work Order serial field (Completion or Parts) and the Storage serial plate have been read. The compare modal shows two clearly attributed sources; Completion, Parts verification, and condition remain marked *not inspected* unless actually seen. SAVE COMPARISON TO CASE records the inspected source IDs in `comparedEvidenceIds`, not a theory. The player may close, recheck the Work Order by explicit navigation, or revisit the comparison without losing the original Storage visual.
5. **Individual serial, not batch.** The physical plate fact explains that `GSC-8842-A` identifies this particular unit. Matching printed identifiers are a cross-source observation, not a separate guilty/false-record flag.
6. **Early and revisable Case Review.** The Hub offers CASE REVIEW after the **first actual Coupler observation** (Work Order field / physical condition / serial), not only after final Storage serial. A saved working theory can be reopened from the Hub via REVISE THEORY. Both interpretations remain acceptable without grading. Editing theory/evidence citations shows unsaved changes; saved choices persist and can be revised after exploring more sources. End Session **still requires** a saved theory plus a resolved C-17, preserving P0-B.
7. **Power Log is evidence, not an unsolicited verdict.** Initially 21:11 and 21:12 entries are labelled unread; the log's `ANOMALY CONTAINED` appears **only after** inspecting the 21:12 protection entry. Power remains optional and cannot unlock the Coupler Case Review all by itself.
8. **Small landscape Case Review:** at 1024×576, compact heading/fieldsets and a properly placed action footer keep the Case Review within the area **above** the HUD for normal observation counts. Many-source views scroll internally and continue to permit citation selection and saving.

## Modified areas

| File | What changed |
|---|---|
| `src/game/evidence.ts` **new** | Source catalog, observed-evidence and Case Review guard helpers |
| `src/game/types.ts` | Work Order accessed, crate-open and saved comparison state |
| `src/game/state.ts` | Observation-gated evidence, source-pairing guard, source-validated theory, crate persistence |
| `src/app/GameApp.tsx` | Honest report-open state, first-source Case Review, comparison callbacks and Storage return |
| `src/components/StorageScene.tsx` | Independent condition/serial action buttons, source-only modal, explicit side-by-side comparison |
| `src/components/DeductionScene.tsx` | Visible source provenance, provisional/revisable theory and citations |
| `src/components/HubScene.tsx` | Provisional Case Review early, REVISE THEORY after save |
| `src/components/PowerScene.tsx` | 21:11/21:12 source details hidden until inspected |
| `src/game/objectives.ts` | Neutral wayfinding aligned with actual observed facts |
| `src/styles.css` | Storage action placement, source comparison columns, case footer and small-screen layout |
| `tests/p0c_evidence_deduction.py` **new** | Ten independent browser regression paths |
| `tests/p0a_navigation_smoke.py`, `tests/p0a_loop_regression.py`, `tests/p0b_interruption_recovery.py` | Reconcile prior tests with explicit comparison and precise observed-source copy |

## Verified behavior and evidence

**Playwright browser checks:** `tests/p0c_evidence_deduction.py` **10/10 PASS**:
- Opening a Work Order alone doesn't create evidence or unlock theory.
- Inspecting a single Service field unlocks an honest provisional Case Review without any unseen Completion, Parts, Storage or Serial facts; empty citations are not accepted.
- Storage-first **serial before condition** does not disclose Work Order status, and permits condition inspection later.
- Explicit compare requires both actual observed serial sources and shows unread fields honestly; saving comparison doesn't select a theory.
- Theory can be saved early and revised with newly inspected evidence; both answer and citations persist.
- Engineering 21:12 protection/containment is withheld until clicked, and Power-only observations do not unlock the Coupler theory.
- Completion-only Work Order comparison works without revealing unread Parts verification.
- Case Review with seven inspected sources stays usable at **1024×576**.
- Comparison + theory submission work at **1024×576**, **1280×720**, and **1920×1080**.

**Existing suites re-run and passing after updating expected evidence interactions:**
- `tests/p0a_navigation_smoke.py`: **5/5**.
- `tests/p0a_loop_regression.py`: **6/6**, with and without Quick Pin and through Reflection.
- `tests/p0b_interruption_recovery.py`: **7/7**.
- `tests/p0b_edge_regression.py`: **PASS** (Workstation scroll, C-17 once, remote-console from Storage).
- `tests/g0_g3_visual_layout.py`: **4/4 viewports + touch/keyboard**.
- `npm run build` and `git diff --check`: **PASS**.

Screenshots and raw browser logs are stored **outside the Git repository** on `omnissiah` in `D:\_work\yoko\VOID-EAGER-p0c-qa`. Visual QA includes the serial comparison before save, evidence list after saving, revision, optional Power, all-seven-sources Case Review, and small viewport layouts.

## Known remaining work (not hidden or marked complete)

- **G4–G6 Graphic Cleanup:** Workstation intention selector still expands below its visible screen; Hub/Storage/hotspot polish, bottom HUD density and popover/modal visual hierarchy still need the scheduled visual cleanup. Case Review's *typical* 1024×576 case now fits, but long seven-source views intentionally require internal scrolling.
- **P0-D Reflection:** the self-report questions are still static rather than interactive, and process reflections still need the planned neutral choices.
- Workbench/Junction remain optional atmosphere/inspection areas. This implementation does not invent extra case evidence or re-open the historical multi-room plot.
- **No behavioral effectiveness claims:** successful automation is not evidence that the game improves ASD-related outcomes. Human playtesting is still necessary.

**Next recommended task:** finish **G4–G6** visual cleanup (especially Workstation and compact HUD), then **P0-D** interactive Reflection, then a first-time-player playtest of the complete Loop 1.
