# VOID-EAGER — Loop 1 UI Readability / Screen-by-Screen Fix Checklist

Updated: 2026-10-28. Scope: **Coupler Loop 1 only**. No new locations, evidence, story branches, gameplay mechanics, or character work.

## Cause of the reported problem

The Yoko pixel-art frames were designed for a 1920x1080 stage, but some interactive text was still measured in fractional viewport units and became 8-10 px in a normal browser window. Fixed-height physical monitor panels compounded the issue, and the Quick Pin panel opened over Storage's serial-comparison text and navigation.

## Screen checklist

| Screen | Fix applied | Expected test |
| --- | --- | --- |
| Maintenance | Existing Workbench, Workstation, and Junction hotspot labels remain visible; briefing remains optional | All three click and can return |
| Workbench / Junction | Readable observation panel and reversible close-up interaction preserved | Buttons/observations remain interactive |
| Workstation | Report font minimum 12 px (about 13.6 px at 1464), scrollable body, larger room navigation and trace action | Three record sections reachable, no hidden buttons |
| Alert C-17 / Coolant | Broader/taller readable in-world telemetry interface, legible response options and Log Response button | Classification action visible at 1280+ without scrolling |
| Incident Hub | Larger monitor text, shorter action labels, no hidden Case Review/End Session controls | Main/optional thread choices and Case Review visible |
| Power Log | Larger controls, compact responsive signal display, dark reading matte inside original Yoko frame | No cyan frame rail crosses headings or data |
| Storage | More panel space, clearly separated Coupler serial and Work Order serial, readable back button | Serial comparison visible, no panel clipping at 1280+ |
| Quick Pin | Larger context text and Resume Report button; popup appears away from Storage and observed serial label | Pin does not cover evidence or click targets |
| Case Review | Smaller unnecessary margins, readable choice fields, matte within decorative frame | Theory and evidence fields + Save Theory visible |
| Reflection | Tighter text-group spacing; readable summary and restart navigation | Full panel fits from 1280x720 upward |
| Bottom HUD | Thread/Lead/Pin/Evidence values enlarged, wrapping instead of ellipses where needed | All state labels visible |

## Verification

- Source build: `npm run build` passes. Current local Node 22.11.0 is slightly older than Vite's recommended 22.12+, so the existing nonfatal engine warning remains.
- Full automated browser playthrough still reaches Reflection and preserves the existing Coupler investigation, interruption, Power context, Storage cross-check and theory.
- Playwright layout matrix at 1280x720, 1464x815 and 1920x1080: primary in-world monitors/panels and Quick Pin no longer have unexpected internal vertical clipping; no page errors.
- Quick Pin vs Storage and Quick Pin vs observed-serial-label intersection area: 0 at tested resolutions.
- Smaller 1024x576: long Power, Storage, Deduction and Reflection content intentionally retain inner scrolling; the prototype is desktop/landscape-first.
- Work Order deliberately scrolls because the report is now large enough to read; this supports Quick Pin restoring document context.
- Automated tests are not substitutes for a human readability/playability pass on the user's monitor.

## Future UX rule

Never shrink investigation body text merely to keep a decorative image frame untouched. Prefer readable typography, adequate panel size, short button labels, and an obvious internal scroll affordance. Preserve player-directed scene changes and the one-loop serious-game objective.
