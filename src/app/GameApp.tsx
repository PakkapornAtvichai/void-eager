import { useCallback, useEffect, useReducer, useState } from 'react'
import { DeductionScene } from '../components/DeductionScene'
import { HubScene } from '../components/HubScene'
import { IncomingInterruption } from '../components/IncomingInterruption'
import { MaintenanceScene } from '../components/MaintenanceScene'
import { PowerScene } from '../components/PowerScene'
import { QuickPinCard } from '../components/QuickPinCard'
import { ReflectionScene } from '../components/ReflectionScene'
import { SecondaryScene } from '../components/SecondaryScene'
import { StatusRail } from '../components/StatusRail'
import { StorageScene } from '../components/StorageScene'
import { gameReducer, initialGameState } from '../game/state'

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const [maintenanceScroll, setMaintenanceScroll] = useState(0)

  const recordOpened = state.evidenceFound.includes('MAI_COUPLER_REPLACEMENT_RECORD')
  const storageInspected = state.evidenceFound.includes('STO_NEW_COUPLER')
  const serialChecked = state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')
  const spikeFound = state.evidenceFound.includes('ENG_POWER_SPIKE_LOG')
  const protectionFound = state.evidenceFound.includes('ENG_PROTECTION_ACTIVE_LOG')

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

  const scene = (() => {
    if (state.scene === 'maintenance') {
      return (
        <MaintenanceScene
          opened={recordOpened}
          postInterruption={state.secondaryTaskComplete}
          restoreScrollOffset={
            state.resumedFromPin && state.quickPin ? state.quickPin.scrollOffset : null
          }
          onScrollChange={setMaintenanceScroll}
          onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })}
          onStorage={() => dispatch({ type: 'GO_TO_STORAGE' })}
        />
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
          window.scrollTo({ top: 0, behavior: 'auto' })
          dispatch({ type: 'RESET' })
        }}
      />
    )
  })()
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">VOID-EAGER</p>
          <h1>Incident Review</h1>
        </div>
        <span className="prototype-badge">ASYNC LOOP V2</span>
      </header>

      <div className="workspace">
        <StatusRail state={state} />
        {scene}
      </div>
      {state.interruptionStatus === 'warning' && state.scene === 'maintenance' && (
        <IncomingInterruption
          pinned={Boolean(state.quickPin)}
          onPin={() => dispatch({ type: 'PIN_CURRENT_CONTEXT', scrollOffset: maintenanceScroll })}
          onHandle={startInterruption}
        />
      )}

      {state.quickPin && (
        <QuickPinCard
          pin={state.quickPin}
          canResume={
            state.secondaryTaskComplete &&
            state.scene !== 'secondary' &&
            state.scene !== 'reflection'
          }
          onResume={() => dispatch({ type: 'RESUME_PIN' })}
        />
      )}
    </main>
  )
}
