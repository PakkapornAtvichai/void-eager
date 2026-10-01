type Props = {
  usedQuickPin: boolean
  evidenceCount: number
  onRestart: () => void
}

export function ReflectionScene({ usedQuickPin, evidenceCount, onRestart }: Props) {
  return (
    <section className="scene-card" data-testid="reflection-scene" aria-labelledby="reflection-title">
      <p className="eyebrow">POST-INCIDENT // REFLECTION</p>
      <h2 id="reflection-title">You completed the prototype loop.</h2>
      <p className="muted">
        This screen does not score task switching. It records what happened and asks what supported your return.
      </p>

      <div className="reflection-summary">
        <span>Interruptions encountered: 1</span>
        <span>Quick Pin used: {usedQuickPin ? 'Yes' : 'No'}</span>
        <span>Evidence logged: {evidenceCount}</span>
        <span>Unfinished investigation resumed: Yes</span>
      </div>
      <div className="reflection-prompts">
        <p>What helped you remember what you were checking before the interruption?</p>
        <p>Did the interruption change what you were thinking about?</p>
        <p>What would make returning to the unfinished task easier next time?</p>
      </div>

      <button className="secondary" data-testid="restart-prototype" onClick={onRestart}>
        Restart prototype
      </button>
    </section>
  )
}
