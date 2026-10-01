import type { ThreadId } from '../game/types'

type Props = {
  usedQuickPin: boolean
  evidenceCount: number
  firstThread: ThreadId | null
  theory: 'replaced' | 'not-replaced' | null
  theoryEvidenceCount: number
  secondaryResponse: string | null
  onRestart: () => void
}

const threadLabel = (thread: ThreadId | null) => {
  if (thread === 'coupler') return 'Coupler replacement'
  if (thread === 'power') return 'Power Spike'
  return 'None recorded'
}

const theoryLabel = (theory: Props['theory']) => {
  if (theory === 'replaced') return 'The recorded replacement happened'
  if (theory === 'not-replaced') return 'The recorded replacement did not happen'
  return 'No theory saved'
}
export function ReflectionScene({
  usedQuickPin,
  evidenceCount,
  firstThread,
  theory,
  theoryEvidenceCount,
  secondaryResponse,
  onRestart,
}: Props) {
  return (
    <section className="scene-card" data-testid="reflection-scene" aria-labelledby="reflection-title">
      <p className="eyebrow">POST-INCIDENT // REFLECTION</p>
      <h2 id="reflection-title">You completed the prototype loop.</h2>
      <p className="muted">
        This screen records your process. It does not score task switching or label your theory as right or wrong.
      </p>

      <div className="reflection-summary">
        <span>Interruptions encountered: 1</span>
        <span>Quick Pin used: {usedQuickPin ? 'Yes' : 'No'}</span>
        <span>First thread resumed: {threadLabel(firstThread)}</span>
        <span>Evidence logged: {evidenceCount}</span>
        <span>Incident response: {secondaryResponse ?? 'Not recorded'}</span>
        <span>Final case theory: {theoryLabel(theory)}</span>
        <span>Evidence cited for theory: {theoryEvidenceCount}</span>
      </div>

      <div className="reflection-prompts">
        <p>What helped you remember what you were doing before the interruption?</p>
        <p>Which thread did you choose to return to first, and why?</p>
        <p>Did any later evidence change how you interpreted an earlier clue?</p>
      </div>

      <button className="secondary" data-testid="restart-prototype" onClick={onRestart}>
        Restart prototype
      </button>
    </section>
  )
}
