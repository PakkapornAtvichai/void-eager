export type ThreadId = 'coupler' | 'power'

export type Scene =
  | 'maintenance'
  | 'secondary'
  | 'hub'
  | 'storage'
  | 'power'
  | 'deduction'
  | 'reflection'

export type QuickPin = {
  threadId: ThreadId
  thread: string
  location: string
  context: string
  scrollOffset: number
}

export type InterruptionStatus = 'idle' | 'warning' | 'handled'
export type GameState = {
  scene: Scene
  currentThread: ThreadId | null
  evidenceFound: string[]
  knowledgeFlags: string[]
  quickPin: QuickPin | null
  interruptionStatus: InterruptionStatus
  secondaryTaskComplete: boolean
  secondaryResponse: string | null
  theory: 'replaced' | 'not-replaced' | null
  theoryEvidence: string[]
  firstThreadAfterInterruption: ThreadId | null
  resumedFromPin: boolean
}
