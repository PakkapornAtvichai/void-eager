import type { GameState } from './types'

export type Objective = {
  id: string
  category: 'CASE' | 'OPTIONAL' | 'ALERT' | 'REVIEW'
  title: string
  hint: string
}

export type ObjectiveView = {
  workstationFocused: boolean
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
      title: 'Reflect on how you returned to the case',
      hint: 'Consider what helped you remember the Coupler question after the alert. You can restart to try another approach.',
    }
  }

  if (state.scene === 'secondary') {
    return state.secondaryTaskComplete
      ? {
          id: 'alert-logged',
          category: 'ALERT',
          title: 'Return to the Incident Hub',
          hint: 'Your response is logged. Choose Travel to Incident Hub, then decide which investigation thread to resume.',
        }
      : {
          id: 'classify-alert',
          category: 'ALERT',
          title: 'Choose a response to Coolant Alert C-17',
          hint: 'Compare Sensor A and B with the pressure, flow, and diagnostic. Select one response, then choose Log response.',
        }
  }

  if (state.scene === 'deduction') {
    return state.theory
      ? {
          id: 'theory-saved',
          category: 'REVIEW',
          title: 'Return to the Hub to finish or investigate more',
          hint: 'Your working theory has been saved. Use Return to Incident Hub. End Session is available there; further exploration is optional.',
        }
      : {
          id: 'file-theory',
          category: 'REVIEW',
          title: 'Choose an interpretation and cite evidence',
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
      return {
        id: 'hub-finish',
        category: 'REVIEW',
        title: 'End the session, or explore more',
        hint: 'Your working theory is saved. Choose End Session in Case Review to reflect, or revisit either thread.',
      }
    }
    if (view.serialChecked) {
      return {
        id: 'hub-theory',
        category: 'CASE',
        title: 'Open Case Review to record your theory',
        hint: 'You have the work order and the observed serial from Storage. Use Open Case Review below the two thread choices.',
      }
    }
    if (view.storageLeadUnlocked) {
      return {
        id: 'hub-storage',
        category: 'CASE',
        title: 'Follow the replacement serial to Storage B-04',
        hint: 'Select the REPLACEMENT SERIAL lead in the bottom LEADS section. Power is optional and can be checked at any time.',
      }
    }
    return {
      id: 'hub-resume',
      category: 'CASE',
      title: 'Resume the Coupler investigation at Workstation',
      hint: state.quickPin
        ? 'You can use your saved Quick Pin to resume the report, or select Return to Workstation. Look for TRACE SERIAL -> STORAGE beneath the report.'
        : 'Select Return to Workstation. Scroll to the report\'s Parts Reference, then use TRACE SERIAL -> STORAGE beneath the report.',
    }
  }

  // The storage room has its own physical interaction phases; see storageObjective.
  if (state.scene === 'storage') return storageObjective(view.serialChecked ? 'serial' : 'closed')

  if (state.interruptionStatus === 'warning') {
    return {
      id: 'alert-warning',
      category: 'ALERT',
      title: 'Respond to the incoming coolant alert',
      hint: 'The Coupler report will remain available. You may pin your reading context before choosing Handle incident, but pinning is optional.',
    }
  }

  if (view.maintenanceInspection) {
    return {
      id: `optional-${view.maintenanceInspection}`,
      category: 'OPTIONAL',
      title: 'Inspect details, or continue at Workstation',
      hint: 'Workbench and Junction offer optional observations. They do not replace the formal work order. Use OPEN WORKSTATION / RECORD when ready.',
    }
  }

  if (!view.workstationFocused) {
    if (!view.recordOpened) {
      return {
        id: 'find-workstation',
        category: 'CASE',
        title: 'Find Glint\'s maintenance work order',
        hint: 'Click Open Workstation on the central desk. Workbench and Junction are optional places to explore first.',
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
        title: 'Follow the replacement serial to Storage B-04',
        hint: 'Select the green REPLACEMENT SERIAL item under LEADS in the bottom HUD; your room exploration can wait.',
      }
    }
    return {
      id: 'back-to-workstation',
      category: 'CASE',
      title: 'Continue examining the Coupler report',
      hint: 'Open Workstation again. The Parts Reference section records a serial that can be traced after the alert.',
    }
  }

  if (!view.recordOpened) {
    return {
      id: 'open-work-order',
      category: 'CASE',
      title: 'Open the maintenance record on the center display',
      hint: 'Select ACCESS RECORD. Your question is whether the replacement was actually installed, not just marked complete.',
    }
  }

  if (!state.secondaryTaskComplete) {
    return {
      id: 'inspect-replacement',
      category: 'CASE',
      title: 'Check the recorded replacement against its proof',
      hint: 'Scroll through sections 02 and 03. What confirms that the listed serial was installed, rather than just entered in the work order?',
    }
  }

  if (view.serialChecked) {
    return {
      id: 'review-evidence',
      category: 'CASE',
      title: 'Take your findings back to the Incident Hub',
      hint: 'Use NAV / ROOM to exit the workstation, then the Incident Hub exit in Maintenance.',
    }
  }

  if (!view.storageLeadUnlocked) {
    return {
      id: 'trace-serial',
      category: 'CASE',
      title: 'Use TRACE SERIAL beneath the Work Order',
      hint: 'Find section 03 / PARTS REFERENCE. Select TRACE SERIAL -> STORAGE just below the report to add a navigable lead.',
    }
  }

  return {
    id: 'follow-storage',
    category: 'CASE',
    title: 'Follow the Storage B-04 lead in the HUD',
    hint: 'Select the green REPLACEMENT SERIAL lead in the bottom HUD to travel to Storage. The Power timeline remains optional.',
  }
}

export function storageObjective(phase: StoragePhase): Objective {
  if (phase === 'closed') {
    return {
      id: 'storage-open',
      category: 'CASE',
      title: 'Open the replacement-parts crate',
      hint: 'Select OPEN REPLACEMENT CRATE on the large crate image to inspect what was left in Storage B-04.',
    }
  }
  if (phase === 'open') {
    return {
      id: 'storage-inspect',
      category: 'CASE',
      title: 'Inspect the coupler inside the crate',
      hint: 'Select INSPECT COUPLER on the opened crate. Note its condition before looking for identifying markings.',
    }
  }
  if (phase === 'coupler') {
    return {
      id: 'storage-plate',
      category: 'CASE',
      title: 'Locate the coupler\'s serial plate',
      hint: 'Select LOCATE SERIAL PLATE on the component. You will be able to compare its serial with the work order.',
    }
  }
  return {
    id: 'storage-compare',
    category: 'CASE',
    title: 'Compare the two serials, then return to the Hub',
    hint: 'Read COUPLER PLATE and WORK ORDER on the right. Are they the same part identifier? Use NAV / INCIDENT HUB when ready to form a theory.',
  }
}
