import { useCallback, useEffect, useReducer, useState } from 'react'
import type { CSSProperties } from 'react'
import { DeductionScene } from '../components/DeductionScene'
import { HubScene } from '../components/HubScene'
import { IncomingInterruption, PendingIncidentTab } from '../components/IncomingInterruption'
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
import { currentObjective } from '../game/objectives'
import { StorageScene } from '../components/StorageScene'
import { gameReducer, initialGameState } from '../game/state'
import type { GameAction } from '../game/state'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [maintenanceScroll, setMaintenanceScroll] = useState(0)
  const [workstationFocused, setWorkstationFocused] = useState(false)
  const [maintenanceInspection, setMaintenanceInspection] = useState<MaintenanceInspectionArea | null>(null)
  const [briefingDismissed, setBriefingDismissed] = useState(false)
  const [locationTransition, setLocationTransition] = useState<string | null>(null)
  const [incidentExpanded, setIncidentExpanded] = useState(false)

  const recordOpened = state.evidenceFound.includes('MAI_COUPLER_REPLACEMENT_RECORD')
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

  // An unresolved alert persists when the player leaves the report.
  useEffect(() => {
    setIncidentExpanded(state.interruptionStatus === 'warning')
  }, [state.interruptionStatus])
  useEffect(() => {
    if (!recordOpened) return
    if (state.scene !== 'maintenance' || !workstationFocused) return
    if (state.interruptionStatus !== 'idle') return
    if (state.secondaryTaskComplete) return

    const timer = window.setTimeout(() => {
      dispatch({ type: 'TRIGGER_INTERRUPTION' })
    }, 12000)

    return () => window.clearTimeout(timer)
  }, [recordOpened, workstationFocused, state.scene, state.interruptionStatus, state.secondaryTaskComplete])

  useEffect(() => {
    if (state.scene === 'maintenance' && recordOpened && (state.resumedFromPin || state.firstThreadAfterInterruption !== null)) {
      setWorkstationFocused(true)
      setMaintenanceInspection(null)
    }
    if (state.scene !== 'maintenance') {
      setWorkstationFocused(false)
      setMaintenanceInspection(null)
    }
  }, [recordOpened, state.scene, state.resumedFromPin, state.firstThreadAfterInterruption])

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

  const followStorageLead = useCallback(() => {
    navigateTo('STORAGE // B-04', { type: 'GO_TO_STORAGE' })
  }, [navigateTo])

  const handleIncident = useCallback(() => {
    setIncidentExpanded(false)
    if (state.scene !== 'maintenance' || !workstationFocused) {
      navigateTo('INCIDENT SYSTEM // C-17', { type: 'START_INTERRUPTION' })
      return
    }
    dispatch({ type: 'START_INTERRUPTION' })
  }, [state.scene, workstationFocused, navigateTo])

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
            restoreScrollOffset={state.resumedFromPin && state.quickPin ? state.quickPin.scrollOffset : null}
            onScrollChange={setMaintenanceScroll}
            storageLeadUnlocked={storageLeadUnlocked}
            observedFields={state.observedWorkOrderFields}
            activeIntention={state.activeIntention}
            onObserveField={(field) => dispatch({ type: 'OBSERVE_WORK_ORDER_FIELD', field })}
            onSetIntention={(intention) => dispatch({ type: 'SET_WORKING_INTENTION', intention })}
            onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })}
            onUnlockStorageLead={() => dispatch({ type: 'UNLOCK_STORAGE_LEAD' })}
            onBack={() => setWorkstationFocused(false)}
          />
        ) : maintenanceInspection ? (
          <MaintenanceInspectionScene
            area={maintenanceInspection}
            onBack={() => setMaintenanceInspection(null)}
          />
        ) : (
          <MaintenanceScene
            briefingVisible={!briefingDismissed && !state.secondaryTaskComplete}
            onDismissBriefing={() => setBriefingDismissed(true)}
            onWorkstation={() => {
              setBriefingDismissed(true)
              setMaintenanceInspection(null)
              setWorkstationFocused(true)
            }}
            onInspect={(area) => {
              setBriefingDismissed(true)
              setMaintenanceInspection(area)
            }}
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
          onComplete={(response) => dispatch({ type: 'COMPLETE_SECONDARY_TASK', response })}
          onReturn={() => navigateTo('INCIDENT HUB', { type: 'RETURN_TO_HUB' })}
        />
      )
    }

    if (state.scene === 'hub') {
      return (
        <HubScene
          storageLeadUnlocked={storageLeadUnlocked}
          recordOpened={recordOpened}
          serialChecked={serialChecked}
          powerReviewed={protectionFound}
          theorySaved={Boolean(state.theory)}
          onCoupler={() => {
            setWorkstationFocused(true)
            navigateTo('MAINTENANCE // WORKSTATION', { type: 'OPEN_THREAD', thread: 'coupler' })
          }}
          onStorage={() => navigateTo('STORAGE // B-04', { type: 'GO_TO_STORAGE' })}
          onPower={() => navigateTo('ENGINEERING // POWER LOG', { type: 'OPEN_THREAD', thread: 'power' })}
          onCaseReview={() => dispatch({ type: 'OPEN_DEDUCTION' })}
          onEndSession={() => dispatch({ type: 'OPEN_REFLECTION' })}
        />
      )
    }

    if (state.scene === 'storage') {
      return (
        <StorageScene
          inspected={storageInspected}
          serialChecked={serialChecked}
          workOrderSerialObserved={state.observedWorkOrderFields.includes('parts') || state.observedWorkOrderFields.includes('completion')}
          onInspect={() => dispatch({ type: 'INSPECT_STORAGE_COUPLER' })}
          onCheckSerial={() => dispatch({ type: 'CHECK_STORAGE_SERIAL' })}
          onBack={() => navigateTo('INCIDENT HUB', { type: 'BACK_TO_HUB' })}
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
          onSave={(answer, evidence) => dispatch({ type: 'SAVE_THEORY', answer, evidence })}
          onBack={() => dispatch({ type: 'BACK_TO_HUB' })}
        />
      )
    }

    return (
      <ReflectionScene
        usedQuickPin={Boolean(state.quickPin)}
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
          window.scrollTo({ top: 0, behavior: 'auto' })
          dispatch({ type: 'RESET' })
        }}
      />
    )
  })()
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

        {state.scene !== 'storage' && <ObjectiveTracker objective={objective} />}

        <StatusRail
          state={state}
          location={currentLocation}
          storageLeadUnlocked={storageLeadUnlocked}
          storageSerialChecked={serialChecked}
          canFollowStorageLead={
            storageLeadUnlocked &&
            state.scene !== 'secondary' &&
            state.scene !== 'storage' &&
            state.scene !== 'deduction' &&
            state.scene !== 'reflection'
          }
          canResumePin={canResumePin}
          onFollowStorageLead={followStorageLead}
          onResumePin={() => navigateTo('MAINTENANCE // SAVED CONTEXT', { type: 'RESUME_PIN' })}
        />

        {locationTransition && (
          <div className="location-transition" data-testid="location-transition" role="status" aria-live="polite">
            <span>NAVIGATION</span>
            <strong>{locationTransition}</strong>
          </div>
        )}

        {state.interruptionStatus === 'warning' && state.scene !== 'secondary' && (
          incidentExpanded ? (
            <IncomingInterruption
              pinned={Boolean(state.quickPin)}
              onPin={() => dispatch({ type: 'PIN_CURRENT_CONTEXT', scrollOffset: maintenanceScroll })}
              onHandle={handleIncident}
              onMinimize={() => setIncidentExpanded(false)}
            />
          ) : (
            <PendingIncidentTab onOpen={() => setIncidentExpanded(true)} />
          )
        )}
      </div>
    </main>
  )
}
