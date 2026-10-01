import { COUPLER, INCIDENT_INTERRUPTION } from '../content/coupler'
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
    default:
      return state
  }
}
