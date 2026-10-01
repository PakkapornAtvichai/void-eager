import type { QuickPin } from '../game/types'

type Props = {
  quickPin: QuickPin | null
}

export function ResumeCue({ quickPin }: Props) {
  return (
    <div data-testid={quickPin ? 'resume-cue-pinned' : 'resume-cue-unpinned'} className={quickPin ? 'resume-cue pinned' : 'resume-cue'}>
      <p className="eyebrow">{quickPin ? 'QUICK PIN // RESUME CUE' : 'INVESTIGATION RESUMED'}</p>
      {quickPin ? (
        <>
          <strong>{quickPin.thread}</strong>
          <span>Last context: {quickPin.evidenceLabel}</span>
          <span>Location: {quickPin.location}</span>
        </>
      ) : (
        <p>
          You returned without saving a Quick Pin. Reorient from the investigation record and thread list.
        </p>
      )}
    </div>
  )
}
