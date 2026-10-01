# Frontend Test Brief — Asynchronous Loop v2

## Test boundary

Test behavior and comprehension before further feature work. Do not fix during the first pass.

## Run A — Pin + delayed switch

1. Start fresh on Maintenance.
2. Open the maintenance report.
3. Scroll partway through the report and continue reading.
4. Do not click anything to trigger an interruption.
5. Verify an incoming incident appears automatically after roughly 12 seconds.
6. Verify the report remains visible during the warning.
7. During the 8-second preparation window, choose **Pin current context**.
8. Verify the Pin minimizes into a persistent card.
9. Let the countdown expire without clicking Handle now.
10. Verify the secondary task takes over automatically.
11. Choose any operational response and log it.
12. Verify the game does not label the response correct/incorrect.
13. Return to the Incident Board.
14. Verify Coupler and Power Spike are both available.
15. Open Power Spike first.
16. Inspect the 21:11 spike and 21:12 protection entry.
17. Return to the Incident Board.
18. Use the persistent Quick Pin card to resume Coupler.
19. Verify the Maintenance report restores the saved reading position rather than reopening at the top.
20. Continue to Storage and trace the replacement serial.
## Run B — No Pin + immediate switch

1. Restart.
2. Open and scroll the Maintenance report.
3. Wait for the incoming incident.
4. Do not Pin.
5. Choose **Handle now**.
6. Complete the secondary task and return to the Incident Board.
7. Confirm there is no persistent Quick Pin card.
8. Open Coupler normally and verify the report does not restore the prior saved reading position.
9. Continue through Storage.

## Theory behavior

At the theory screen:
- save **The recorded replacement happened** with at least one evidence item;
- verify the game accepts and records the theory without saying it is wrong;
- continue to Reflection and confirm the filed theory is reported neutrally;
- restart and repeat with the alternate theory if time permits.

## Key UX questions

- Did the interruption genuinely arrive while attention was on the report?
- Was the 8-second preparation window understandable?
- Did Pin feel useful before the switch?
- Was the persistent minimized Pin easy to recognize later?
- Was choosing a thread after interruption meaningful?
- Did restoring the reading position materially help resumption?
- Did the theory screen feel like forming a belief rather than answering a quiz?
