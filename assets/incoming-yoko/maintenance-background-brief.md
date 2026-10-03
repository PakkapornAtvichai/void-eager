# Maintenance Environment Art Brief — Void-eager

## Core structure — LOCKED
Maintenance is built as a layered scene system:

1. **Maintenance Room Shell**
2. **Room-level World Assets** placed on top of the shell
3. Click a World Asset to enter that zone's **single Focus Scene**
4. **Clickable sub-assets** are placed on top of that Focus Scene
5. Character art and UI remain separate layers

Important: **one zone = one Focus Scene image**. Do not create a separate Focus Scene for every object inside a zone.

## Global visual language
- 16:9 landscape
- detailed pixel art
- sci-fi industrial / deep-space research vessel
- same Void-eager visual family as other assets
- no font lock-in and no readable text baked into base art
- cyan = active/current investigation
- white = normal room / operational lighting
- amber/orange = local department or system caution state; use on relevant local lights/indicators only
- green = confirmed/healthy state
- red = severe error / ship-wide emergency state

### Alert and lighting hierarchy — LOCKED

| Event type | Visual response | Meaning |
|---|---|---|
| Personal / targeted interruption | UI popup/notification only; room lighting does **not** change | Someone or something needs the player's attention |
| Department / system problem | Local amber/orange lights or indicators in the affected department/system | Something is wrong here |
| Ship-wide emergency | Ship-wide red emergency lighting / emergency indicators | Everyone aboard Void-eager is being alerted |

A Quick Pin / Handle popup by itself must **not** trigger amber room lighting. Amber environmental lighting is diegetic feedback for a physical/local system problem, not a generic interruption cue.
## Layer 1 — Maintenance Room Shell

The Room Shell is the reusable environmental base.

It should contain:
- hull walls and structural ribs
- floor plates
- ceiling structure
- permanent pipes, ducts and cable trunks
- vents and fixed utility lighting
- non-interactive industrial details

It should **not** contain:
- workstation
- workbench
- junction/protection module
- clues or evidence
- readable records/logs
- loose clickable props
- Glint or any other character

The shell should feel like Maintenance even while mostly empty.

## Room perspective
The room may show left wall, center wall and right wall with mild perspective.
Avoid dramatic 3/4 perspective, but do not force a flat orthographic room.
World Assets must match the exact wall/floor plane and perspective of the shell.
## Room zoning

### Left zone — Workbench
Reserved for a separate clickable **Workbench World Asset**.
The shell behind it should stay visually quiet enough for the prop to read clearly.

### Center / lower zone — Main Workstation
Reserved for the separate clickable **Workstation World Asset**.
This is the primary interaction anchor and needs the clearest silhouette.

### Right wall zone — Junction / Protection Panel
Reserved for the separate clickable **Junction World Asset**.
Keep enough clean wall surface for a wall-mounted asset to sit naturally.

### Upper strip
Can carry denser permanent infrastructure:
- pipes
- conduits
- vents
- cable bridges
- fixed service lights

Do not fill every wall surface with small panels that look clickable.
## Layer 2 — World Assets

World Assets are the large clickable objects visible from the room view.

Required:
- Workstation World Asset
- Workbench World Asset
- Junction / Protection Panel World Asset

### Perspective rule
Each World Asset must be generated/drawn to match the Room Shell perspective.

Examples:
- asset on left wall follows the left-wall angle
- asset facing center follows the room's central plane
- wall-mounted right-side asset follows the right-wall angle
- floor-standing assets follow the same horizon / floor convergence as the shell

Do **not** default these to flat front-facing sprites and rely on heavy perspective warping later.
Small manual corrections are acceptable; major transform distortion is not the intended workflow.

World Assets only need enough detail to identify the zone and invite interaction.
Individual clues should not be readable from the room view.
## Layer 3 — Focus Scenes

Clicking a World Asset switches to that zone's **one Focus Scene**.

The Focus Scene is a close-up composition containing all objects/surfaces that belong to that zone.
Choose the camera angle based on the entire zone, not on each clue.

Suggested views:

### Workstation Focus Scene
- close-up front / front-ish view
- show main screen, secondary screen, console and desk surface in one composition
- leave clean slots for screen/content overlays

### Workbench Focus Scene
- elevated or top-down-biased close-up
- show the full usable bench surface in one image
- leave clear areas for notes, tools, trays and small props

### Junction Focus Scene
- front-facing close-up of the whole service/protection panel
- expose enough panel structure for override/service sub-assets
## Layer 4 — Sub-assets

Sub-assets are placed **on top of the Focus Scene**, not directly into the Room Shell.

### Workstation sub-assets
- Coupler Replacement Record
- Diagnostic Cache
- service-level data / screen states
- idle or unavailable screen states as needed

### Workbench sub-assets
- messy work notes
- clipboard / datapad
- tools and trays
- handheld maintenance props

### Junction sub-assets
- Manual Override trace/state
- service-access module state
- opened/closed panel variation
- status indicators if needed

Sub-assets must match the perspective of their Focus Scene.
The Focus Scene base should deliberately leave quiet/empty placement zones for them.
## Character layer

Glint remains separate from all environment art.
Do not bake him into the Room Shell, World Assets or Focus Scenes.

This allows:
- NPC availability changes
- pose/state changes
- dialogue presentation changes
- reuse of the environment without regenerating it

## Storytelling

The room belongs to Glint and should feel:
- actively used
- slightly messy/casual
- technically competent underneath the mess
- heavily serviced, not abandoned

Do not visually reveal that Glint is the culprit.
Maintenance details should support investigation, not pre-solve it.

Storage-only evidence such as the new and hidden old couplers must not appear here.

## Pixel-art treatment
- crisp hand-placed pixel clusters
- hard-edged materials
- controlled dithering
- strong readable silhouettes
- no painterly blur
- no photorealism
- no smooth vector-gradient look
