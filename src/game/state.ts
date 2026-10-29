import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import type { GameState, InvestigationIntention, ThreadId, WorkOrderFieldId } from './types'

export const initialGameState: GameState = {
  scene: 'maintenance',
  currentThread: 'coupler',
  evidenceFound: [],
  observedWorkOrderFields: [],
  activeIntention: null,
  knowledgeFlags: [],
  quickPin: null,
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

const resumedThread = (state: GameState, thread: ThreadId) =>
  state.secondaryTaskComplete && !state.firstThreadAfterInterruption
    ? thread
    : state.firstThreadAfterInterruption
export type GameAction =
  | { type: 'OPEN_WORK_ORDER' }
  | { type: 'OBSERVE_WORK_ORDER_FIELD'; field: WorkOrderFieldId }
  | { type: 'SET_WORKING_INTENTION'; intention: InvestigationIntention }
  | { type: 'TRIGGER_INTERRUPTION' }
  | { type: 'PIN_CURRENT_CONTEXT'; scrollOffset: number }
  | { type: 'START_INTERRUPTION' }
  | { type: 'COMPLETE_SECONDARY_TASK'; response: string }
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
      // Work Order intentions must be based on a field the player actually inspected.
      const allowed = action.intention === 'check-completion'
        ? state.observedWorkOrderFields.includes('completion')
        : state.observedWorkOrderFields.includes('parts')
      return allowed ? { ...state, activeIntention: action.intention } : state
    }
    case 'TRIGGER_INTERRUPTION':
      return state.interruptionStatus === 'idle'
        ? { ...state, interruptionStatus: 'warning' }
        : state
    case 'PIN_CURRENT_CONTEXT':
      return {
        ...state,
        quickPin: {
          threadId: COUPLER.threadId,
          thread: COUPLER.thread,
          location: 'Maintenance report',
          context: `Replacement serial ${COUPLER.workOrder.replacementSerial}; installation verification not attached.`,
          scrollOffset: action.scrollOffset,
        },
      }
    case 'START_INTERRUPTION':
      return {
        ...state,
        interruptionStatus: 'handled',
        scene: 'secondary',
      }
    case 'COMPLETE_SECONDARY_TASK':
      return {
        ...state,
        secondaryTaskComplete: true,
        secondaryResponse: action.response,
      }
    case 'RETURN_TO_HUB':
      return {
        ...state,
        scene: 'hub',
        currentThread: null,
        resumedFromPin: false,
      }
    case 'OPEN_THREAD':
      return {
        ...state,
        scene: action.thread === 'coupler' ? 'maintenance' : 'power',
        currentThread: action.thread,
        firstThreadAfterInterruption: resumedThread(state, action.thread),
        resumedFromPin: false,
      }
    case 'RESUME_PIN':
      if (!state.quickPin) return state
      return {
        ...state,
        scene: state.quickPin.threadId === 'coupler' ? 'maintenance' : 'power',
        currentThread: state.quickPin.threadId,
        firstThreadAfterInterruption: resumedThread(state, state.quickPin.threadId),
        resumedFromPin: true,
      }
    case 'UNLOCK_STORAGE_LEAD':
      // A traced source is a navigation shortcut, not a door or a C-17 reward.
      if (!state.observedWorkOrderFields.includes('parts')) return state
      return {
        ...state,
        knowledgeFlags: addOnce(state.knowledgeFlags, 'K_STORAGE_LEAD_UNLOCKED'),
      }
    case 'GO_TO_STORAGE':
      return {
        ...state,
        scene: 'storage',
        currentThread: 'coupler',
      }
    case 'INSPECT_STORAGE_COUPLER':
      return {
        ...state,
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
      return {
        ...state,
        scene: 'hub',
        currentThread: null,
        resumedFromPin: false,
      }
    case 'OPEN_DEDUCTION':
      return {
        ...state,
        scene: 'deduction',
      }
    case 'SAVE_THEORY':
      return {
        ...state,
        theory: action.answer,
        theoryEvidence: action.evidence,
      }
    case 'OPEN_REFLECTION':
      return {
        ...state,
        scene: 'reflection',
      }
    case 'RESET':
      return initialGameState
    default:
      return state
  }
}
