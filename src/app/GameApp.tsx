import { useReducer } from 'react'
import { DeductionScene } from '../components/DeductionScene'
import { InterruptionModal } from '../components/InterruptionModal'
import { MaintenanceScene } from '../components/MaintenanceScene'
import { ReflectionScene } from '../components/ReflectionScene'
import { SecondaryScene } from '../components/SecondaryScene'
import { StatusRail } from '../components/StatusRail'
import { StorageScene } from '../components/StorageScene'
import { gameReducer, initialGameState } from '../game/state'

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  const recordOpened = state.evidenceFound.includes('MAI_COUPLER_REPLACEMENT_RECORD')
  const storageInspected = state.evidenceFound.includes('STO_NEW_COUPLER')
  const serialChecked = state.evidenceFound.includes('STO_NEW_COUPLER_SERIAL')

  const scene = (() => {
    if (state.scene === 'maintenance') {
      return (
        <MaintenanceScene
          opened={recordOpened}
          resumed={state.secondaryTaskComplete}
          quickPin={state.quickPin}
          onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })}
          onStorage={() => dispatch({ type: 'GO_TO_STORAGE' })}
        />
      )
    }

    if (state.scene === 'secondary') {
      return (
        <SecondaryScene
          quickPin={state.quickPin}
          complete={state.secondaryTaskComplete}
          onComplete={() => dispatch({ type: 'COMPLETE_SECONDARY_TASK' })}
          onReturn={() => dispatch({ type: 'RETURN_TO_INVESTIGATION' })}
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
    if (state.scene === 'deduction') {
      return (
        <DeductionScene
          deduction={state.deduction}
          onSubmit={(answer) => dispatch({ type: 'SUBMIT_DEDUCTION', answer })}
          onReflection={() => dispatch({ type: 'OPEN_REFLECTION' })}
        />
      )
    }

    return (
      <ReflectionScene
        usedQuickPin={Boolean(state.quickPin)}
        evidenceCount={state.evidenceFound.length}
        onRestart={() => dispatch({ type: 'RESET' })}
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
        <span className="prototype-badge">3-DAY PROTOTYPE</span>
      </header>
      <div className="workspace">
        <StatusRail state={state} />
        {scene}
      </div>

      {state.interruption && (
        <InterruptionModal
          interruption={state.interruption}
          onPinAndOpen={() => dispatch({ type: 'PIN_AND_OPEN_INTERRUPTION' })}
          onOpen={() => dispatch({ type: 'OPEN_INTERRUPTION' })}
        />
      )}
    </main>
  )
}
