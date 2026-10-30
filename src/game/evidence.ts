import type { GameState } from './types'

/**
 * Each selectable Case Review citation is a source fact that was actually
 * inspected. A Work Order ACCESS click alone is not an evidence observation.
 */
export const evidenceCatalog = [
  { id: 'MAI_WO_SERVICE', label: 'WO-4471 service field: routine maintenance logged twelve days before the cascade.' },
  { id: 'MAI_COUPLER_REPLACEMENT_RECORD', label: 'WO-4471 completion field: COUPLER REPLACED was recorded.' },
  { id: 'MAI_INSTALL_VERIFY_FIELD', label: 'WO-4471 parts field: serial GSC-8842-A issued; installation verification not attached.' },
  { id: 'STO_NEW_COUPLER', label: 'Storage B-04: the replacement Coupler was observed unused.' },
  { id: 'STO_NEW_COUPLER_SERIAL', label: 'Storage B-04: unit-specific serial plate GSC-8842-A.' },
  { id: 'ENG_POWER_SPIKE_LOG', label: 'Engineering 21:11 log: power spike detected.' },
  { id: 'ENG_PROTECTION_ACTIVE_LOG', label: 'Engineering 21:12 log: protection layer active.' },
] as const

export const observedEvidence = (state: GameState) =>
  evidenceCatalog.filter(({ id }) => state.evidenceFound.includes(id))

export const hasCouplerObservation = (state: GameState) =>
  state.evidenceFound.some((id) => id.startsWith('MAI_') || id.startsWith('STO_'))

export const observedWorkOrderSerial = (state: GameState) =>
  state.observedWorkOrderFields.includes('parts') ||
  state.observedWorkOrderFields.includes('completion')

export const canCompareSourceSerials = (state: GameState) =>
  observedWorkOrderSerial(state) && state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')
