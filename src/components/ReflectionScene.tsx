import type { ReflectionAnswers, ReflectionKey, ThreadId } from '../game/types'

type Props = {
  usedQuickPin: boolean
  interruptionCount: number
  evidenceCount: number
  firstThread: ThreadId | null
  theory: 'replaced' | 'not-replaced' | null
  theoryEvidenceCount: number
  secondaryResponse: string | null
  answers: ReflectionAnswers
  submitted: boolean
  onAnswer: (key: ReflectionKey, value: string | null) => void
  onSubmit: () => void
  onSkip: () => void
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

const questions: {
  key: ReflectionKey
  title: string
  choices: { value: string; label: string }[]
}[] = [
  {
    key: 'difficulty',
    title: 'How much effort did it take to return to your investigation?',
    choices: [
      { value: 'easy', label: 'Little effort' },
      { value: 'some-effort', label: 'Some effort' },
      { value: 'difficult', label: 'A lot of effort' },
      { value: 'unsure', label: 'Not sure / prefer not to say' },
    ],
  },
  {
    key: 'support',
    title: 'What helped you resume your thinking, if anything?',
    choices: [
      { value: 'pin', label: 'Reading my Quick Pin' },
      { value: 're-read', label: 'Rechecking a source' },
      { value: 'memory', label: 'Remembering my task without a note' },
      { value: 'other', label: 'Another approach' },
      { value: 'unsure', label: 'Not sure / prefer not to say' },
    ],
  },
  {
    key: 'change',
    title: 'Did the interruption change how you approached the case?',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure / prefer not to say' },
    ],
  },
]

export function ReflectionScene({
  usedQuickPin, interruptionCount, evidenceCount,
  firstThread, theory, theoryEvidenceCount, secondaryResponse,
  answers, submitted, onAnswer, onSubmit, onSkip, onRestart,
}: Props) {
  const hasAnyAnswer = Object.values(answers).some((answer) => answer !== null)

  return (
    <section
      className="stage-console-scene reflection-review-scene"
      data-testid="reflection-scene"
      aria-labelledby="reflection-title"
    >
      <div className="case-review-backdrop reflection-backdrop" aria-hidden="true" />
      <div className="stage-console-panel reflection-review-panel">
        <div className="reflection-scroll-area" data-testid="reflection-scroll-area">
          <p className="eyebrow">POST-INCIDENT // PERSONAL REFLECTION</p>
          <h2 id="reflection-title">You completed the prototype loop.</h2>
          <p className="muted">
            These questions are optional. There is no correct response and no ability score.
            Answers remain in this play session and are cleared when you restart.
          </p>

          <div className="reflection-summary" aria-label="Your recorded game actions">
            <span>Interruptions encountered: {interruptionCount}</span>
            <span>Quick Pin used: {usedQuickPin ? 'Yes' : 'No'}</span>
            <span>First thread resumed: {threadLabel(firstThread)}</span>
            <span>Evidence logged: {evidenceCount}</span>
            <span>Incident response: {secondaryResponse ?? 'Not recorded'}</span>
            <span>Final case theory: {theoryLabel(theory)}</span>
            <span>Evidence cited for theory: {theoryEvidenceCount}</span>
          </div>

          <div className="reflection-prompts reflection-question-list" data-testid="reflection-questions">
            {questions.map(({ key, title, choices }, index) => (
              <fieldset className="reflection-question" key={key} data-testid={`reflection-question-${key}`}>
                <legend>{index + 1}. {title}</legend>
                <div className="reflection-options">
                  {choices.map(({ value, label }) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name={`reflection-${key}`}
                        value={value}
                        checked={answers[key] === value}
                        onChange={() => onAnswer(key, value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <div className="reflection-action-footer" data-testid="reflection-action-footer">
          <div className="reflection-footer-feedback" role="status" aria-live="polite">
            {submitted
              ? (hasAnyAnswer
                  ? 'REFLECTION SAVED // This session only. You may change an answer.'
                  : 'QUESTIONS SKIPPED // No responses required.')
              : 'Optional // Answer any questions (scroll for more) or skip.'}
          </div>
          <div className="reflection-footer-buttons">
            <button
              type="button"
              className="primary"
              data-testid="save-reflection"
              onClick={onSubmit}
            >
              SAVE REFLECTION
            </button>
            <button type="button" className="secondary" data-testid="skip-reflection" onClick={onSkip}>
              SKIP QUESTIONS
            </button>
            <button type="button" className="navigation-button" data-testid="restart-prototype" onClick={onRestart}>
              RESTART PROTOTYPE
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
