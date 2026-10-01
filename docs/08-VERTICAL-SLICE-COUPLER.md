# Vertical Slice Spec — Coupler

## Player objective
Determine whether the stabilizer coupler was actually replaced.

## Scene A — Maintenance
Player opens the work order:
COUPLER REPLACED
TECHNICIAN: GLINT
The interface creates or highlights the thread: "Was the coupler actually replaced?"

## Interruption
Before the player completes verification, Incident System requests a short unrelated action.
Player can:
- QUICK PIN & OPEN
- OPEN
Optional third choice only if trivial to implement: QUEUE.

Quick Pin stores the active thread and current evidence context.

## Scene B — Secondary task
A 20–40 second bounded task. It should be understandable immediately and should not create another mystery branch.
Example: acknowledge and classify a non-critical system alert.

## Return
Player returns to the investigation. If Quick Pin was used, display the saved context prominently but briefly.

## Scene C — Storage
Player discovers the new coupler is still present and checks its serial against the work order.

## Deduction
Prompt: "Was the coupler actually replaced?"
The player supports the answer using the maintenance record and physical/serial evidence.

## Reflection
Ask:
- What helped you remember what you were checking?
- Did the interruption change what you were thinking about?
- Did you use the Pin? If so, was it useful?

Do not score the player as good/bad at task switching.
