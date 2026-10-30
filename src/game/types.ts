export type ThreadId = 'coupler' | 'power'

export type WorkOrderFieldId = 'service' | 'completion' | 'parts'
export type InvestigationIntention = 'check-completion' | 'trace-part' | 'check-verification'
export type VerificationNextStep = 'review-completion' | 'trace-issued-unit' | 'check-installation'
export type ReflectionKey = 'difficulty' | 'support' | 'change'
export type ReflectionAnswers = {
  difficulty: 'easy' | 'some-effort' | 'difficult' | 'unsure' | null
  support: 'pin' | 're-read' | 'memory' | 'other' | 'unsure' | null
  change: 'yes' | 'no' | 'unsure' | null
}

export type Scene =
  | 'maintenance'
  | 'secondary'
  | 'hub'
  | 'storage'
  | 'power'
  | 'deduction'
  | 'reflection'

export type InvestigationScene = Exclude<Scene, 'secondary' | 'reflection'>

export type ReturnPoint = {
  scene: InvestigationScene
  thread: ThreadId | null
  workstationFocused: boolean
  maintenanceInspection: 'workbench' | 'junction' | null
  scrollOffset: number
}

export type QuickPin = {
  threadId: ThreadId
  thread: string
  location: string
  context: string // action explicitly selected by the player; no generated clue text
  cueId: string
  returnPoint: ReturnPoint
  scrollOffset: number
}

export type InterruptionStatus = 'idle' | 'warning' | 'handled'
export type GameState = {
  scene: Scene
  currentThread: ThreadId | null
  evidenceFound: string[]
  workOrderOpened: boolean
  storageCrateOpen: boolean
  comparedEvidenceIds: string[]
  observedWorkOrderFields: WorkOrderFieldId[]
  activeIntention: InvestigationIntention | null
  knowledgeFlags: string[]
  quickPin: QuickPin | null
  quickPinReviewed: boolean
  interruptionArmed: boolean
  interruptionReady: boolean
  verificationNextStep: VerificationNextStep | null
  interruptionOccurredDuringInvestigation: boolean
  interruptionStatus: InterruptionStatus
  secondaryTaskComplete: boolean
  secondaryResponse: string | null
  theory: 'replaced' | 'not-replaced' | null
  theoryEvidence: string[]
  firstThreadAfterInterruption: ThreadId | null
  resumedFromPin: boolean
  reflectionAnswers: ReflectionAnswers
  reflectionSubmitted: boolean
}
