# Codex Visual UX Audit — Loop 1

## 1 Verdict

**WORKS BUT VISUAL CONTINUITY NEEDS WORK**

**Screenshot observation:** Maintenance and Workstation have a distinct industrial game look. The coolant task, Incident Board, Power Spike, Storage, theory, and reflection are centered cards on a nearly black field. The transition between those two visual modes is conspicuous.

**Inference:** The loop appears demoable, and the key distinctions—external interruption, optional Pin, explicit thread choice, explicit Lead following, and ungraded theory—are represented. The biggest gap is the visual world around those mechanics, especially when evidence depends on seeing a physical object.

## 2 Screenshot-by-screenshot findings

### A — Maintenance, report, interruption, Pin

- **01:** The Maintenance room establishes a strong place and visual language. In this view, hotspots and available actions aren’t apparent from the screenshot; the player may have to discover where to interact.
- **03:** The Workstation close-up continues that visual language. The report is integrated into the terminal, but it fills most of the scene.
- **04–05:** The interruption warning reads as a UI event over the current work, and Pin/Handle are visible. The pinned state is still legible as part of the warning. The warning card sits close to the bottom HUD, making those two layers feel crowded.
- The same Workstation background recurs across 03–05. That helps preserve place during the interruption, but leaves little indication that the report is a working terminal rather than a static backdrop.

### B — Coolant task, board, Power Spike, open Pin

- **06:** The coolant task is a web-form-like card floating in empty black space. The content reads clearly, but it has no apparent connection to the ship or an incident system.
- **08 and 12:** The Incident Board is also a floating card. The open Quick Pin appears as a small card at the bottom right, separate from the board and close to the HUD. It reads as retrievable saved context, though its presentation resembles a tooltip.
- **10:** The Power Spike uses the same card style and empty field. The log lines are clear; the reported anomaly feels more like a form page than a ship console.

### C — Resume, Lead, Storage

- **13:** Resuming returns to the Workstation, which makes the place change understandable. The Pin card remains detached at the lower right; the available “Room” control is not visually prominent in this shot.
- **14:** The Storage Lead appears in the HUD while the player remains at the workstation, matching the intended no-teleport behavior. The Lead is small relative to the scene and its action state is not obvious at a glance.
- **15:** The navigation overlay explicitly names Storage B-04. This is an understandable, brief transition, though it reads as a location label over a dimmed screen more than movement into a connected space.
- **16:** The Storage arrival breaks spatial continuity: a centered card on black replaces the workstation view, but shows no depot, crate, or coupler.

### D — Serial, theory, reflection

- **18:** The serial comparison is clear as text, but the key evidence—the coupler still physically in Storage—is asserted in a card rather than shown as an object.
- **19–20:** The theory form and saved state communicate “working theory” and no instant correctness judgment. The screen keeps the web-card appearance.
- **21:** Reflection is neutral and summarizes process rather than scoring the player. It looks like the same generic card shell; the “post-incident” location label does not connect to the preceding world.

## 3 P0 issues

None evident in these 1920×1080 sheets. The displayed path includes the core loop and its important choices.

## 4 P1 issues

- Storage has no visible environment or physical object, even though the object’s presence is central evidence.
- Six later scenes use the same black-field/card presentation, which weakens the Maintenance/Workstation art direction.
- The open Pin and HUD occupy adjacent lower-screen space; at some states the retrieval card appears detached from its stable HUD location.
- Lead count and appearance do not distinguish a newly unlocked Lead from one already followed or completed.
- Some important navigation controls are not prominent in the screenshots: room/back from the Workstation, return from Storage, and the Power Spike “back to active threads” action.
- The broad maintenance-room view does not visibly advertise its interactive areas.

## 5 HUD state model

Keep a compact HUD with **Location**, **Current Thread or Current Task**, **Leads**, **Quick Pin**, and **Evidence**. Give scene content room to breathe; show Pin details only when intentionally opened.

| Scene | Recommended HUD contents |
|---|---|
| Maintenance room | Location: Maintenance; thread: Coupler question; available Lead if unlocked; compact Pin/evidence counts |
| Workstation | Location: Maintenance / Workstation; thread: Coupler question; Lead action if available; Pin/evidence counts |
| Interruption warning | Keep the same location and thread; show incoming incident as a temporary attention cue; Pin status and warning actions remain distinct from the HUD |
| Coolant task | Location: Incident System / C-17; label the active work as **Current Task: Coolant telemetry**, not an investigation thread; retain the interrupted Coupler context in Pin |
| Incident Board | Location: Incident Board; show **No thread selected** or **Choose a thread**; avoid repeating the board’s heading as a current thread |
| Power Spike | Location: Engineering / Power Log; thread: Power Spike question; evidence count updates as logs are inspected |
| Resumed Workstation | Location: Maintenance / Workstation; thread: Coupler question; show Pin as a retrieval action and the Storage Lead as a separate navigation action |
| Storage | Location: Storage / B-04; thread: Coupler question; Lead should read followed/current or visited, rather than remain an unexplained disabled action |
| Theory | Location: Case Review; thread: Coupler question; preserve neutral evidence count and Pin access if it remains usable |
| Reflection | Location: Post-Incident; no active thread—show a brief case summary or omit Current Thread; keep process reflection in the scene itself |

**Current Thread semantics:** Coolant is a temporary secondary task, so “Current Thread” is imprecise there. The Incident Board is a selection point, not a thread. Coupler remains semantically correct in Storage and theory. Reflection is retrospective; showing the live Coupler question there would be stale.

## 6 Scene/transition model

1. Keep the Maintenance room and Workstation as the visual anchor for the primary investigation.
2. Render the incoming warning over the existing work; change only the UI attention cue, consistent with the art handoff.
3. Present coolant as an incident-system task that occupies attention, with an in-world system panel or a clearly intentional full-screen console treatment.
4. Return to the Incident Board as an explicit choice point. Do not imply that either thread is mandatory.
5. Let resuming a Pin return to its saved location/context. Keep the Pin visually available until resumed or dismissed.
6. Let Trace Serial unlock and announce the Storage Lead without moving the player. Following it is a distinct navigation action.
7. Make the Storage transition brief and explicit, then arrive in a recognizable Storage space with the relevant object visible.
8. Treat theory and reflection as case-system panels or overlays. Saving a theory gives no correctness verdict; reflection remains process-focused.

The screenshot transition at 15 is explicit enough in wording. The arbitrary-feeling part is the destination at 16: there is no environment to establish that the player arrived.

## 7 Placeholder asset table

These are recommendations for the asset plan, not assets generated during this read-only audit. Keep dynamic text and controls in HTML. Use image slots/configuration so Yoko can replace temporary art without changes to game logic.

| Scene | Recommendation | Method | Exact spec | Priority |
|---|---|---|---|---|
| Coolant/system task | Reuse Yoko existing art | Reuse Maintenance/Workstation art as a dimmed backdrop, with task panel in HTML | Existing 16:9 scene; no new image. All telemetry, options, and buttons stay HTML. | P1 |
| Incident Board | CSS/HTML only | Style as a ship terminal or system panel over reused art | No image. Cards, labels, and actions remain HTML. | P1 |
| Power Spike | CSS/HTML only | Add terminal/log treatment and a small HTML waveform or status visualization | No image. Times, log text, chart labels, and controls stay HTML. | P1 |
| Storage environment | Generate placeholder image now | One replaceable environmental background | **1920×1080, 16:9, opaque.** Industrial parts depot with a readable crate/coupler area and lighting consistent with Yoko’s Maintenance art. No text, UI, labels, or baked-in buttons. Swap through an asset slot with no logic change. | P1 |
| Coupler/crate object | Generate placeholder image now | Prefer an isolated focal object that can sit over the Storage background | **1024×1024 square, transparent.** Replacement coupler and crate with serial area left blank/unreadable; serial and condition remain HTML. Replaceable image slot; no logic change. | P1 |
| Theory/current case review | CSS/HTML only | In-world review panel or terminal overlay | No image. Questions, choices, evidence labels, saved status remain HTML. | P1 |
| Reflection | CSS/HTML only | Reuse the review panel treatment with a quieter post-incident header | No image. Summary and prompts remain HTML. | P2 |
| Navigation/location transition | CSS/HTML only | Short fade plus location label | No image. Location text remains HTML. | P2 |
| Thread/Lead/Pin/evidence icons | CSS/HTML only | Consistent small line/icon badges or typographic markers | No image. Use CSS/SVG-in-code or text glyphs; labels and counts remain HTML. | P2 |

## 8 Minimum demo-complete scope

- Preserve the Maintenance and Workstation treatment as the visual standard.
- Give Storage one recognizable environment plus a visible coupler/crate focal object. Keep its serial and evidence text as HTML.
- Re-skin the other full-screen cards as ship-system panels using CSS/HTML and, where it helps, reused Yoko art.
- Clarify Current Task versus Current Thread at the coolant task and Incident Board.
- Give the Lead clear available/followed states.
- Keep Pin details collapsed by default, clearly labeled as saved context, and positioned so they don’t compete with scene actions.
- Make room/back and return actions visually discoverable wherever the player can navigate away.

## 9 Automation feasibility

The proposed pipeline can finish Loop 1 without bloating the repository if placeholder art stays limited to the missing Storage environment/object and the other scenes use reusable HTML/CSS panels. Keep drafts outside the app bundle or in an ignored scratch location; retain only the selected assets needed by the demo.

**Automatable:** deterministic scene capture at the target desktop size; capture of key state transitions; checks that scene labels/actions appear in each capture; first-pass visual comparison for layout, overlap, contrast, and repeated styling; and a GPT-6 Luna audit using the same checklist each iteration.

**Human/Yoko judgment remains necessary:** whether generated pixels match the ship’s art direction, whether the coupler reads as meaningful physical evidence, whether locations feel spatially coherent, and whether attention cues and investigative ambiguity feel right. Luna can identify visual inconsistencies; it should not be the final authority on mystery legibility or production-art fit.

A prior workspace note flags a narrow-screen Quick Pin overlap and a focus-handoff issue after “Handle now.” These desktop sheets do not resolve those questions, and that prior responsive patch was recorded as unverified. [MEMORY.md](</home/h3retek/.codex/memories/MEMORY.md:97>)

## 10 Top 8 next actions

1. Give Storage a recognizable depot environment and visible coupler/crate.
2. Bring the black-field card scenes into the Maintenance/Workstation visual language.
3. Separate “Current Task” from “Current Thread” and make the Incident Board’s selection state explicit.
4. Add clear Lead states for newly available, followed, and completed/visited.
5. Reposition or restyle the open Quick Pin so it reads as a stable retrieval control and stays clear of scene actions.
6. Make room/back and return navigation controls obvious in Workstation, Storage, and Power Spike.
7. Add subtle visual affordances for the Maintenance room’s interactive hotspots.
8. Capture and review the interruption and Pin paths at mobile size as a separate visual pass.

## 11 Repository safety

Confirmed: I made no repository changes. I only read the supplied screenshots, named docs, relevant source components/state, and memory guidance. No files were edited, installed, formatted, committed, or tested.

