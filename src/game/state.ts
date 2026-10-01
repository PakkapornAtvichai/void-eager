import { COUPLER, INCIDENT_INTERRUPTION, STORAGE_COUPLER } from '../content/coupler'
import type { GameState } from './types'

export const initialGameState: GameState = {
  scene: 'maintenance',
  currentThread: null,
  evidenceFound: [],
  knowledgeFlags: [],
  quickPin: null,
  interruption: null,
  secondaryTaskComplete: false,
  deduction: null,
}

const addOnce = (items: string[], value: string) =>
  items.includes(value) ? items : [...items, value]

export type GameAction =
  | { type: 'OPEN_WORK_ORDER' }
  | { type: 'PIN_AND_OPEN_INTERRUPTION' }
  | { type: 'OPEN_INTERRUPTION' }
  | { type: 'COMPLETE_SECONDARY_TASK' }
  | { type: 'RETURN_TO_INVESTIGATION' }
  | { type: 'GO_TO_STORAGE' }
  | { type: 'INSPECT_STORAGE_COUPLER' }
  | { type: 'CHECK_STORAGE_SERIAL' }
  | { type: 'OPEN_DEDUCTION' }
  | { type: 'SUBMIT_DEDUCTION'; answer: 'replaced' | 'not-replaced' }
  | { type: 'OPEN_REFLECTION' }
  | { type: 'RESET' }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'OPEN_WORK_ORDER':
      return {
        ...state,
        currentThread: COUPLER.thread,
        evidenceFound: addOnce(state.evidenceFound, COUPLER.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, COUPLER.knowledgeFlag),
        interruption: { ...INCIDENT_INTERRUPTION },
      }
    case 'PIN_AND_OPEN_INTERRUPTION':
      return {
        ...state,
        quickPin: {
          thread: state.currentThread ?? COUPLER.thread,
          evidenceId: COUPLER.evidenceId,
          evidenceLabel: COUPLER.evidenceLabel,
          location: 'Maintenance',
        },
        interruption: null,
        scene: 'secondary',
      }
    case 'OPEN_INTERRUPTION':
      return {
        ...state,
        quickPin: null,
        interruption: null,
        scene: 'secondary',
      }
    case 'COMPLETE_SECONDARY_TASK':
      return {
        ...state,
        secondaryTaskComplete: true,
      }
    case 'RETURN_TO_INVESTIGATION':
      return {
        ...state,
        scene: 'maintenance',
      }
    case 'GO_TO_STORAGE':
      return {
        ...state,
        scene: 'storage',
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
    case 'OPEN_DEDUCTION':
      return {
        ...state,
        scene: 'deduction',
        deduction: null,
      }
    case 'SUBMIT_DEDUCTION':
      return {
        ...state,
        deduction: action.answer === 'not-replaced' ? 'correct' : 'incorrect',
        knowledgeFlags: action.answer === 'not-replaced'
          ? addOnce(state.knowledgeFlags, 'K_COUPLER_NOT_REPLACED')
          : state.knowledgeFlags,
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
