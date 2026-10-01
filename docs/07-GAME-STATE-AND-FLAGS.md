# Game State and Flags — Loop 01

## Evidence IDs
- MAI_COUPLER_REPLACEMENT_RECORD
- STO_NEW_COUPLER
- STO_NEW_COUPLER_SERIAL

## Knowledge flags
- K_REPLACEMENT_RECORD_FOUND
- K_NEW_COUPLER_STILL_IN_STORAGE
- K_SERIAL_MATCHES_WORK_ORDER
- K_COUPLER_NOT_REPLACED

## Loop state
- THREAD_VERIFY_COUPLER
- INTERRUPT_INCIDENT_SYSTEM
- QUICK_PIN_SET
- SECONDARY_TASK_COMPLETE
- RETURNED_TO_COUPLER_THREAD
- DEDUCTION_COMPLETE

## Knowledge rule
Evidence is not automatically the same as interpretation.

Example:
Replacement record found != player knows the record is false.

The conclusion K_COUPLER_NOT_REPLACED should require the replacement record plus physical/serial evidence that the supposed replacement part is still in Storage.

## Softlock rule
No critical evidence is permanently missable. The player can revisit the required screens until the deduction can be completed.
