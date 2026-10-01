export const COUPLER = {
  threadId: 'coupler' as const,
  thread: 'Was the coupler actually replaced?',
  evidenceId: 'MAI_COUPLER_REPLACEMENT_RECORD',
  evidenceLabel: 'Coupler Replacement Record',
  knowledgeFlag: 'K_REPLACEMENT_RECORD_FOUND',
  workOrder: {
    id: 'WO-4471',
    component: 'Guidance Stabilizer Coupler',
    status: 'COUPLER REPLACED',
    technician: 'GLINT',
    replacementSerial: 'GSC-8842-A',
  },
} as const

export const STORAGE_COUPLER = {
  evidenceId: 'STO_NEW_COUPLER',
  serialEvidenceId: 'STO_NEW_COUPLER_SERIAL',
  component: 'Guidance Stabilizer Coupler',
  serial: 'GSC-8842-A',
  workOrderSerial: 'GSC-8842-A',
  knowledgeFlag: 'K_NEW_COUPLER_STILL_IN_STORAGE',
  serialFlag: 'K_SERIAL_MATCHES_WORK_ORDER',
} as const

export const INCIDENT_INTERRUPTION = {
  id: 'INTERRUPT_INCIDENT_SYSTEM',
  title: 'Incident System Request',
  body: 'A non-critical system alert requires classification before the investigation continues.',
} as const
