import { COUPLER, STORAGE_COUPLER } from '../content/coupler'
import { POWER_SPIKE } from '../content/power'
import { canCompareSourceSerials, hasCouplerObservation } from './evidence'
import type {
  GameState, InvestigationIntention, QuickPin, ReturnPoint, ThreadId, WorkOrderFieldId,
  ReflectionKey, ReflectionAnswers, VerificationNextStep,
} from './types'

export const initialGameState: GameState = {
  scene: 'maintenance',
  currentThread: 'coupler',
  evidenceFound: [],
  workOrderOpened: false,
  storageCrateOpen: false,
  comparedEvidenceIds: [],
  observedWorkOrderFields: [],
  activeIntention: null,
  knowledgeFlags: [],
  quickPin: null,
  quickPinReviewed: false,
  interruptionArmed: false,
  interruptionReady: false,
  verificationNextStep: null,
  interruptionOccurredDuringInvestigation: false,
  interruptionStatus: 'idle',
  secondaryTaskComplete: false,
  secondaryResponse: null,
  theory: null,
  theoryEvidence: [],
  firstThreadAfterInterruption: null,
  resumedFromPin: false,
  reflectionAnswers: { difficulty: null, support: null, change: null },
  reflectionSubmitted: false,
}

const addOnce = <T extends string>(items: T[], value: T): T[] =>
  items.includes(value) ? items : [...items, value]

// Recovery is recorded only when the player actually interacts with a
// source or selects a task focus AFTER C-17. Crossing a doorway is not
// context recovery and must not complete the serious-game loop.
const resumedOnActivity = (state: GameState, thread: ThreadId): ThreadId | null =>
  state.secondaryTaskComplete && !state.firstThreadAfterInterruption
    ? thread
    : state.firstThreadAfterInterruption

export type GameAction =
  | { type: 'OPEN_WORK_ORDER' }
  | { type: 'OPEN_STORAGE_CRATE' }
  | { type: 'SAVE_COMPARISON' }
  | { type: 'OBSERVE_WORK_ORDER_FIELD'; field: WorkOrderFieldId }
  | { type: 'SET_WORKING_INTENTION'; intention: InvestigationIntention }
  | { type: 'PREPARE_VERIFICATION_CHECK'; nextStep: VerificationNextStep }
  | { type: 'TRIGGER_INTERRUPTION'; point: ReturnPoint }
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
  | { type: 'SET_REFLECTION_ANSWER'; key: ReflectionKey; value: string | null }
  | { type: 'SUBMIT_REFLECTION' }
  | { type: 'SKIP_REFLECTION' }
  | { type: 'RESET' }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'OPEN_WORK_ORDER':
      return {
        ...state,
        workOrderOpened: true,
        currentThread: COUPLER.threadId,
      }
    case 'OBSERVE_WORK_ORDER_FIELD': {
      if (!state.workOrderOpened) return state
      const sourceId = action.field === 'service'
        ? 'MAI_WO_SERVICE'
        : action.field === 'completion'
          ? COUPLER.evidenceId
          : 'MAI_INSTALL_VERIFY_FIELD'
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, sourceId),
        observedWorkOrderFields: addOnce(state.observedWorkOrderFields, action.field),
        knowledgeFlags: addOnce(state.knowledgeFlags, COUPLER.knowledgeFlag),
        firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
      }
    }
    case 'OPEN_STORAGE_CRATE':
      return state.storageCrateOpen ? state : { ...state, storageCrateOpen: true }
    case 'SAVE_COMPARISON': {
      // Comparison records a deliberate source pairing, never a verdict.
      if (!canCompareSourceSerials(state)) return state
      const recordSource = state.observedWorkOrderFields.includes('parts')
        ? 'MAI_INSTALL_VERIFY_FIELD'
        : COUPLER.evidenceId
      const ids = [
        recordSource,
        STORAGE_COUPLER.serialEvidenceId,
        ...(state.evidenceFound.includes(STORAGE_COUPLER.evidenceId) ? [STORAGE_COUPLER.evidenceId] : []),
      ]
      return {
        ...state,
        comparedEvidenceIds: ids.reduce(
          (items, id) => addOnce(items, id), [...state.comparedEvidenceIds],
        ),
        firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
      }
    }
    case 'PREPARE_VERIFICATION_CHECK': {
      // Player makes an actual follow-up plan using an inspected source. This
      // leaves a clearly unfinished investigation step for C-17 to interrupt.
      const allowed = action.nextStep === 'review-completion'
        ? state.observedWorkOrderFields.includes('completion')
        : state.observedWorkOrderFields.includes('parts')
      if (!allowed || !state.workOrderOpened || state.scene !== 'maintenance' ||
          !state.activeIntention) return state
      return {
        ...state,
        verificationNextStep: action.nextStep,
        // If C-17 is already pending/handled, the player may still plan a
        // follow-up without generating another interruption.
        interruptionReady: state.interruptionStatus === 'idle',
        firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
      }
    }
    case 'SET_WORKING_INTENTION': {
      const allowed = action.intention === 'check-completion'
        ? state.observedWorkOrderFields.includes('completion')
        : state.observedWorkOrderFields.includes('parts')
      return allowed
        ? {
            ...state,
            activeIntention: action.intention,
            interruptionArmed: true,
            // A focus choice alone is not the action that gets interrupted.
            // The follow-up verification worksheet must be completed next.
            firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
          }
        : state
    }
    case 'TRIGGER_INTERRUPTION': {
      // Do not allow a Hub interaction to manufacture an investigation
      // interruption. A valid alert must begin while an eligible Coupler task
      // is actively being inspected, and its origin is preserved for recovery.
      const point = action.point
      const engagedInWorkstation =
        point.scene === 'maintenance' &&
        point.workstationFocused &&
        state.workOrderOpened &&
        state.activeIntention !== null
      const engagedInStorage =
        point.scene === 'storage' &&
        state.storageCrateOpen &&
        state.evidenceFound.some((id) => id === 'STO_NEW_COUPLER' || id === 'STO_NEW_COUPLER_SERIAL')
      if (
        state.interruptionStatus !== 'idle' ||
        !state.interruptionArmed ||
        !state.interruptionReady ||
        point.scene !== state.scene ||
        !(engagedInWorkstation || engagedInStorage)
      ) return state
      return {
        ...state,
        interruptionStatus: 'warning',
        interruptionReady: false,
        interruptionOccurredDuringInvestigation: true,
      }
    }
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
        resumedFromPin: false,
      }
    case 'RESUME_PIN':
      if (!state.quickPin || !state.secondaryTaskComplete) return state
      return {
        ...state,
        scene: state.quickPin.returnPoint.scene,
        currentThread: state.quickPin.returnPoint.thread,
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
        resumedFromPin: false,
      }
    case 'INSPECT_STORAGE_COUPLER':
      if (!state.storageCrateOpen) return state
      return {
        ...state,
        interruptionArmed: true,
        // The second deliberate inspection (even rechecking a source) arms
        // delivery after the evidence window closes; never while reading it.
        interruptionReady: state.interruptionReady ||
          (state.interruptionStatus === 'idle' &&
            (state.evidenceFound.includes(STORAGE_COUPLER.evidenceId) ||
             state.evidenceFound.includes(STORAGE_COUPLER.serialEvidenceId))),
        evidenceFound: addOnce(state.evidenceFound, STORAGE_COUPLER.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, STORAGE_COUPLER.knowledgeFlag),
        firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
      }
    case 'CHECK_STORAGE_SERIAL':
      if (!state.storageCrateOpen) return state
      return {
        ...state,
        interruptionArmed: true,
        interruptionReady: state.interruptionReady ||
          (state.interruptionStatus === 'idle' &&
            (state.evidenceFound.includes(STORAGE_COUPLER.evidenceId) ||
             state.evidenceFound.includes(STORAGE_COUPLER.serialEvidenceId))),
        evidenceFound: addOnce(state.evidenceFound, STORAGE_COUPLER.serialEvidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, STORAGE_COUPLER.serialFlag),
        firstThreadAfterInterruption: resumedOnActivity(state, 'coupler'),
      }
    case 'INSPECT_POWER_SPIKE':
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, POWER_SPIKE.evidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, 'K_POWER_SPIKE_FOUND'),
        firstThreadAfterInterruption: resumedOnActivity(state, 'power'),
      }
    case 'INSPECT_POWER_PROTECTION':
      return {
        ...state,
        evidenceFound: addOnce(state.evidenceFound, POWER_SPIKE.protectionEvidenceId),
        knowledgeFlags: addOnce(state.knowledgeFlags, 'K_PROTECTION_CONTAINED_SPIKE'),
        firstThreadAfterInterruption: resumedOnActivity(state, 'power'),
      }
    case 'BACK_TO_HUB':
      return { ...state, scene: 'hub', currentThread: null, resumedFromPin: false }
    case 'OPEN_DEDUCTION':
      return hasCouplerObservation(state) ? { ...state, scene: 'deduction' } : state
    case 'SAVE_THEORY': {
      // Validate against actually inspected source IDs even if a stale UI tries to submit.
      if (!hasCouplerObservation(state) || action.evidence.length === 0 ||
        !action.evidence.every((id) => state.evidenceFound.includes(id))) return state
      return {
        ...state,
        theory: action.answer,
        theoryEvidence: [...new Set(action.evidence)],
      }
    }
    case 'SET_REFLECTION_ANSWER': {
      if (state.scene !== 'reflection') return state
      const allowed: Record<ReflectionKey, readonly string[]> = {
        difficulty: ['easy', 'some-effort', 'difficult', 'unsure'],
        support: ['pin', 're-read', 'memory', 'other', 'unsure'],
        change: ['yes', 'no', 'unsure'],
      }
      if (action.value !== null && !allowed[action.key].includes(action.value)) return state
      return {
        ...state,
        reflectionSubmitted: false,
        reflectionAnswers: {
          ...state.reflectionAnswers,
          [action.key]: action.value,
        } as ReflectionAnswers,
      }
    }
    case 'SUBMIT_REFLECTION':
      return state.scene === 'reflection'
        ? { ...state, reflectionSubmitted: true }
        : state
    case 'SKIP_REFLECTION':
      return state.scene === 'reflection'
        ? {
            ...state,
            reflectionSubmitted: true,
            reflectionAnswers: { difficulty: null, support: null, change: null },
          }
        : state
    case 'OPEN_REFLECTION':
      // Finishing requires a real interrupted investigation, the handled alert,
      // and a subsequent return to a chosen investigation thread. The theory
      // remains provisional and may have been saved before the interruption.
      if (
        !state.theory ||
        !state.secondaryTaskComplete ||
        !state.interruptionOccurredDuringInvestigation ||
        state.firstThreadAfterInterruption === null
      ) return state
      return { ...state, scene: 'reflection' }
    case 'RESET':
      return initialGameState
    default:
      return state
  }
}
