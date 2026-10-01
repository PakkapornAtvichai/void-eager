export const POWER_SPIKE = {
  threadId: 'power' as const,
  thread: 'What caused the 21:11 power anomaly?',
  evidenceId: 'ENG_POWER_SPIKE_LOG',
  protectionEvidenceId: 'ENG_PROTECTION_ACTIVE_LOG',
  log: {
    spike: '21:11 — POWER SPIKE DETECTED',
    protection: '21:12 — PROTECTION LAYER ACTIVE',
    status: 'ANOMALY CONTAINED',
  },
} as const
