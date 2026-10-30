# VOID-EAGER — Option A / Graphic Cleanup Implementation Checklist

**Status:** READY FOR IMPLEMENTATION — CHECKLIST ONLY. No React or CSS changed by this document.
**Prepared:** 30 October 2026
**Baseline:** main at f3d0174; gameplay P0-A implemented at b1ed2ea.
**Visual source:** docs/26-LOOP1-UI-MOCK-LAYOUT-SPEC.md (Option B).
**Gameplay source:** docs/24-LOOP1-FINAL-GAMEPLAY-DESIGN.md.
**Acceptance baseline:** tests/p0a_navigation_smoke.py and tests/p0a_loop_regression.py.

> Mission: make the existing detailed pixel-art rooms visible first, with small discoverable interaction targets, a slim objective, and compact HUD. NO new room, character, art, mystery, AI, opening NPC dialogue, evidence, or gameplay gate.

## 0. Hard boundaries / สัญญาที่ห้ามพัง

- [ ] Preserve P0-A: the player can inspect Work Order fields independently and choose a working intention. Choice persists across navigation.
- [ ] Preserve ungated Storage: reachable from the Hub before C-17, with or without a Storage Lead; tracing never teleports automatically.
- [ ] Preserve Storage-first spoiler protection: never show uninspected Work Order facts.
- [ ] Preserve existing buttons and event handlers for Coupler/Storage/Power/Case Review, pending C-17, coolant response, Quick Pin and theory.
- [ ] **Do not implement P0-B while doing graphic cleanup.** The old report-open 12-second C-17 timer, prewritten Pin and Hub return are known outstanding mechanics. Do not describe them as fixed.
- [ ] Avoid new permanent context panels, tutorial paragraphs, overlapping popovers, and CSS-only hiding that makes controls inaccessible to keyboard/touch.
- [ ] Preserve existing test IDs where reasonably possible. If a label/action is intentionally changed, update tests in the same commit and prove equivalent behavior.
- [ ] Do NOT make the private repo public or change GitHub permissions as part of UI cleanup.

## 1. Technical baseline and coordinate system (G0 / prerequisite)

**Why first:** src/styles.css is a long cascade with several historical overrides. A new late override can look correct in one screenshot and fail at another resolution.

**Current source findings, verified:**
- **src/styles.css / .game-stage** uses width min(100vw, 177.7778vh, 1920px) and aspect-ratio 16/9. Browser width is NOT necessarily the stage width. Letterboxing is expected.
- **.world-hotspot__label** is initially hidden, but a later rule around line 3052 forces opacity .93 on all enabled hotspots. This is the primary cause of permanent labels.
- **.mission-briefing** is left/top-positioned around line 2775, currently shown until dismissed; it is not a permanent post-dismiss panel.
- **.maintenance-hub-exit** is right:6.7%, top:58.5% around line 2477: conflicts visually with Junction.
- **.objective-tracker** has layout declarations around lines 3528 and 3826, including small-width overrides.
- **.status-rail.game-hud** has several earlier and later rules, including min-height:86px; Pin panel positions are overridden more than once.
- **.evidence-modal-backdrop** currently excludes roughly 11.6% bottom of the stage; layer ordering must be reviewed against the HUD.
- **GameApp.tsx** renders the global ObjectiveTracker everywhere except Storage, where StorageScene renders its own. Do not add a second tracker to Storage.

### Concrete tasks

- [ ] G0.1 Confirm clean main branch and record HEAD. Do not mix unrelated edits with graphic cleanup.
- [ ] G0.2 Capture baseline screenshots at 1024x576, 1280x720, 1464x815, and 1920x1080 for: first brief, dismissed Maintenance, Workstation, field modal, Hub, Storage closed/open/serial, Help, pending C-17, Hub Quick Pin.
- [ ] G0.3 Log browser page errors and current focus/tab behavior. Capture screenshots outside source tree or in ignored test artifacts.
- [ ] G0.4 Introduce a small, clearly named layout token section: stage top safe zone, bottom HUD height, navigation offset, overlay z-order and modal max height. Prefer one scoped layer or organized stylesheet rather than another pile of contradictory overrides.
- [ ] G0.5 Measure element rectangles using the Playwright **game-stage bounding box**, not window coordinates. Target positions in docs/26 are visual references, not hard-coded screen pixels.
- [ ] G0.6 Decide one CSS ownership path for each selector; after testing remove obsolete conflicting overrides rather than stacking one more !important.

**Gate G0:** baseline saved; P0-A tests pass before UI changes; stage size/letterboxing understood.

## 2. G1 — First-time briefing becomes a centered, dismissible dialog (highest priority)

**Files:** src/components/MaintenanceRoomScene.tsx, src/app/GameApp.tsx, src/components/EvidenceModal.tsx (or a small accessible dedicated CaseBriefDialog), src/styles.css.

**Existing hooks/test targets:** briefingVisible, onDismissBriefing, onWorkstation, briefingDismissed; mission-briefing; begin-coupler-investigation.

- [ ] G1.1 Remove the left-anchored in-room layout of .mission-briefing. The brief should be a **single centered overlay** on first entry only, 480–540px wide at the 1464x815 reference stage, with a backdrop above scene controls.
- [ ] G1.2 Keep text to 2–3 concise lines: Void-eager stabilizer failure; Glint logged a Coupler replacement; verify the claim. No opening NPC conversation.
- [ ] G1.3 Provide two explicit actions: **EXPLORE ROOM** (dismiss only) and **OPEN WORKSTATION** (dismiss then navigate). Preserve the begin-coupler-investigation test ID for the navigation action, or update its tests deliberately.
- [ ] G1.4 Add a visible close button, Escape handling and focus containment; initial focus should be inside the dialog. Restore focus on dismiss when the original control still exists.
- [ ] G1.5 Keep briefingDismissed until Restart. Restart should show the brief again. Dismissal must not mark any Work Order field as inspected.
- [ ] G1.6 Add a **CASE BRIEF** reopen route via explicit Help/case information, not a new permanent left panel. Reopening cannot re-trigger Start/Reset or teleport.
- [ ] G1.7 Avoid stacking opening brief with C-17 or evidence modal; follow the single-overlay rule.

**Acceptance:** on initial load only one centered brief; on EXPLORE, >75% room art is unobstructed and Workbench is no longer masked; on OPEN WORKSTATION, only player-selected navigation occurs; Restart reopens the brief.

## 3. G2 — One slim objective chip, optional Help

**Files:** src/components/ObjectiveTracker.tsx, src/game/objectives.ts (copy only if essential), src/components/StorageScene.tsx (tracker ownership), src/app/GameApp.tsx, src/styles.css.

**Existing selectors:** .objective-tracker--compact, .objective-tracker__content, .objective-tracker__title, .objective-tracker__toggle; current-objective, objective-hint-toggle, objective-hint-dialog.

- [ ] G2.1 Position one objective chip at top-center within the stage: width 400–470px, height about 46–52px at 1464x815; compact 260–350px at 1024x576. Protect the top-left back/Hub button.
- [ ] G2.2 Show ONE concise task label and a small **HINT ?** action; no paragraph or expanded Hint built into the chip. Full text belongs to the existing centered Hint modal.
- [ ] G2.3 Keep objective/hint **non-spoiling**: goal/possible source only, never the player's intended next action or the Coupler verdict; do not restore a second Quick Pin in Hint.
- [ ] G2.4 Enforce only one tracker per scene: GameApp excludes Storage because StorageScene already owns storageObjective(phase).
- [ ] G2.5 Ensure target is readable (do not shrink interactive text below 12–13px on 1024x576), with accessible full text on focus/Help if ellipsized.

**Acceptance:** objective stays narrow with the art still visible; Hint opens one modal; no duplicate objective in Storage; does not overlap top-left navigation or C-17.

## 4. G3 — Maintenance navigation and hotspots

**Files:** src/components/MaintenanceRoomScene.tsx, src/components/WorldAssetHotspot.tsx, src/content/maintenanceAssets.ts (bounds only if validated), src/styles.css.

**Existing selectors/test IDs:** .maintenance-hub-exit, .world-hotspot, .world-hotspot__label; workstation-hotspot, workbench-hotspot, junction-hotspot, maintenance-hub-exit.

- [ ] G3.1 Move **INCIDENT HUB** navigation from the right-mid overlay to one small **top-left** button (target x24–180 / y20–64 relative to 1464x815 reference stage). Keep route to Hub available before C-17.
- [ ] G3.2 Default Maintenance hotspot style: small glowing reticle/dot **without a permanent wide text label**. Remove/replace the late .world-hotspot label opacity .93 override; keep hover and keyboard focus labels.
- [ ] G3.3 Preserve the full clickable hit boxes from HOTSPOT_BOUNDS rather than shrinking the actual button to a tiny dot. The reticle is only a visual affordance.
- [ ] G3.4 Ensure touch discovery: for coarse pointers use a compact visible label or an explicit first-tap reveal with a clear second activation. No invisible touch-only guessing.
- [ ] G3.5 Keep clear focus rings, aria-label and a 40x40px minimum reliable hit area. Labels must not cover another hotspot or block the objective/HUD.
- [ ] G3.6 Validate Workbench, Workstation and Junction hit regions against the **actual scaled 16:9 art**, not raw browser viewport coordinates.
- [ ] G3.7 Keep open-workstation and both optional inspections working. Do not change inspection evidence or add new clickable story content.

**Acceptance:** after dismissing brief, room reads as pixel-art space rather than floating panels; the three hotspots remain discoverable with mouse, Tab/Enter and touch; Hub does not overlap Junction.

## 5. G4 — Workstation monitor density reduction without losing P0-A

**Files:** src/components/WorkstationFocusScene.tsx, src/styles.css. Keep reducer actions and observation flags unchanged.

**Existing selectors/test IDs:** .workstation-report-slot, .workorder-field-button, .workorder-intentions, .workorder-intention-choices, .workorder-active-intention; inspect-wo-service, inspect-wo-completion, inspect-wo-parts, choose-intention-*, unlock-storage-lead.

- [ ] G4.1 Retain the three field rows as independent, accessible click targets, each at least 40px high. Clicking a field still opens the factual EvidenceModal; no auto inference.
- [ ] G4.2 Replace the default **three large focus-choice buttons + active-focus paragraph** with one compact **FOCUS: [selected action] ▾** control. Opening it reveals only intentions supported by fields observed. Changing it calls the same onSetIntention callback.
- [ ] G4.3 Keep focus-choice list within monitor scroll area OR in one centered modal, never as a floating panel across the artwork.
- [ ] G4.4 Preserve player selection through room changes; there is no gameplay reset when hiding/showing the chooser.
- [ ] G4.5 Keep **TRACE PART SOURCE // B-04** secondary and accessible after Parts Reference is inspected, independently of C-17. Lead creation stays separate from navigation.
- [ ] G4.6 The monitor panel must not overflow its painted screen. Scroll internally; do not reduce evidence-row text below readable size.
- [ ] G4.7 Back button is one predictable top-left **← ROOM** control; no duplicate room-exit buttons.
- [ ] G4.8 Adapt Playwright tests to the collapsible focus menu, preserving intent-selection and seen-field assertions.

**Acceptance:** compact report and focus fit inside console at 1024x576 and 1464x815; the three source facts remain available only when clicked; the chosen focus persists.

## 6. G5 — Optional inspections, Storage and Hub

**Files:** src/components/MaintenanceInspectionScene.tsx, src/components/StorageScene.tsx, src/components/HubScene.tsx, src/styles.css.

### Workbench / Junction

- [ ] G5.1 Keep focused artworks, existing two inspection targets and centered evidence modal. Remove any permanent description/observation panels if still surfaced by CSS.
- [ ] G5.2 One top-left ← ROOM action; optional inspection targets use subtle reticles, visible on keyboard focus and mouse hover; touch remains discoverable.
- [ ] G5.3 Closing evidence returns to same focused art, not to another room.

### Storage

- [ ] G5.4 Remove redundant **STORAGE B-04 // PARTS DEPOT** overlay plaque; location is already in HUD.
- [ ] G5.5 Keep crate/Coupler/serial art visually dominant and central; only one primary physical-action label at a time, with observation details in modal.
- [ ] G5.6 No expanded Pin or report summary can cover Storage. Keep current Hub-only canResumePin protection.
- [ ] G5.7 Preserve the existing physical sequence and **Storage-first no-Work-Order-spoiler** guard. Do NOT implement manual evidence comparison (P0-C) during visual cleanup.
- [ ] G5.8 Back to Hub remains explicit; closing evidence never changes physical inspection phase.

### Incident Hub

- [ ] G5.9 Keep the existing center in-world console as the only primary information panel. Preserve clear WORKSTATION and STORAGE B-04 buttons.
- [ ] G5.10 Visually demote Power Log as OPTIONAL; shorten card copy/status rather than adding more panels.
- [ ] G5.11 Keep Case Review/End Session at the console footer with existing unlock conditions; do not change theory or incident completion guards.
- [ ] G5.12 Avoid scroll at 1464x815 if possible; at 1024x576 allow **internal console scroll**, but never clip or permanently hide a CTA.

**Acceptance:** Storage shows object first; Hub has no competing side overlays, and all existing destinations remain reachable in any order.

## 7. G6 — Shared HUD, Pin and modal layer rules

**Files:** src/components/StatusRail.tsx, src/components/EvidenceModal.tsx, src/components/IncomingInterruption.tsx, src/app/GameApp.tsx, src/styles.css.

**Existing selectors/test IDs:** .status-rail.game-hud, .hud-pin-panel, .hud-lead, .evidence-modal-backdrop, .incident-modal-backdrop, .pending-incident-tab; status-rail, quick-pin-entry, storage-lead, evidence-modal-backdrop, pending-incident-tab.

- [ ] G6.1 Keep five compact cells in the bottom HUD: Location / Current Case / Leads / Quick Pin / Evidence. Target height **80–88px** at 1464x815, with shorter **66–78px** at 1024x576 and **92–100px** at 1920x1080. Use short labels and internal responsive layout; never tiny text.
- [ ] G6.2 A lead is a button only when there is a valid navigation action; at its destination show read-only **CURRENT**; after evidence show **COMPLETE**. No duplicate Storage CTA floating elsewhere.
- [ ] G6.3 Pin is compact status by default. Hub-only saved cue may open **one intentional centered overlay** with Close/Resume; never open automatically or stay expanded on Storage/Power/evidence views. Preserve existing Pin semantics for now; P0-B changes its contents later.
- [ ] G6.4 One modal system at a time: brief, Help, evidence, saved Pin and C-17 cannot be visible in overlapping layers. Do not delete interrupted investigation state when closing UI.
- [ ] G6.5 Full-stage backdrop dimming should also cover/dim the bottom HUD and prevent clicking behind the active modal. Center the card in the portion ABOVE the HUD. Confirm z-order: art < hotspots < nav/objective < HUD < pending incident < active modal.
- [ ] G6.6 Modal Close is always visible even when body scrolls. Escape closes ordinary details, and focus returns to trigger when still mounted. No horizontal overflow at 1024x576.
- [ ] G6.7 Pending C-17 remains a **small amber tab** at top-right after minimization across rooms; no overlap with nav, Storage label (removed), or objectives. Reopen action continues to work.
- [ ] G6.8 **Known P0-B dependency:** the current C-17 timer may fire during a field dialog. Guarantee no visible modal stacking if practical without altering trigger rules; otherwise document as a blocking test for P0-B. Do not claim the meaningful-focus trigger is fixed.
- [ ] G6.9 Ensure dialog controls are keyboard usable. EvidenceModal currently traps focus assuming only Close; a 2-action Case Brief or Pin needs its own complete focus logic, not a copy of the one-button trap.

**Acceptance:** modal content stays legible, one expanded surface only, HUD remains visible when idle but never covers evidence.

## 8. G7 — Responsive visual QA + regression + safe delivery

### Test matrix (capture each after implementation)

| View / state | 1024x576 | 1280x720 | 1464x815 | 1920x1080 |
|---|---|---|---|---|
| Maintenance — first opening brief | [ ] | [ ] | [ ] | [ ] |
| Maintenance — after dismiss / hover+focus | [ ] | [ ] | [ ] | [ ] |
| Workstation — fields / collapsed focus / expanded focus | [ ] | [ ] | [ ] | [ ] |
| Evidence Modal — Work Order + Storage | [ ] | [ ] | [ ] | [ ] |
| Hub — Workstation, Storage, Power and Case Review | [ ] | [ ] | [ ] | [ ] |
| Storage — closed, opened, serial | [ ] | [ ] | [ ] | [ ] |
| C-17 pending / alert dialog | [ ] | [ ] | [ ] | [ ] |
| Hub saved Quick Pin / no-Pin state | [ ] | [ ] | [ ] | [ ] |

### Automated checks

- [ ] G7.1 Run npm run build; TypeScript/Vite pass.
- [ ] G7.2 Run the existing tests/p0a_navigation_smoke.py and tests/p0a_loop_regression.py after adapting labels/menu interactions if necessary. They must still test **Storage-first, pre-C-17 lead, focus persistence, with-Pin and without-Pin full loop**.
- [ ] G7.3 Assert 0 page errors, 0 off-stage actionable controls, no horizontal scrolling, and each visible CTA has clickable/interactable bounds.
- [ ] G7.4 Check keyboard sequence: first brief → explore → Workstation → field detail → Close → focus chooser → Hint → back → Hub → Storage.
- [ ] G7.5 Check touch/coarse-pointer equivalent of each hotspot; avoid hover-only instructions.
- [ ] G7.6 Try minimising C-17 and moving through Hub → Storage; pending tab remains visible and reopenable, with no visual collision.
- [ ] G7.7 Compare before/after screenshots for crowding, label overlap, console fit, and cropped original art; do not rely on CSS build success alone.
- [ ] G7.8 Commit layout changes in small reviewable groups; update docs/00-PROJECT-STATUS.md and README when actually implemented. Verify remote commit and clean worktree.

### Stop/rollback conditions

Stop and revert the most recent change if: an original hotspot becomes unclickable; Work Order observations disappear; Storage becomes gated; clicking CLOSE changes rooms; Saved Pin blocks Storage; an incident silently vanishes; a modal cannot be dismissed; or an important CTA is clipped at the smallest test screen.

## 9. Implementation order / avoid patching in circles

| Order | Work package | Risk | Completion evidence |
|---|---|---|---|
| 0 | G0 baseline + stage-aware layout tokens | Low | Baseline screenshots, unchanged tests |
| 1 | G1 centered first-time briefing | Medium | Clean Maintenance after dismiss |
| 2 | G2 thin objective + G3 hotspot/Hub exit | Medium | Room art visible, mouse+keyboard+touch usable |
| 3 | G4 compact Workstation focus selector | Medium–High | All three fields and intentions still function |
| 4 | G5 Workbench/Junction/Storage/Hub cleanup | Medium | Object and console remain focal |
| 5 | G6 HUD + single-overlay rules | High | No visual overlap and pending C-17 remains accessible |
| 6 | G7 screenshots and regression across four sizes | High | Tests pass, screenshots reviewed |

**Do not declare the Graphic Cleanup done after only resizing the first screen.** Finish one global set of rules and verify all four primary scenes.

## 10. Completion checklist / what “done” actually means

- [ ] Maintenance opens with one centered brief; after dismiss it is clean, with no fixed left panel.
- [ ] Room Hotspots are subtle at rest but discoverable on mouse, touch and keyboard.
- [ ] The Hub exit never hides/overlaps Junction.
- [ ] Workstation retains all P0-A facts and selected intention, with the chooser collapsed by default.
- [ ] Storage-first never reveals unobserved Work Order data.
- [ ] Hub keeps its main and optional destinations clearly distinct.
- [ ] HUD is shorter and modal layers never overlap it.
- [ ] C-17 pending state remains accessible; no visual clutter from Pin outside Hub.
- [ ] Four viewport screenshot matrix inspected, 0 page errors, both P0-A regression suites pass.
- [ ] No new art, room, narrative, AI, spoiler or alternate mystery added.

**After graphic cleanup is verified:** proceed to **P0-B** (meaningful interruption timing, player-selected Quick Pin, direct return to original task). That is a separate gameplay change, not part of Option A.
