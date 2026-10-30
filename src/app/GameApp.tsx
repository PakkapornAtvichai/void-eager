import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { DeductionScene } from '../components/DeductionScene'
import { HubScene } from '../components/HubScene'
import { IncomingInterruption, PendingIncidentTab } from '../components/IncomingInterruption'
import type { PinCueOption } from '../components/IncomingInterruption'
import { MaintenanceScene } from '../components/MaintenanceScene'
import { MaintenanceInspectionScene } from '../components/MaintenanceInspectionScene'
import type { MaintenanceInspectionArea } from '../components/MaintenanceInspectionScene'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import { WorkstationFocusScene } from '../components/WorkstationFocusScene'
import { PowerScene } from '../components/PowerScene'
import { ReflectionScene } from '../components/ReflectionScene'
import { SecondaryScene } from '../components/SecondaryScene'
import { StatusRail } from '../components/StatusRail'
import { ObjectiveTracker } from '../components/ObjectiveTracker'
import { CaseBriefDialog } from '../components/CaseBriefDialog'
import { currentObjective } from '../game/objectives'
import { hasCouplerObservation } from '../game/evidence'
import { StorageScene } from '../components/StorageScene'
import { gameReducer, initialGameState } from '../game/state'
import type { GameAction } from '../game/state'
import type { GameState, ReturnPoint } from '../game/types'
import { COUPLER } from '../content/coupler'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

// The C-17 trigger is based on eligible time spent investigating, not time since
// someone opened a report. It is not a visible countdown and never runs in a dialog.
const INTERRUPT_AFTER_ACTIVE_MS = 7000

const pointLabel = (point: ReturnPoint | null): string => {
  if (!point) return 'Incident Hub'
  if (point.scene === 'storage') return 'Storage B-04'
  if (point.scene === 'maintenance' && point.workstationFocused) return 'Workstation'
  if (point.scene === 'maintenance' && point.maintenanceInspection) return 'Maintenance / ' + point.maintenanceInspection
  if (point.scene === 'maintenance') return 'Maintenance'
  if (point.scene === 'power') return 'Power Log'
  if (point.scene === 'deduction') return 'Case Review'
  return 'Incident Hub'
}

const pinChoicesFor = (point: ReturnPoint, state: GameState): PinCueOption[] => {
  if (point.scene === 'storage') {
    return state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')
      ? [
          { id: 'review-physical-serial', label: 'Review the serial plate I inspected' },
          { id: 'review-condition', label: 'Recheck the Coupler condition' },
        ]
      : [
          { id: 'read-physical-serial', label: 'Read the Coupler serial plate next' },
          { id: 'review-condition', label: 'Recheck the Coupler condition' },
        ]
  }
  if (point.scene === 'maintenance' && point.workstationFocused) {
    const choices: PinCueOption[] = []
    if (state.observedWorkOrderFields.includes('completion')) {
      choices.push({ id: 'check-completion', label: 'Check the recorded completion' })
    }
    if (state.observedWorkOrderFields.includes('parts')) {
      choices.push(
        { id: 'trace-part', label: 'Trace the issued part to Storage' },
        { id: 'check-verification', label: 'Look for installation verification' },
      )
    }
    // The player's chosen focus, if any, should be the first and default choice.
    const selected = choices.findIndex((option) => option.id === state.activeIntention)
    if (selected > 0) choices.unshift(...choices.splice(selected, 1))
    return choices.length
      ? choices
      : [{ id: 'continue-workorder', label: 'Continue reviewing the Work Order' }]
  }
  if (point.scene === 'power') return [{ id: 'review-power', label: 'Continue checking the power timeline' }]
  return [{ id: 'return-to-case', label: 'Return to the Coupler investigation' }]
}

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [maintenanceScroll, setMaintenanceScroll] = useState(0)
  const [workstationFocused, setWorkstationFocused] = useState(false)
  const [maintenanceInspection, setMaintenanceInspection] = useState<MaintenanceInspectionArea | null>(null)
  const [briefingDismissed, setBriefingDismissed] = useState(false)
  const [locationTransition, setLocationTransition] = useState<string | null>(null)
  const [incidentExpanded, setIncidentExpanded] = useState(false)
  const [workstationDetailOpen, setWorkstationDetailOpen] = useState(false)
  const [storageDetailOpen, setStorageDetailOpen] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [interruptedPoint, setInterruptedPoint] = useState<ReturnPoint | null>(null)
  const [pinOptions, setPinOptions] = useState<PinCueOption[]>([])
  const [returnScrollOffset, setReturnScrollOffset] = useState<number | null>(null)
  const elapsedActiveMs = useRef(0)

  const recordOpened = state.workOrderOpened
  const caseEvidenceAvailable = hasCouplerObservation(state)
  const storageInspected = state.evidenceFound.includes('STO_NEW_COUPLER')
  const serialChecked = state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')
  const spikeFound = state.evidenceFound.includes('ENG_POWER_SPIKE_LOG')
  const protectionFound = state.evidenceFound.includes('ENG_PROTECTION_ACTIVE_LOG')
  const storageLeadUnlocked = state.knowledgeFlags.includes('K_STORAGE_LEAD_UNLOCKED')

  // Guidance describes existing interactions; it does not gate investigation or reveal a verdict.
  const objective = currentObjective(state, {
    workstationFocused,
    maintenanceInspection,
    recordOpened,
    observedFields: state.observedWorkOrderFields,
    activeIntention: state.activeIntention,
    storageLeadUnlocked,
    serialChecked,
    spikeFound,
    protectionFound,
  })

  useEffect(() => {
    Object.values(YOKO_PACK_ASSETS).forEach((src) => {
      const preload = new Image()
      preload.src = src
    })
  }, [])

  // An unresolved alert stays pending after the player chooses LATER.
  useEffect(() => {
    setIncidentExpanded(state.interruptionStatus === 'warning')
  }, [state.interruptionStatus])

  useEffect(() => {
    if (state.scene !== 'maintenance') {
      setWorkstationFocused(false)
      setMaintenanceInspection(null)
    }
  }, [state.scene])

  const captureReturnPoint = useCallback((): ReturnPoint => ({
    scene: state.scene === 'secondary' || state.scene === 'reflection' ? 'hub' : state.scene,
    thread: state.currentThread,
    workstationFocused: state.scene === 'maintenance' && workstationFocused,
    maintenanceInspection: state.scene === 'maintenance' ? maintenanceInspection : null,
    scrollOffset: maintenanceScroll,
  }), [state.scene, state.currentThread, workstationFocused, maintenanceInspection, maintenanceScroll])

  const triggerIncident = useCallback(() => {
    if (state.interruptionStatus !== 'idle' || state.secondaryTaskComplete) return
    const point = captureReturnPoint()
    // C-17 is generated only from the active-work timer. The reducer also
    // validates this origin, independently of the visible Hub controls.
    if (
      !state.interruptionArmed ||
      !((point.scene === 'maintenance' && point.workstationFocused && state.activeIntention !== null) ||
        (point.scene === 'storage' && state.storageCrateOpen &&
          (storageInspected || serialChecked)))
    ) return
    setInterruptedPoint(point)
    setPinOptions(pinChoicesFor(point, state))
    dispatch({ type: 'TRIGGER_INTERRUPTION', point })
  }, [state, captureReturnPoint, storageInspected, serialChecked])

  // Eligibility matches the reducer's real-work origin checks. Merely
  // entering a room after arming another task does not consume alert time.
  const eligibleForC17 =
    (state.scene === 'maintenance' && workstationFocused && recordOpened && state.activeIntention !== null) ||
    (state.scene === 'storage' && state.storageCrateOpen && (storageInspected || serialChecked))
  const canTick =
    state.interruptionArmed &&
    state.interruptionStatus === 'idle' &&
    !state.secondaryTaskComplete &&
    eligibleForC17 &&
    !workstationDetailOpen &&
    !storageDetailOpen &&
    !hintOpen &&
    !locationTransition

  useEffect(() => {
    if (!canTick) return
    const beganAt = Date.now()
    const remaining = Math.max(0, INTERRUPT_AFTER_ACTIVE_MS - elapsedActiveMs.current)
    const timer = window.setTimeout(() => {
      elapsedActiveMs.current = INTERRUPT_AFTER_ACTIVE_MS
      // Always wait for the current evidence/help dialog to close.
      if (!document.querySelector('[role="dialog"]')) triggerIncident()
    }, remaining)
    return () => {
      window.clearTimeout(timer)
      elapsedActiveMs.current = Math.min(
        INTERRUPT_AFTER_ACTIVE_MS,
        elapsedActiveMs.current + Math.max(0, Date.now() - beganAt),
      )
    }
  }, [canTick, triggerIncident])

  // Only player-directed navigation gets a location transition.
  // The system interruption continues to take over the current workstation in place.
  const navigateTo = useCallback((destination: string, action: GameAction) => {
    if (locationTransition) return
    setLocationTransition(destination)
    window.setTimeout(() => {
      dispatch(action)
      setLocationTransition(null)
    }, 360)
  }, [locationTransition])

  const handleIncident = useCallback(() => {
    setIncidentExpanded(false)
    navigateTo('SHIPWIDE SYSTEM // C-17', { type: 'START_INTERRUPTION' })
  }, [navigateTo])

  const returnToPreviousTask = useCallback(() => {
    if (!interruptedPoint) {
      navigateTo('INCIDENT HUB', { type: 'RETURN_TO_HUB' })
      return
    }
    setWorkstationFocused(interruptedPoint.workstationFocused)
    setMaintenanceInspection(interruptedPoint.maintenanceInspection)
    setReturnScrollOffset(interruptedPoint.scrollOffset)
    navigateTo(pointLabel(interruptedPoint), { type: 'RETURN_TO_PREVIOUS_TASK', point: interruptedPoint })
  }, [interruptedPoint, navigateTo])

  const resumeSavedPin = useCallback(() => {
    const pin = state.quickPin
    if (!pin) return
    setWorkstationFocused(pin.returnPoint.workstationFocused)
    setMaintenanceInspection(pin.returnPoint.maintenanceInspection)
    setReturnScrollOffset(pin.scrollOffset)
    navigateTo(pointLabel(pin.returnPoint), { type: 'RESUME_PIN' })
  }, [state.quickPin, navigateTo])

  const saveSelectedPin = useCallback((cueId: string) => {
    const point = interruptedPoint
    const chosen = pinOptions.find((option) => option.id === cueId)
    if (!point || !chosen) return
    dispatch({
      type: 'PIN_CURRENT_CONTEXT',
      pin: {
        threadId: 'coupler',
        thread: COUPLER.thread,
        location: pointLabel(point),
        cueId: chosen.id,
        context: chosen.label,
        returnPoint: point,
        scrollOffset: point.scrollOffset,
      },
    })
  }, [interruptedPoint, pinOptions])

  const onOpenPendingAlert = useCallback(() => {
    // Hub may re-open a genuinely pending alert; it cannot trigger a new one.
    if (state.interruptionStatus === 'warning') setIncidentExpanded(true)
  }, [state.interruptionStatus])

  const currentLocation = (() => {
    if (state.scene === 'maintenance') {
      if (workstationFocused) return 'MAINTENANCE // WORKSTATION'
      if (maintenanceInspection) return 'MAINTENANCE // ' + maintenanceInspection.toUpperCase()
      return 'MAINTENANCE'
    }
    if (state.scene === 'secondary') return 'INCIDENT SYSTEM // C-17'
    if (state.scene === 'hub') return 'INCIDENT HUB'
    if (state.scene === 'storage') return 'STORAGE // B-04'
    if (state.scene === 'power') return 'ENGINEERING // POWER LOG'
    if (state.scene === 'deduction') return 'INCIDENT REVIEW'
    return 'POST-INCIDENT'
  })()

  const scene = (() => {
    if (state.scene === 'maintenance') {
      return (
        workstationFocused ? (
          <WorkstationFocusScene
            opened={recordOpened}
            restoreScrollOffset={returnScrollOffset}
            onModalChange={setWorkstationDetailOpen}
            onScrollChange={setMaintenanceScroll}
            storageLeadUnlocked={storageLeadUnlocked}
            observedFields={state.observedWorkOrderFields}
            activeIntention={state.activeIntention}
            onObserveField={(field) => dispatch({ type: 'OBSERVE_WORK_ORDER_FIELD', field })}
            onSetIntention={(intention) => dispatch({ type: 'SET_WORKING_INTENTION', intention })}
            onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })}
            onUnlockStorageLead={() => dispatch({ type: 'UNLOCK_STORAGE_LEAD' })}
            onBack={() => {
              setWorkstationFocused(false)
              setReturnScrollOffset(null)
            }}
          />
        ) : maintenanceInspection ? (
          <MaintenanceInspectionScene
            area={maintenanceInspection}
            onBack={() => setMaintenanceInspection(null)}
          />
        ) : (
          <MaintenanceScene
            onWorkstation={() => {
              setBriefingDismissed(true)
              setMaintenanceInspection(null)
              setWorkstationFocused(true)
            }}
            onInspect={(area) => {
              setBriefingDismissed(true)
              setMaintenanceInspection(area)
            }}
            onStorage={() => navigateTo('STORAGE // B-04', { type: 'GO_TO_STORAGE' })}
            hubAvailable={true}
            onHub={() => navigateTo('INCIDENT HUB', { type: 'BACK_TO_HUB' })}
          />
        )
      )
    }
    if (state.scene === 'secondary') {
      return (
        <SecondaryScene
          complete={state.secondaryTaskComplete}
          response={state.secondaryResponse}
          originLabel={pointLabel(interruptedPoint)}
          fromWorkstation={Boolean(interruptedPoint?.scene === 'maintenance' && interruptedPoint.workstationFocused)}
          onComplete={(response) => dispatch({ type: 'COMPLETE_SECONDARY_TASK', response })}
          onReturnPrevious={returnToPreviousTask}
          onReturnHub={() => navigateTo('INCIDENT HUB', { type: 'RETURN_TO_HUB' })}
        />
      )
    }

    if (state.scene === 'hub') {
      return (
        <HubScene
          observedEvidence={state.evidenceFound}
          activeIntention={state.activeIntention}
          theorySaved={Boolean(state.theory)}
          comparisonSaved={state.comparedEvidenceIds.length > 0}
          alertComplete={state.secondaryTaskComplete}
          alertPending={state.interruptionStatus === 'warning'}
          resumedAfterAlert={state.firstThreadAfterInterruption !== null}
          onOpenAlert={onOpenPendingAlert}
          onMaintenance={() => {
            setReturnScrollOffset(null)
            setWorkstationFocused(false)
            setMaintenanceInspection(null)
            navigateTo('MAINTENANCE ROOM', { type: 'OPEN_THREAD', thread: 'coupler' })
          }}
          onEngineering={() => navigateTo('ENGINEERING // POWER LOG', { type: 'OPEN_THREAD', thread: 'power' })}
          onCaseReview={() => dispatch({ type: 'OPEN_DEDUCTION' })}
          onEndSession={() => dispatch({ type: 'OPEN_REFLECTION' })}
        />
      )
    }

    if (state.scene === 'storage') {
      return (
        <StorageScene
          crateOpen={state.storageCrateOpen}
          inspected={storageInspected}
          serialChecked={serialChecked}
          completionObserved={state.observedWorkOrderFields.includes('completion')}
          partsObserved={state.observedWorkOrderFields.includes('parts')}
          compared={state.comparedEvidenceIds.length > 0}
          onOpenCrate={() => dispatch({ type: 'OPEN_STORAGE_CRATE' })}
          onInspect={() => dispatch({ type: 'INSPECT_STORAGE_COUPLER' })}
          onCheckSerial={() => dispatch({ type: 'CHECK_STORAGE_SERIAL' })}
          onSaveComparison={() => dispatch({ type: 'SAVE_COMPARISON' })}
          onRecheckWorkOrder={() => {
            setWorkstationFocused(false)
            navigateTo('MAINTENANCE ROOM', { type: 'OPEN_THREAD', thread: 'coupler' })
          }}
          onModalChange={setStorageDetailOpen}
          onBack={() => navigateTo('MAINTENANCE ROOM', { type: 'OPEN_THREAD', thread: 'coupler' })}
        />
      )
    }
    if (state.scene === 'power') {
      return (
        <PowerScene
          spikeFound={spikeFound}
          protectionFound={protectionFound}
          onInspectSpike={() => dispatch({ type: 'INSPECT_POWER_SPIKE' })}
          onInspectProtection={() => dispatch({ type: 'INSPECT_POWER_PROTECTION' })}
          onBack={() => navigateTo('INCIDENT HUB', { type: 'BACK_TO_HUB' })}
        />
      )
    }

    if (state.scene === 'deduction') {
      return (
        <DeductionScene
          theory={state.theory}
          theoryEvidence={state.theoryEvidence}
          observedEvidence={state.evidenceFound}
          comparedEvidenceIds={state.comparedEvidenceIds}
          onSave={(answer, evidence) => dispatch({ type: 'SAVE_THEORY', answer, evidence })}
          onBack={() => dispatch({ type: 'BACK_TO_HUB' })}
        />
      )
    }

    return (
      <ReflectionScene
        usedQuickPin={state.quickPinReviewed}
        interruptionCount={state.secondaryTaskComplete ? 1 : 0}
        evidenceCount={state.evidenceFound.length}
        firstThread={state.firstThreadAfterInterruption}
        theory={state.theory}
        theoryEvidenceCount={state.theoryEvidence.length}
        secondaryResponse={state.secondaryResponse}
        onRestart={() => {
          setMaintenanceScroll(0)
          setBriefingDismissed(false)
          setWorkstationFocused(false)
          setMaintenanceInspection(null)
          setLocationTransition(null)
          setIncidentExpanded(false)
          elapsedActiveMs.current = 0
          setInterruptedPoint(null)
          setPinOptions([])
          setReturnScrollOffset(null)
          setWorkstationDetailOpen(false)
          setStorageDetailOpen(false)
          setHintOpen(false)
          window.scrollTo({ top: 0, behavior: 'auto' })
          dispatch({ type: 'RESET' })
        }}
      />
    )
  })()
  const isMaintenanceRoom =
    state.scene === 'maintenance' && !workstationFocused && !maintenanceInspection
  const showBriefing = isMaintenanceRoom && !briefingDismissed

  // The saved cue is actionable from the Incident Hub, not an overlay that follows
  // the player into Storage, Power, or an evidence inspection.
  const canResumePin =
    Boolean(state.quickPin) &&
    state.secondaryTaskComplete &&
    state.scene === 'hub'

  return (
    <main className="game-root">
      <div
        className="game-stage"
        data-testid="game-stage"
        style={{
          '--ui-frame-cyan': `url("${YOKO_PACK_ASSETS.uiFrameCyan}")`,
          '--ui-frame-amber': `url("${YOKO_PACK_ASSETS.uiFrameAmber}")`,
          '--ui-button-neutral': `url("${YOKO_PACK_ASSETS.uiButtonNeutral}")`,
          '--ui-button-cyan': `url("${YOKO_PACK_ASSETS.uiButtonCyan}")`,
          '--ui-panel-cyan-small': `url("${YOKO_PACK_ASSETS.uiPanelCyanSmall}")`,
        } as CSSProperties}
      >
        <div className="runtime-asset-preload" aria-hidden="true">
          <img src={YOKO_PACK_ASSETS.hubBackground} alt="" />
          <img src={YOKO_PACK_ASSETS.storageCrateClosed} alt="" />
          <img src={YOKO_PACK_ASSETS.storageCrateOpen} alt="" />
          <img src={YOKO_PACK_ASSETS.storageCouplerInspection} alt="" />
          <img src={YOKO_PACK_ASSETS.storageSerialDetail} alt="" />
          <img src={MAINTENANCE_ASSETS.focusedWorkbench} alt="" />
          <img src={MAINTENANCE_ASSETS.focusedJunction} alt="" />
        </div>

        {scene}

        {state.scene !== 'storage' && !showBriefing && (
          <ObjectiveTracker
            objective={objective}
            onOpenBriefing={isMaintenanceRoom ? () => setBriefingDismissed(false) : undefined}
            onModalChange={setHintOpen}
          />
        )}

        <StatusRail
          state={state}
          location={currentLocation}
          storageLeadUnlocked={storageLeadUnlocked}
          storageSerialChecked={serialChecked}
          canResumePin={canResumePin}
          onResumePin={resumeSavedPin}
          onReviewPin={() => dispatch({ type: 'REVIEW_PIN' })}
        />

        {locationTransition && (
          <div className="location-transition" data-testid="location-transition" role="status" aria-live="polite">
            <span>NAVIGATION</span>
            <strong>{locationTransition}</strong>
          </div>
        )}

        {state.interruptionStatus === 'warning' && state.scene !== 'secondary' && (
          incidentExpanded && !showBriefing ? (
            <IncomingInterruption
              pinned={Boolean(state.quickPin)}
              options={pinOptions}
              onPin={saveSelectedPin}
              onHandle={handleIncident}
              onMinimize={() => setIncidentExpanded(false)}
            />
          ) : (
            <PendingIncidentTab onOpen={() => {
              setBriefingDismissed(true)
              setIncidentExpanded(true)
            }} />
          )
        )}

        {showBriefing && (
          <CaseBriefDialog
            onExplore={() => setBriefingDismissed(true)}
            onWorkstation={() => {
              setBriefingDismissed(true)
              setMaintenanceInspection(null)
              setWorkstationFocused(true)
            }}
          />
        )}
      </div>
    </main>
  )
}
