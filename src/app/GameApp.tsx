import { useCallback, useEffect, useReducer, useState } from 'react'
import type { CSSProperties } from 'react'
import { DeductionScene } from '../components/DeductionScene'
import { HubScene } from '../components/HubScene'
import { IncomingInterruption } from '../components/IncomingInterruption'
import { MaintenanceScene } from '../components/MaintenanceScene'
import { WorkstationFocusScene } from '../components/WorkstationFocusScene'
import { PowerScene } from '../components/PowerScene'
import { ReflectionScene } from '../components/ReflectionScene'
import { SecondaryScene } from '../components/SecondaryScene'
import { StatusRail } from '../components/StatusRail'
import { StorageScene } from '../components/StorageScene'
import { gameReducer, initialGameState } from '../game/state'
import { YOKO_PACK_ASSETS } from '../content/yokoPackAssets'

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [maintenanceScroll, setMaintenanceScroll] = useState(0)
  const [workstationFocused, setWorkstationFocused] = useState(false)
  const [locationTransition, setLocationTransition] = useState<string | null>(null)

  const recordOpened = state.evidenceFound.includes('MAI_COUPLER_REPLACEMENT_RECORD')
  const storageInspected = state.evidenceFound.includes('STO_NEW_COUPLER')
  const serialChecked = state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')
  const spikeFound = state.evidenceFound.includes('ENG_POWER_SPIKE_LOG')
  const protectionFound = state.evidenceFound.includes('ENG_PROTECTION_ACTIVE_LOG')
  const storageLeadUnlocked = state.knowledgeFlags.includes('K_STORAGE_LEAD_UNLOCKED')

  const startInterruption = useCallback(() => {
    dispatch({ type: 'START_INTERRUPTION' })
  }, [])
  useEffect(() => {
    if (!recordOpened) return
    if (state.scene !== 'maintenance') return
    if (state.interruptionStatus !== 'idle') return
    if (state.secondaryTaskComplete) return

    const timer = window.setTimeout(() => {
      dispatch({ type: 'TRIGGER_INTERRUPTION' })
    }, 12000)

    return () => window.clearTimeout(timer)
  }, [recordOpened, state.scene, state.interruptionStatus, state.secondaryTaskComplete])

  useEffect(() => {
    if (state.scene === 'maintenance' && recordOpened && (state.resumedFromPin || state.firstThreadAfterInterruption !== null)) {
      setWorkstationFocused(true)
    }
    if (state.scene !== 'maintenance') setWorkstationFocused(false)
  }, [recordOpened, state.scene, state.resumedFromPin, state.firstThreadAfterInterruption])

  const followStorageLead = useCallback(() => {
    if (locationTransition) return
    setLocationTransition('STORAGE B-04')
    window.setTimeout(() => {
      dispatch({ type: 'GO_TO_STORAGE' })
      setLocationTransition(null)
    }, 360)
  }, [locationTransition])

  const currentLocation = (() => {
    if (state.scene === 'maintenance') {
      return workstationFocused ? 'MAINTENANCE // WORKSTATION' : 'MAINTENANCE'
    }
    if (state.scene === 'secondary') return 'INCIDENT SYSTEM // C-17'
    if (state.scene === 'hub') return 'INCIDENT BOARD'
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
            postInterruption={state.secondaryTaskComplete}
            restoreScrollOffset={state.resumedFromPin && state.quickPin ? state.quickPin.scrollOffset : null}
            onScrollChange={setMaintenanceScroll}
            storageLeadUnlocked={storageLeadUnlocked}
            onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })}
            onUnlockStorageLead={() => dispatch({ type: 'UNLOCK_STORAGE_LEAD' })}
            onBack={() => setWorkstationFocused(false)}
          />
        ) : (
          <MaintenanceScene onWorkstation={() => setWorkstationFocused(true)} />
        )
      )
    }
    if (state.scene === 'secondary') {
      return (
        <SecondaryScene
          complete={state.secondaryTaskComplete}
          response={state.secondaryResponse}
          onComplete={(response) => dispatch({ type: 'COMPLETE_SECONDARY_TASK', response })}
          onReturn={() => dispatch({ type: 'RETURN_TO_HUB' })}
        />
      )
    }

    if (state.scene === 'hub') {
      return (
        <HubScene
          onCoupler={() => dispatch({ type: 'OPEN_THREAD', thread: 'coupler' })}
          onPower={() => dispatch({ type: 'OPEN_THREAD', thread: 'power' })}
        />
      )
    }

    if (state.scene === 'storage') {
      return (
        <StorageScene
          inspected={storageInspected}
          serialChecked={serialChecked}
          onInspect={() => dispatch({ type: 'INSPECT_STORAGE_COUPLER' })}
          onCheckSerial={() => dispatch({ type: 'CHECK_STORAGE_SERIAL' })}
          onDeduction={() => dispatch({ type: 'OPEN_DEDUCTION' })}
          onBack={() => dispatch({ type: 'BACK_TO_HUB' })}
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
          onBack={() => dispatch({ type: 'BACK_TO_HUB' })}
        />
      )
    }

    if (state.scene === 'deduction') {
      return (
        <DeductionScene
          theory={state.theory}
          theoryEvidence={state.theoryEvidence}
          onSave={(answer, evidence) => dispatch({ type: 'SAVE_THEORY', answer, evidence })}
          onReflection={() => dispatch({ type: 'OPEN_REFLECTION' })}
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
          setLocationTransition(null)
          window.scrollTo({ top: 0, behavior: 'auto' })
          dispatch({ type: 'RESET' })
        }}
      />
    )
  })()
  const canResumePin =
    Boolean(state.quickPin) &&
    state.secondaryTaskComplete &&
    state.scene !== 'secondary' &&
    state.scene !== 'reflection'

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
        {scene}

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
          onResumePin={() => dispatch({ type: 'RESUME_PIN' })}
        />

        {locationTransition && (
          <div className="location-transition" data-testid="location-transition" role="status" aria-live="polite">
            <span>NAVIGATION</span>
            <strong>{locationTransition}</strong>
          </div>
        )}

        {state.interruptionStatus === 'warning' && state.scene === 'maintenance' && (
          <IncomingInterruption
            pinned={Boolean(state.quickPin)}
            onPin={() => dispatch({ type: 'PIN_CURRENT_CONTEXT', scrollOffset: maintenanceScroll })}
            onHandle={startInterruption}
          />
        )}
      </div>
    </main>
  )
}
