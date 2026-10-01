export type Scene = 'maintenance' | 'secondary' | 'storage' | 'deduction' | 'reflection'

export type QuickPin = {
  thread: string
  evidenceId: string
  evidenceLabel: string
  location: string
}

export type Interruption = {
  id: string
  title: string
  body: string
}

export type GameState = {
  scene: Scene
  currentThread: string | null
  evidenceFound: string[]
  knowledgeFlags: string[]
  quickPin: QuickPin | null
  interruption: Interruption | null
  secondaryTaskComplete: boolean
  deduction: string | null
}
