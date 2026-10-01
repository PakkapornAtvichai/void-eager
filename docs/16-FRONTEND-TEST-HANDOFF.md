# Frontend Test Handoff

## Status
The vertical slice is implementation-complete through T09 and is ready for browser/frontend testing.

## Happy path
1. Inspect Maintenance work order.
2. Choose Quick Pin & Open.
3. Classify the coolant alert as sensor mismatch / continue monitoring.
4. Return to the investigation.
5. Confirm the pinned resume cue appears.
6. Go to Storage.
7. Inspect the replacement coupler.
8. Compare the serial.
9. Open deduction.
10. Choose "No — the replacement did not actually happen."
11. Select all three supporting evidence items.
12. Submit deduction.
13. Continue to reflection.
14. Confirm reflection reports Quick Pin used: Yes and evidence logged: 3.
## Alternate path
Restart the prototype and repeat using Open without pin.
After the secondary task, confirm the unpinned resume cue appears and the detailed Quick Pin context does not.

## Negative-path checks
- Submit the wrong coolant classification and confirm recoverable feedback appears.
- Attempt deduction without selecting the full evidence chain and confirm support feedback appears.
- Submit the "replaced" conclusion with all evidence and confirm it is rejected without game-over.
- Change to the supported conclusion and continue normally.
- Restart from reflection and confirm state returns to the initial Maintenance screen.

## Test boundary
Do not change code during the first pass. Record usability, layout, wording, accessibility, responsiveness, console errors, and state bugs separately.
