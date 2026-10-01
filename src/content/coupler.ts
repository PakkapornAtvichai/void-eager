export const COUPLER = {
  thread: 'Was the coupler actually replaced?',
  evidenceId: 'MAI_COUPLER_REPLACEMENT_RECORD',
  evidenceLabel: 'Coupler Replacement Record',
  knowledgeFlag: 'K_REPLACEMENT_RECORD_FOUND',
  workOrder: {
    id: 'WO-4471',
    component: 'Guidance Stabilizer Coupler',
    status: 'COUPLER REPLACED',
    technician: 'GLINT',
  },
} as const

export const INCIDENT_INTERRUPTION = {
  id: 'INTERRUPT_INCIDENT_SYSTEM',
  title: 'Incident System Request',
  body: 'A non-critical system alert requires classification before the investigation continues.',
} as const
