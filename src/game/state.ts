import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import type {
  GameState, InvestigationIntention, QuickPin, ReturnPoint, ThreadId, WorkOrderFieldId,
} from './types'

export const initialGameState: GameState = {
  scene: 'maintenance',
  currentThread: 'coupler',
  evidenceFound: [],
  observedWorkOrderFields: [],
  activeIntention: null,
  knowledgeFlags: [],
  quickPin: null,
  quickPinReviewed: false,
  interruptionArmed: false,
  interruptionStatus: 'idle',
  secondaryTaskComplete: false,
  secondaryResponse: null,
  theory: null,
  theoryEvidence: [],
  firstThreadAfterInterruption: null,
  resumedFromPin: false,
}

const addOnce = <T extends string>(items: T[], value: T): T[] =>
  items.includes(value) ? items : [...items, value]

const resumedThread = (state: GameState, thread: ThreadId | null) =>
  state.secondaryTaskComplete && !state.firstThreadAfterInterruption && thread
    ? thread
    : state.firstThreadAfterInterruption

export type GameAction =
  | { type: 'OPEN_WORK_ORDER' }
  | { type: 'OBSERVE_WORK_ORDER_FIELD'; field: WorkOrderFieldId }
  | { type: 'SET_WORKING_INTENTION'; intention: InvestigationIntention }
  | { type: 'TRIGGER_INTERRUPTION' }
  | { type: 'PIN_CURRENT_CONTEXT'; pin: QuickPin }
  | { type: 'REVIEW_PIN' }
  | { type: 'START_INTERRUPTION' }
  | { type: 'COMPLETE_SECONDARY_TASK'; response: string }
  | { type: 'RETURN_TO_PREVIOUS_TASK'; point: ReturnPoint }
  | { type: 'RETURN_TO_HUB' }
  | { type: 'OPEN_THREAD'; thread: ThreadId }
  | { type: 'RESUME_PIN' }
  | { type: 'UNLOCK_STORAGE_LEAD' }
  | { type: 'GO_TO_STORAGE' }
  | { type: 'INSPECT_STORAGE_COUPLER' }
  | { type: 'CHECK_STORAGE_SERIAL' }
  | { type: 'INSPECT_POWER_SPIKE' }
  | { type: 'INSPECT_POWER_PROTECTION' }
  | { type: 'BACK_TO_HUB' }
  | { type: 'OPEN_DEDUCTION' }
  | { type: 'SAVE_THEORY'; answer: 'replaced' | 'not-replaced'; evidence: string[] }
  | { type: 'OPEN_REFLECTION' }
  | { type: 'RESET' }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'OPEN_WORK_ORDER':
      return {
        ...state,
        currentThread: COUPLER.threadId,
        evidenceFound: addOnce(state.evidenceFound, COUPLER.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, COUPLER.knowledgeFlag),
      }
    case 'OBSERVE_WORK_ORDER_FIELD':
      if (!state.evidenceFound.includes(COUPLER.evidenceId)) return state
      return {
        ...state,
        observedWorkOrderFields: addOnce(state.observedWorkOrderFields, action.field),
      }
    case 'SET_WORKING_INTENTION': {
      const allowed = action.intention === 'check-completion'
        ? state.observedWorkOrderFields.includes('completion')
        : state.observedWorkOrderFields.includes('parts')
      return allowed
        ? { ...state, activeIntention: action.intention, interruptionArmed: true }
        : state
    }
    case 'TRIGGER_INTERRUPTION':
      return state.interruptionStatus === 'idle'
        ? { ...state, interruptionStatus: 'warning', interruptionArmed: true }
        : state
    case 'PIN_CURRENT_CONTEXT':
      if (state.interruptionStatus !== 'warning') return state
      return { ...state, quickPin: action.pin, quickPinReviewed: false }
    case 'REVIEW_PIN':
      return state.quickPin ? { ...state, quickPinReviewed: true } : state
    case 'START_INTERRUPTION':
      if (state.interruptionStatus !== 'warning') return state
      return { ...state, interruptionStatus: 'handled', scene: 'secondary' }
    case 'COMPLETE_SECONDARY_TASK':
      if (state.scene !== 'secondary') return state
      return { ...state, secondaryTaskComplete: true, secondaryResponse: action.response }
    case 'RETURN_TO_PREVIOUS_TASK':
      if (!state.secondaryTaskComplete) return state
      return {
        ...state,
        scene: action.point.scene,
        currentThread: action.point.thread,
        firstThreadAfterInterruption: resumedThread(state, action.point.thread),
        resumedFromPin: false,
      }
    case 'RETURN_TO_HUB':
      if (!state.secondaryTaskComplete) return state
      return { ...state, scene: 'hub', currentThread: null, resumedFromPin: false }
    case 'OPEN_THREAD':
      return {
        ...state,
        scene: action.thread === 'coupler' ? 'maintenance' : 'power',
        currentThread: action.thread,
        firstThreadAfterInterruption: resumedThread(state, action.thread),
        resumedFromPin: false,
      }
    case 'RESUME_PIN':
      if (!state.quickPin || !state.secondaryTaskComplete) return state
      return {
        ...state,
        scene: state.quickPin.returnPoint.scene,
        currentThread: state.quickPin.returnPoint.thread,
        firstThreadAfterInterruption: resumedThread(state, state.quickPin.returnPoint.thread),
        quickPinReviewed: true,
        resumedFromPin: true,
      }
    case 'UNLOCK_STORAGE_LEAD':
      if (!state.observedWorkOrderFields.includes('parts')) return state
      return { ...state, knowledgeFlags: addOnce(state.knowledgeFlags, 'K_STORAGE_LEAD_UNLOCKED') }
    case 'GO_TO_STORAGE':
      return {
        ...state,
        scene: 'storage',
        currentThread: 'coupler',
        firstThreadAfterInterruption: resumedThread(state, 'coupler'),
        resumedFromPin: false,
      }
    case 'INSPECT_STORAGE_COUPLER':
      return {
        ...state,
        interruptionArmed: true, // Storage-first engagement qualifies; crate opening alone does not.
        evidenceFound: addOnce(state.evidenceFound, STORAGE_COUPLER.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, STORAGE_COUPLER.knowledgeFlag),
      }
    case 'CHECK_STORAGE_SERIAL':
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, STORAGE_COUPLER.serialEvidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, STORAGE_COUPLER.serialFlag),
      }
    case 'INSPECT_POWER_SPIKE':
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, POWER_SPIKE.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, 'K_POWER_SPIKE_FOUND'),
      }
    case 'INSPECT_POWER_PROTECTION':
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, POWER_SPIKE.protectionEvidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, 'K_PROTECTION_CONTAINED_SPIKE'),
      }
    case 'BACK_TO_HUB':
      return { ...state, scene: 'hub', currentThread: null, resumedFromPin: false }
    case 'OPEN_DEDUCTION':
      return { ...state, scene: 'deduction' }
    case 'SAVE_THEORY':
      return { ...state, theory: action.answer, theoryEvidence: action.evidence }
    case 'OPEN_REFLECTION':
      // Main serious-game loop MUST include a completed real interruption.
      if (!state.theory || !state.secondaryTaskComplete) return state
      return { ...state, scene: 'reflection' }
    case 'RESET':
      return initialGameState
    default:
      return state
  }
}
