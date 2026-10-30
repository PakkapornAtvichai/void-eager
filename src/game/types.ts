export type ThreadId = 'coupler' | 'power'

export type WorkOrderFieldId = 'service' | 'completion' | 'parts'
export type InvestigationIntention = 'check-completion' | 'trace-part' | 'check-verification'

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
  interruptionOccurredDuringInvestigation: boolean
  interruptionStatus: InterruptionStatus
  secondaryTaskComplete: boolean
  secondaryResponse: string | null
  theory: 'replaced' | 'not-replaced' | null
  theoryEvidence: string[]
  firstThreadAfterInterruption: ThreadId | null
  resumedFromPin: boolean
}
