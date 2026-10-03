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
