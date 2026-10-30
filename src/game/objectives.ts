import type { GameState, InvestigationIntention, WorkOrderFieldId } from './types'
import { hasCouplerObservation } from './evidence'

export type Objective = {
  id: string
  category: 'CASE' | 'OPTIONAL' | 'ALERT' | 'REVIEW'
  title: string
  hint: string
}

export type ObjectiveView = {
  workstationFocused: boolean
  observedFields: WorkOrderFieldId[]
  activeIntention: InvestigationIntention | null
  maintenanceInspection: 'workbench' | 'junction' | null
  recordOpened: boolean
  storageLeadUnlocked: boolean
  serialChecked: boolean
  spikeFound: boolean
  protectionFound: boolean
}

export type StoragePhase = 'closed' | 'open' | 'coupler' | 'serial'

export function currentObjective(state: GameState, view: ObjectiveView): Objective {
  if (state.scene === 'reflection') {
    return {
      id: 'reflect',
      category: 'REVIEW',
      title: 'Reflect on task switching',
      hint: 'Consider what helped you remember the Coupler question after the alert. You can restart to try another approach.',
    }
  }

  if (state.scene === 'secondary') {
    return state.secondaryTaskComplete
      ? {
          id: 'alert-logged',
          category: 'ALERT',
          title: 'Choose where to return',
          hint: 'Your response is logged. Choose Return to Previous Task or Incident Hub. Your case observations remain available.',
        }
      : {
          id: 'classify-alert',
          category: 'ALERT',
          title: 'Classify the coolant alert',
          hint: 'Compare Sensor A and B with the pressure, flow, and diagnostic. Select one response, then choose Log response.',
        }
  }

  if (state.scene === 'deduction') {
    return state.theory
      ? {
          id: 'theory-saved',
          category: 'REVIEW',
          title: 'Return to the Hub',
          hint: 'Your working theory is saved. You can revise it here, return to the Hub, or investigate more. End Session also requires C-17 to be handled.',
        }
      : {
          id: 'file-theory',
          category: 'REVIEW',
          title: 'Choose theory and evidence',
          hint: 'Select what you currently think happened, check at least one relevant observation, then choose Save current theory. This is not graded as right or wrong.',
        }
  }

  if (state.scene === 'power') {
    if (!view.spikeFound) {
      return {
        id: 'power-spike',
        category: 'OPTIONAL',
        title: 'Examine the 21:11 power spike',
        hint: 'Use Log the 21:11 spike. This is optional context for the main Coupler case.',
      }
    }
    if (!view.protectionFound) {
      return {
        id: 'power-protection',
        category: 'OPTIONAL',
        title: 'Check the protection response at 21:12',
        hint: 'Choose Check what happened at 21:12, then compare the two timeline entries.',
      }
    }
    return {
      id: 'power-complete',
      category: 'OPTIONAL',
      title: 'Return to the Hub when ready',
      hint: 'The Power timeline is reviewed. Use NAV / ACTIVE THREADS to return; the Coupler investigation remains the main case.',
    }
  }

  if (state.scene === 'hub') {
    if (state.theory) {
      if (state.secondaryTaskComplete) {
        return state.firstThreadAfterInterruption ? {
          id: 'hub-finish',
          category: 'REVIEW',
          title: 'Review your case or end the session',
          hint: 'You returned to an investigation after C-17. The case board can now end the session or let you revise your theory.',
        } : {
          id: 'hub-return-to-task',
          category: 'CASE',
          title: 'Resume an investigation task',
          hint: 'C-17 is logged. Use a corridor to return to any investigation thread before ending the session.',
        }
      }
      return state.interruptionStatus === 'warning' ? {
        id: 'hub-alert-outstanding',
        category: 'ALERT',
        title: 'Handle the pending C-17 alert',
        hint: 'The alert interrupted your investigation and is still pending. Reopen it from the case board or the pending tab.',
      } : {
        id: 'hub-continue-active-investigation',
        category: 'CASE',
        title: 'Continue investigating your theory',
        hint: 'Your theory is saved. C-17 has not occurred yet: use the left corridor, choose a Workstation focus or inspect a Storage Coupler, and continue that task.',
      }
    }
    if (hasCouplerObservation(state)) {
      return {
        id: 'hub-theory',
        category: 'CASE',
        title: 'Use the Case Board or a corridor',
        hint: 'The central Hub computer shows only your observed sources and lets you file or revise a theory. Left corridor: Maintenance and Storage. Right corridor: optional Engineering.',
      }
    }
    if (view.storageLeadUnlocked) {
      return {
        id: 'hub-storage',
        category: 'CASE',
        title: 'Follow the part to Storage B-04',
        hint: 'Walk through the left Maintenance corridor, then use the yellow Storage door on the right of that room. The HUD lead is a reminder, not a teleport.',
      }
    }
    return {
      id: 'hub-resume',
      category: 'CASE',
      title: 'Choose a corridor or inspect the case board',
      hint: state.quickPin
        ? 'You can review your Quick Pin in the Hub. Left corridor: Maintenance (and Storage); right corridor: optional Engineering.'
        : 'Use the physical left doorway for Maintenance, the right doorway for Engineering, or the central computer to check the case.',
    }
  }

  // The storage room has its own physical interaction phases; see storageObjective.
  if (state.scene === 'storage') return storageObjective(view.serialChecked ? 'serial' : 'closed')

  if (state.interruptionStatus === 'warning') {
    return {
      id: 'alert-warning',
      category: 'ALERT',
      title: 'Respond to Alert C-17',
      hint: 'Your investigation remains available. You can choose a personal reminder before switching, or handle the alert without a Pin.',
    }
  }

  if (view.maintenanceInspection) {
    return {
      id: `optional-${view.maintenanceInspection}`,
      category: 'OPTIONAL',
      title: 'Inspect details or return',
      hint: 'Use BACK // MAINTENANCE to return to the room, then click the central Workstation when ready.',
    }
  }

  if (!view.workstationFocused) {
    if (!view.recordOpened) {
      return {
        id: 'find-workstation',
        category: 'CASE',
      title: 'Open the Workstation',
      hint: 'Click the central desk to read Glint\'s records. The yellow door on the right goes to Storage B-04; the top-left exit returns to the Hub.',
      }
    }
    if (view.serialChecked || state.theory) {
      return {
        id: 'maintenance-back-hub',
        category: 'CASE',
        title: 'Bring your findings back to the Incident Hub',
        hint: 'Use the Incident Hub exit in Maintenance to review the evidence and decide what to do next.',
      }
    }
    if (view.storageLeadUnlocked) {
      return {
        id: 'maintenance-follow-storage',
        category: 'CASE',
        title: 'Find Storage through the yellow door',
        hint: 'Leave the Workstation, then use the yellow door on the right side of Maintenance to enter Storage B-04.',
      }
    }
    return {
      id: 'back-to-workstation',
      category: 'CASE',
      title: 'Continue examining the Coupler report',
      hint: 'You can reopen the Workstation, use the yellow Storage doorway in this room, or return through the Hub corridor.',
    }
  }

  if (!view.recordOpened) {
    return {
      id: 'open-work-order',
      category: 'CASE',
      title: 'Open the Work Order',
      hint: 'Select ACCESS RECORD to open WO-4471. You can choose which part to inspect.',
    }
  }

  if (!view.observedFields.length) {
    return {
      id: 'inspect-workorder-field',
      category: 'CASE',
      title: 'Inspect a Work Order section',
      hint: 'Select section 01, 02 or 03. You can inspect the fields in any order.',
    }
  }

  if (!view.activeIntention) {
    return {
      id: 'choose-working-focus',
      category: 'CASE',
      title: 'Choose what to check next',
      hint: 'Use the visible NEXT CHECK selector above the report. Then choose PREPARE CHECK to plan a specific follow-up from sources you have inspected.'
    }
  }

  if (view.serialChecked) {
    return {
      id: 'review-evidence',
      category: 'CASE',
      title: 'Review your evidence',
      hint: 'You can revisit sources or use the Incident Hub to continue the case.',
    }
  }

  return {
    id: 'continue-chosen-focus',
    category: 'CASE',
    title: 'Continue a specific source check',
    hint: state.interruptionStatus === 'idle' && !state.verificationNextStep
      ? 'Use PREPARE CHECK beside your focus to choose a follow-up source. C-17 arrives during that unfinished verification, not from a timer.'
      : 'Your follow-up source remains open. You can reread a field or use the yellow Maintenance doorway to visit Storage B-04.'
  }
}

export function storageObjective(phase: StoragePhase, canCompare = false): Objective {
  if (phase === 'closed') {
    return {
      id: 'storage-open',
      category: 'CASE',
      title: 'Open the parts crate',
      hint: 'Select OPEN CRATE on the large crate image to inspect what was left in Storage B-04.',
    }
  }
  if (phase === 'open') {
    return {
      id: 'storage-inspect',
      category: 'CASE',
      title: 'Inspect condition or serial',
      hint: 'The crate is open. You can examine the unused-condition evidence or read the serial plate in either order.',
    }
  }
  if (phase === 'coupler') {
    return {
      id: 'storage-plate',
      category: 'CASE',
      title: 'Read or review the unit serial',
      hint: 'You may read the serial plate, revisit the condition, or return to the Workstation for another source.',
    }
  }
  return canCompare ? {
    id: 'storage-compare',
    category: 'CASE',
    title: 'Compare the observed sources',
    hint: 'Select COMPARE SOURCES to place your inspected Work Order serial alongside the physical unit serial, or revisit the condition.',
  } : {
    id: 'storage-serial-observed',
    category: 'CASE',
    title: 'Review other available sources',
    hint: 'The physical serial is recorded. You can inspect the condition now, or visit the Workstation to read a recorded serial.',
  }
}
