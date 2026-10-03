# Yoko Art Handoff — Async Loop v2

## Keep the same visual language

Detailed pixel art, sci-fi industrial UI, same crew/ship language, no font lock-in.

Color roles remain:
- cyan = active/current investigation
- white = normal room / operational lighting
- amber/orange = local department or system caution state
- green = confirmed evidence / healthy state
- red = severe error / ship-wide emergency state

### Alert and lighting hierarchy — LOCKED

| Event type | Visual response | Meaning |
|---|---|---|
| Personal / targeted interruption | UI popup/notification only; no room-light color change | Someone or something needs the player's attention |
| Department / system problem | Local amber/orange lights or indicators in that department/system | Something is wrong here |
| Ship-wide emergency | Ship-wide red emergency lighting / emergency indicators | Everyone aboard Void-eager is being alerted |

The incoming-incident popup and Quick Pin choices are UI-level interruption cues. They do **not** turn the room amber unless the interruption is caused by an actual local department/system fault.

## Loop 01 v2 production packet

Highest priority:
- Maintenance report/terminal reading view
- incoming incident warning treatment
- minimized/persistent Quick Pin card
- Incident Board with two thread cards
- Power Spike log panel
- Storage replacement-part inspection
- current-theory panel
- reflection summary panel
## Important interaction intent

The incoming incident must look like something arriving *over* the player's current work, not like a new page they chose to open.

The Quick Pin should visually collapse/minimize after use. It needs to feel persistent and recoverable, not like a success badge.

The Incident Board should make two unfinished threads visible without suggesting which one is correct or mandatory.

Do not visually mark theories as right/wrong.

## Still out of scope

- complete six-room ship art
- full evidence board
- additional NPC animation sets
- full map navigation
- multiple interruption types
- final confrontation art

Build this packet as reusable components; later mystery pieces should snap into the same UI system.


## Maintenance environment layering — LOCKED

For the current Yoko packet, use the **composite room background + aligned interaction overlays** model:

```text
Background_Maintenance.png
(all three room objects already visible)
+
Click_Workstation.png
Click_Workbench.png
Click_Junction.png
(aligned transparent interaction/hover layers)
↓ click a zone
ONE FOCUS SCENE PER ZONE
+
panel / clue / HTML UI overlays inside that Focus Scene
```

The duplicate visible objects in the click PNGs are intentional. They make it easy to position interaction layers exactly over the already-rendered room composition; the runtime does not need to rebuild the room out of furniture sprites.

Current Maintenance zones:
- Workstation
- Workbench
- Junction / Protection Panel

Each zone still has exactly one Focus Scene image:
- Workstation Focus: close-up front/front-ish, showing all workstation surfaces
- Workbench Focus: elevated/top-down-biased view, showing the complete bench area
- Junction Focus: front-facing close-up of the complete service/protection panel

For Loop 1, only the Workstation needs full gameplay. The Workbench and Junction may remain visible/inactive until their interactions are needed.

Readable records and dynamic interface text remain HTML/UI layers. Do not bake them into Yoko's base images.

The older `assets/incoming-yoko/maintenance-background-brief.md` describes the earlier empty-shell production idea; where it conflicts with this section, this composite-background implementation rule takes precedence.
