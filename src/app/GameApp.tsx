import { useReducer } from 'react'
import { MaintenanceScene } from '../components/MaintenanceScene'
import { InterruptionModal } from '../components/InterruptionModal'
import { SecondaryScene } from '../components/SecondaryScene'
import { StatusRail } from '../components/StatusRail'
import { initialGameState, gameReducer } from '../game/state'

export function GameApp() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const recordOpened = state.evidenceFound.includes('MAI_COUPLER_REPLACEMENT_RECORD')

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><p className="eyebrow">VOID-EAGER</p><h1>Incident Review</h1></div>
        <span className="prototype-badge">3-DAY PROTOTYPE</span>
      </header>
      <div className="workspace">
        <StatusRail state={state} />
        {state.scene === 'maintenance'
          ? <MaintenanceScene opened={recordOpened} onOpen={() => dispatch({ type: 'OPEN_WORK_ORDER' })} />
          : <SecondaryScene quickPin={state.quickPin} />}
      </div>
      {state.interruption && <InterruptionModal interruption={state.interruption}
        onPinAndOpen={() => dispatch({ type: 'PIN_AND_OPEN_INTERRUPTION' })}
        onOpen={() => dispatch({ type: 'OPEN_INTERRUPTION' })} />}
    </main>
  )
}
