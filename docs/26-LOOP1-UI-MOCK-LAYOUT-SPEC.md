# VOID-EAGER — Loop 1 UI Mock Layout Specification

**Design lock proposal — 30 October 2026**
**Status: visual/layout specification only; NOT implemented in CSS or components.**
**Basis:** Current P0-A source at commit `b1ed2ea`, Maintenance, Workstation, Hub, Storage artwork and the player's overcrowding screenshots.
**Scope:** Loop 1 scenes and shared UI. Gameplay rules remain governed by docs/24. Opening NPC conversation remains deferred.

## 1. One visual system / กติกาที่ใช้ทุกหน้า

**Design goal:** The scene is always the main image. Primary task visible, detail only on interaction. No permanent left mission panel, no unexplained floating popup.

**Reference canvas:** 1464×815 from the current playtest. Percentage coordinates below are **relative to the visible game stage**, not the browser page. HUD uses an anchored bottom zone. Treat values as target ranges; final pixel tuning must be screenshot-tested rather than copied blindly.

| Layer | Z-order | Persistence | Design rule |
|---|---|---|---|
| Environment / source art | 0 | Always | Art fills stage using existing `object-fit: contain`/scene proportions; do not crop clues |
| Interactive hotspots / console | 10–25 | When interactive | Reticle or button stays clickable; label on hover, focus and touch tap |
| Tiny nav + objective chip | 30–45 | While exploring | Never cover central evidence, never overlap each other |
| Compact bottom HUD | 50 | Normally visible | Read-only status first, explicit actions only; no auto-expanded drawers |
| Pending C-17 tab | 75 | Only while unresolved | Small amber corner pill, reopens pending alert |
| Single centered modal / interruption | 110+ | Only after player action or trigger | Background dimmed, HUD cannot cover modal, Close visible, Escape supported for ordinary evidence |

**Only one expandable surface at a time.** Evidence dialog, Help, saved Pin, Case Brief and C-17 alert must not be open simultaneously. In-world backgrounds remain visible behind a translucent backdrop, but are not interactive while modal is open.

**Typography:** minimum 13px interactive text at 1464×815, 14–16px modal body, 16–22px modal title, 12–13px status text. Use a short label rather than squeezing text below readable size. Touch/keyboard clickable targets **at least 40×40px** (44px preferred) even if reticle artwork is smaller.

**Scene-first budget:** Aim for **75% unobstructed art** in Maintenance and Storage when no modal is open; this is a design target to verify visually, not a mathematical guarantee. Never place instructional copy across the main artwork by default.

## 2. Shared global layout at 1464×815

Target zones:

- **Scene area:** x 0–1464, y 0–706 (roughly 87% height); bottom HUD below.
- **Objective chip:** anchored top center, x ~500–964, y 10–57, target **width 400–470**, height **46–52px**. Contains one short objective and tiny Hint icon. **Do not use 2-line paragraph guidance**; longer guidance belongs in Help modal.
- **Room exit / back:** top-left **x 24–180, y 20–64** where available. Never share its corner with the objective chip.
- **C-17 pending:** top-right **x ~1230–1436, y 78–123** (only when pending), avoiding Storage location tag by hiding that tag when the incident is pending.
- **Bottom HUD:** x 16–1448, y ~718–803, height **80–88px**. Place 5 compact values in one strip: Location · Case question · Leads · Quick Pin · Evidence. No explanatory paragraphs.
- **Layering:** the HUD may be dimmed by the modal backdrop but must never render above it or retain an opened Pin panel across rooms.

### Shared wireframe (not to scale)

```text
╔════════════════════════ GAME ART / ROOM ════════════════════════╗
║ [← Back / Exit]         [CASE: Verify Coupler   (?)]           ║
║                                                                  ║
║                                                                  ║
║                ENVIRONMENT ART + SMALL HOTSPOTS                  ║
║                                                                  ║
║                      · optional reticles                        ║
║                                                                  ║
╠════════════════════ COMPACT STATUS STRIP ══════════════════════╣
║ LOCATION | CASE | LEADS | QUICK PIN | EVIDENCE                   ║
╚══════════════════════════════════════════════════════════════════╝
```

**Behavior:** At 1024×576, keep the objective one compact line with ellipsis and an accessible full title on focus/Help. Do not increase height of objective or bottom HUD to absorb long copy.

## 3. Maintenance Room — first screen and normal exploration

**Current problem:** A left briefing panel, top objective, three labels, Hub exit and bottom HUD are all present at once. The mission panel blocks the Workbench; Hub nav overlaps Junction. These are separate UI elements, not problems with artwork.

### Default after starting

```text
╔════════════════════════ MAINTENANCE ═══════════════════════════╗
║ [← Hub]              [Verify Coupler (?)]                       ║
║                                                                  ║
║          [· Workbench]         [· Workstation]      [· Junction] ║
║                                                                  ║
║                      ROOM ART UNOBSTRUCTED                      ║
║                                                                  ║
╠════════════════════════ COMPACT HUD ════════════════════════════╣
║ Maintenance | Coupler case | 00 Leads | Pin 00 | Evidence 00    ║
╚══════════════════════════════════════════════════════════════════╝
```

- **Remove permanently visible `mission-briefing` from the room.**
- **Opening brief appears once as centered modal:** width **480–540px**, content 2–3 lines and actions **BEGIN INVESTIGATION** (closes onto room) and **OPEN WORKSTATION** (explicitly navigates). Close icon returns to room; don't leave the user trapped. Save `briefingSeen` state until restart.
- **Case Brief reopening:** a small accessible control inside Help / case information, not another floating card.
- **Hotspots:** the existing clickable Workbench, Workstation, Junction image regions remain where the art implies them. Base state: reticle/dot only. Hover/focus: label appears near the dot; touch first tap reveals label / provides a large confirmation target. **Do not reduce clickable area** when labels are hidden.
- **Incident Hub:** replace existing mid-right `maintenance-hub-exit` with single **top-left** nav button `← HUB`. This is available independently of C-17, consistent with P0-A.
- The objective chip only says **“Open Workstation”** when no report has been read; it doesn't repeat the brief.
- No text panels on the left while exploring.

### Room acceptance screenshots

Capture: first launch **brief modal**, post-dismiss **clean room**, Workbench hover, Junction hover, pending alert. Verify no overlapping labels and all three hotspots still keyboard/click accessible.

## 4. Workstation — in-world console, not a wall of controls

Keep the original focused Workstation art and its physical monitor surfaces.

```text
╔════════════════════════ WORKSTATION ═══════════════════════════╗
║ [← Room]         [Inspect WO-4471 (?)]                           ║
║                                                                  ║
║    [small nav]      ┌────── MAIN MONITOR ──────┐ [small status]  ║
║                     │ WO-4471                 │                 ║
║                     │ 01 Service Record       │                 ║
║                     │ 02 Recorded Completion  │                 ║
║                     │ 03 Parts Reference      │                 ║
║                     │─────────────────────────│                 ║
║                     │ Focus: [chosen task ▾]  │                 ║
║                     │ [TRACE PART SOURCE]     │                 ║
║                     └─────────────────────────┘                 ║
╠════════════════════════ COMPACT HUD ════════════════════════════╣
╚══════════════════════════════════════════════════════════════════╝
```

- **Main interactive monitor** stays within existing `workstation-report-slot`; **never increase its footprint beyond the visible console frame**.
- Fixed three rows (button ≥40px high) for existing fields. Only the selected row opens the **centered field modal**.
- **Focus selector is a compact single row** when closed: `FOCUS: Trace issued part ▾`. Clicking expands choices **inside the monitor's scrollable region** or as one center modal. Do not stack three full-size intention buttons + active-focus paragraph in the default state.
- **Trace Part Source** is a secondary action available after inspecting Parts Reference (P0-A); don't hide it behind C-17. The lead is created in place; destination navigation is a separate step.
- **Source facts** (serial, verification status) stay inside clicked-field modal. Do not display uninspected records in permanent monitor/status overlays.
- Back is one top-left `← ROOM` button. Other monitor images can remain decorative/technical, but don't masquerade as independently clickable navigation.
- Workstation report area scrolls **internally** when needed; full page/HUD does not scroll.
- After closing a modal, focus returns to the clicked field row. Keyboard Tab must not reach controls behind the modal.

## 5. Workbench & Junction — optional detailed inspection

- Focused artwork fills the stage. Permanent UI: top-left `← ROOM`, one objective chip, bottom HUD, **2–3 subtle detail hotspots**.
- No side description panel and no permanent top-right shortcut to Workstation.
- Detail hotspot click → one centered modal (title, one or two factual sentences, **CLOSE**).
- If C-17 is pending, the small amber pill remains at the top right; opening incident closes any ordinary Help detail first.
- The optional nature is shown in a small objective category or Help; **don't repeat “optional” in a paragraph over the asset**.

## 6. Storage — the object is the main UI

```text
╔══════════════════════════ STORAGE B-04 ════════════════════════╗
║ [← Hub]           [Inspect the crate (?)]                      ║
║                                                                  ║
║                                                                  ║
║                      [ LARGE CRATE ART ]                         ║
║                         ◉  OPEN CRATE                            ║
║                                                                  ║
║                                                                  ║
╠════════════════════════ COMPACT HUD ════════════════════════════╣
║ Storage B-04 | Coupler | Lead status | Pin 01 | Evidence 02     ║
╚══════════════════════════════════════════════════════════════════╝
```

- Remove the permanent `STORAGE B-04 // PARTS DEPOT` top-right plaque; the Location field already shows location. This frees the top-right for the C-17 pending pill.
- Keep the existing crate/Coupler/Serial assets at visual center: target artwork region **x 250–1210, y 125–675**, no adjacent description panel.
- A single primary action is visually dominant at any given physical step. The P0-C gameplay plan may later allow condition/serial selection in either order after opening the crate.
- All observations appear in one centered modal after an explicit click. Only source facts, **not premature conclusions**.
- **Quick Pin status never expands over Storage**. If saved, HUD says `Pin: Saved`, not `RESUME REPORT`; the actual cue is available only in intentional recovery UI.
- **Lead status in Storage** is read-only (`Current` or `Complete`); doesn't display a destination button for the room you're already in.
- Modal comparison, when P0-C is implemented, uses existing centered modal width 620–720px, **two clearly labeled source columns**, no additional left-floating report panel.
- Escape/Close restores the Storage object view and does not change the current physical inspection phase.

## 7. Incident Hub — a selection screen, not another investigation panel

```text
╔════════════════════════ INCIDENT HUB ══════════════════════════╗
║                        [Choose location (?)]                    ║
║                                                                  ║
║                  ┌──── CENTRAL CONSOLE ────┐                    ║
║                  │ COUPLER CASE           │                    ║
║                  │ [Workstation] [Storage] │                    ║
║                  │                        │                    ║
║                  │ Power log (Optional)   │                    ║
║                  │ [Review Power]         │                    ║
║                  │                        │                    ║
║                  │ [Case Review / End]    │                    ║
║                  └────────────────────────┘                    ║
╠════════════════════════ COMPACT HUD ════════════════════════════╣
╚══════════════════════════════════════════════════════════════════╝
```

- The central Hub console is the **only primary content panel**; avoid adding side cards over the corridors.
- **Primary row:** Workstation + Storage as two equally visible destinations for the same Coupler case.
- **Secondary row:** Power Log clearly labeled `OPTIONAL`, visually lighter than the main case.
- **Footer action:** Case Review if available, or End Session when permitted. Don't add a long paragraph telling players to go to Storage first.
- 1 title, up to 2 status lines, and max **4 action buttons** visible in console without scrolling at 1464×815.
- The Hub's explanatory text may be reopened through Hint, not permanently placed under each card.
- Expandable Quick Pin, if applicable, is explicitly summoned from HUD and opens as **one centered dialog**, not a left-floating panel overlapping the Hub's console.
- The left/right corridor art remains visible. Location is already in HUD; no duplicate location text plaques.

## 8. Overlay, Help, Brief, and C-17

| Overlay type | Center size at 1464×815 | Body maximum | Close / behavior |
|---|---|---|---|
| Opening Case Brief | width 480–540, height content-sized (max 420) | 3 brief lines | Begin/Explore, X, accessible reopen via Help |
| Evidence detail | width 520–640, max height 530 | 1–3 factual lines or source fields | CLOSE + Escape + return focus |
| Work Order field | width 520–640, max height 530 | actual inspected source facts | CLOSE + Escape |
| Optional Hint | width 480–560 | max 2–3 sentences | CLOSE + Escape, never auto-solves |
| Quick Pin cue | width 480–560 | chosen intention only | CLOSE/RESUME; never overlays a different location by default |
| C-17 incident | width 520–620, max height 530 | 2 short lines + actions | HANDLE / SAVE / LATER; pending stays |
| Compare Evidence | width 640–720, max height 560 | two source columns, one short question | CLOSE + explicit Save Comparison |

- **Modal backdrop:** darken environment, z above bottom HUD and every in-world nav; center relative to **game stage above the HUD**, not relative to entire browser page.
- Modal shell must have sufficient contrast and **visible CLOSE** top-right. The exception is any explicitly blocking in-progress task where Close means Leave Task; do not silently abandon C-17.
- Alert arrival should **wait until an existing evidence dialog closes** (later P0-B), rather than stacking dialogs.
- Only one pending incident exists. If minimized, a small amber `C-17 PENDING` badge/button stays in the same predictable corner on all exploration scenes until handled.
- Use a single `DialogLayer`/portal strategy for implementation if helpful, but this document does not mandate rewriting the UI framework.

## 9. Responsive coordinates and overflow policy

| Target screen | Objective | Bottom HUD | Central modal | Notes |
|---|---|---|---|---|
| 1920×1080 | 440–520w, 50–56h | 92–100h | up to 700w | Respect console art; don't stretch UI with viewport |
| 1464×815 | 400–470w, 46–52h | 80–88h | up to 640w normal | **Primary reference** |
| 1280×720 | 350–440w, 46–52h | 76–84h | up to 600w | Keep hotspot labels from nav corners |
| 1024×576 | 260–350w, 42–48h | 66–78h | up to min(90vw, 540px) | Tiny objective text remains readable; scroll modal interior if necessary |

- Keep 16px outer safe margin minimum wherever possible.
- **No horizontal scrolling** and no buttons clipped behind HUD.
- Internal report/modal scrolling is allowed; evidence source remains reachable without dragging the whole game.
- At 1024×576, modal max height is roughly **game stage minus HUD minus 30px**. CLOSE stays in a sticky/header-visible position.
- Hover-only label designs need keyboard focus labels and a touch/tap accessible equivalent; reticles themselves may be tiny but hit targets cannot.

## 10. Implementation mapping — for Option A later, not yet executed

| Component / file | Intended visual work |
|---|---|
| `MaintenanceRoomScene.tsx` | Remove permanent left briefing; render one-time modal; move Hub nav to top-left |
| `WorldAssetHotspot.tsx` + hotspot CSS | Reticle as default; reveal label on hover, focus and touch intent |
| `ObjectiveTracker.tsx` | Shrink into thin chip with one-line title and Help action |
| `StatusRail.tsx` | Condense five status groups, prevent expandable popovers over art |
| `WorkstationFocusScene.tsx` | Compact intentions into one selector; retain 3 clickable evidence rows |
| `MaintenanceInspectionScene.tsx` | Preserve art-first modal pattern and one back action |
| `StorageScene.tsx` | Remove redundant top-right plaque; preserve modal-first object inspection |
| `HubScene.tsx` | Simplify central console hierarchy; lower prominence of Power |
| `EvidenceModal.tsx` | Enforce topmost centered overlay, close access, focus restoration |
| `IncomingInterruption.tsx` | Match shared overlay measurements; amber pending remains non-overlapping |
| `src/styles.css` | Consolidate scattered overrides into coherent scene tokens; check at 4 resolutions |
| `src/app/GameApp.tsx` | Coordinate mutually exclusive overlays and first-time brief state; preserve P0-A routing |

**No Source changes in this specification phase.** Keep current game state and assets until the layout is accepted.

## 11. Visual acceptance criteria / ต้องผ่านก่อนเรียกว่าสำเร็จ

1. First screen after dismissing brief has **no left panel**, and the three physical Maintenance hotspots remain visible.
2. Hub navigation is in a corner and never overlaps Junction hotspot.
3. Top objective does not cover the center environment/console, and never expands in place.
4. Bottom HUD is compact and its 5 elements are legible with no clipping.
5. Every scene has **at most one primary on-screen information panel** besides bottom HUD.
6. Workstation's 3 evidence rows and focus selector are reachable at 1024×576 without clipping behind HUD.
7. Storage art is the primary focal object; no persistent observation/Quick Pin side panels.
8. Case Brief / Evidence / Hint / Quick Pin / C-17 are all centered, closable where appropriate, never stacked.
9. Unhandled C-17 tab remains visible after room changes, without covering normal navigation.
10. All hotspot labels available on mouse, keyboard and touch.
11. No primary scene transition fires merely from closing a modal.
12. **P0-A gameplay regressions still pass**: ungated Storage, observed-field tracking, selected focus persistence, both Pin/no-Pin old-loop routes until P0-B replaces them.
13. Screenshots visually reviewed at **1024×576, 1280×720, 1464×815 and 1920×1080**.
14. A first-time player can name one actionable visual hotspot in Maintenance **without reading a paragraph**.

## 12. Design freeze / next step

This document is the **visual reference for Option A (component implementation checklist)**. Do **not** immediately start P0-B, modify story, add new dialogs beyond the one-time system brief, add rooms, or replace art during the Graphic Cleanup.

Next planned sequence: review the wireframes → convert to precise Component/CSS checklist → implement G1–G6 → screenshot/interaction verification → resume P0-B. If a mock and a technical constraint conflict, record the exception here before editing gameplay.
