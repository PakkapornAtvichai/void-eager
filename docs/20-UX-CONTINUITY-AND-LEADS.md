# UX Continuity, Leads, and Scene Changes

## Purpose

This document locks the interaction rules for the current Void-eager prototype after the first Yoko-art integration pass.

The goal is to keep the mystery cognitively rich while making navigation predictable and context recovery understandable.

## Core rule

A scene changes for only two reasons:

1. **Player-directed navigation** — the player explicitly chooses to move to another location, thread, or lead.
2. **External interruption** — a scripted incident explicitly takes control because interruption/resumption is the serious-game mechanic.

Discovering evidence, creating a lead, logging a clue, or activating a button must not silently teleport the player to another scene.

## Research boundary

The interruption research supports:
- meaningful primary work before interruption;
- a short opportunity to prepare before switching;
- an external interruption that actually occupies attention;
- useful retrieval/context cues for later resumption.

It does **not** require every investigation action to force a scene switch, nor does it require gradual walking/travel animations.

For voluntary navigation, the important requirement is that the player's intention is clear before the scene changes.

## Investigation hierarchy

The HUD distinguishes four concepts:

### Current Thread
The question currently being investigated.

Example:
- Coupler Replacement — Was the coupler actually replaced?

### Leads
Player-actionable next steps created by evidence or investigation.

Example:
- Trace replacement serial GSC-8842-A → Storage B-04

Discovering a lead does not navigate. The lead becomes available in the HUD and the player decides whether to follow it.

### Quick Pin
Optional externalized resumption context.

Quick Pin remains in one stable HUD location. Saved details stay collapsed by default and are revealed only when the player intentionally opens the Quick Pin entry.

### Evidence
A low-priority archive/count. Evidence does not compete visually with Current Thread or active Leads.

## Attention cues

Newly activated controls or leads may use a brief visual pulse/glow to announce the state change.

Rules:
- animate the change, not the permanent state;
- no continuous blinking;
- avoid rapid flashing;
- after the short cue, the control settles into the normal UI.

Semantic color roles:
- cyan = investigation/system interaction;
- amber = incoming interruption or attention-required system event;
- green = confirmed/logged evidence;
- neutral white/steel = navigation/back/location controls;
- red = real errors only.

## Navigation

Navigation controls must be visually distinct from investigative actions.

Examples:
- `ROOM` / `BACK` = neutral navigation style.
- `TRACE SERIAL` = investigation action that creates/unlocks a Lead.
- HUD Lead entry = explicit navigation choice to Storage.

A voluntary location change may use a short fade/system-location transition, but no long traversal sequence is required for this prototype.

## Loop 1 continuity

Expected Coupler flow:

```text
Maintenance Room
  -> choose Workstation
Workstation
  -> inspect/read maintenance record
  -> discover Storage serial lead
  -> lead appears in HUD; remain at workstation

External interruption may arrive while working
  -> preparation / optional Quick Pin
  -> secondary task occupies attention
  -> return to investigation/thread space

Player later chooses:
  -> Power Spike thread, or
  -> saved Quick Pin, or
  -> Storage lead

Choosing Storage lead
  -> short location transition
  -> Storage inspection
```

The distinction between **lead discovery**, **player navigation**, and **external interruption** must remain visible in the interaction design.

## First-time-player navigation correction

The Incident Hub is now a persistent investigation home after the interruption, not a one-time post-interruption menu.

Required navigation contract:

```text
Maintenance Workstation
  -> interruption arrives; player chooses when to handle it
  -> coolant task takes over the physical workstation display
  -> Incident Hub

Incident Hub
  -> Coupler case thread -> Maintenance / Workstation
  -> optional Power context thread -> Engineering Power Log
  -> Case Review becomes available after Storage serial verification

Maintenance Room
  -> explicit Incident Hub exit remains available after the interruption

Storage
  -> physical crate -> Coupler -> serial inspection
  -> return to Incident Hub
  -> does NOT automatically advance to Case Review

Case Review
  -> save working theory
  -> return to Incident Hub
  -> does NOT automatically advance to Reflection

Incident Hub after theory saved
  -> continue investigating, or
  -> deliberately End Investigation Session
  -> Reflection
```

First-time-player meaning:
- the Hub answers `where do I go next?` and remains revisitable;
- `NAV // ROOM` only changes focus inside Maintenance and cannot strand the player because the room exposes an Incident Hub exit;
- the Power thread is labeled as optional context for reconstructing the incident timeline;
- Storage provides evidence but does not push the player toward an ending;
- Reflection is entered only after an explicit end-session action.

The forced interruption countdown has been removed. The interruption still arrives unexpectedly, but the player chooses when to handle it and whether to Quick Pin first.

Known visual dependency:
- Storage still uses a CSS placeholder environment. Its object-interaction sequence is production-ready, but the room background should be replaced by final art if time permits.
