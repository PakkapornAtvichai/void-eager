import { useState } from 'react'
import type { CSSProperties } from 'react'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'

export type MaintenanceInspectionArea = 'workbench' | 'junction'

type Props = {
  area: MaintenanceInspectionArea
  onBack: () => void
  onWorkstation: () => void
}

type InspectionTarget = {
  id: string
  label: string
  observation: string
  bounds: { left: number; top: number; width: number; height: number }
}

const INSPECTIONS: Record<MaintenanceInspectionArea, {
  title: string
  description: string
  image: string
  imageAlt: string
  targets: InspectionTarget[]
}> = {
  workbench: {
    title: 'Maintenance Workbench',
    description: 'Glint has left handwritten service notes and parts sketches on the bench. Choose an area to examine.',
    image: MAINTENANCE_ASSETS.focusedWorkbench,
    imageAlt: 'Close view of the maintenance workbench with a handwritten checklist and sketches of coupler parts',
    targets: [
      {
        id: 'checklist',
        label: 'Service checklist',
        observation: 'The handwritten checklist names routine checks, including junction and calibration work. There is also a reminder to update the maintenance log. These notes are not an installation verification.',
        bounds: { left: 170, top: 395, width: 420, height: 415 },
      },
      {
        id: 'spare',
        label: 'Spare-part sketch',
        observation: 'A sketch is marked "Spare?" and "Check stock." It suggests checking the replacement part, but does not establish whether the coupler was installed.',
        bounds: { left: 1160, top: 720, width: 325, height: 250 },
      },
    ],
  },
  junction: {
    title: 'Junction Access',
    description: 'Service panels and a local readout line this wall. Inspect them before deciding whether they help with the Coupler question.',
    image: MAINTENANCE_ASSETS.focusedJunction,
    imageAlt: 'Close view of the maintenance junction with a small blue system display and a closed electrical service panel',
    targets: [
      {
        id: 'display',
        label: 'Local status display',
        observation: 'The local display is active, but the visible readout does not show a replacement-part serial. It cannot independently verify the work order.',
        bounds: { left: 385, top: 345, width: 265, height: 360 },
      },
      {
        id: 'cover',
        label: 'Service enclosure',
        observation: 'This is an enclosed electrical service panel. Its exterior alone cannot establish whether the Guidance Stabilizer Coupler was replaced. The formal work order and physical stock need to be compared.',
        bounds: { left: 1360, top: 270, width: 320, height: 550 },
      },
    ],
  },
}

const boundsStyle = (bounds: InspectionTarget['bounds']): CSSProperties => ({
  left: `${(bounds.left / 1920) * 100}%`,
  top: `${(bounds.top / 1080) * 100}%`,
  width: `${(bounds.width / 1920) * 100}%`,
  height: `${(bounds.height / 1080) * 100}%`,
})

export function MaintenanceInspectionScene({ area, onBack, onWorkstation }: Props) {
  const inspection = INSPECTIONS[area]
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = inspection.targets.find((target) => target.id === selectedId)

  return (
    <section className="maintenance-stage maintenance-inspection-stage" data-testid={`maintenance-inspection-${area}`} aria-label={inspection.title}>
      <div className="maintenance-canvas">
        <img className="maintenance-layer maintenance-layer--base" src={inspection.image} alt={inspection.imageAlt} />

        {inspection.targets.map((target) => (
          <button
            key={target.id}
            type="button"
            className={`inspection-hotspot ${selectedId === target.id ? 'is-selected' : ''}`}
            style={boundsStyle(target.bounds)}
            data-testid={`inspect-${area}-${target.id}`}
            aria-label={`Examine ${target.label}`}
            aria-pressed={selectedId === target.id}
            onClick={() => setSelectedId(target.id)}
          >
            <span>{target.label}</span>
          </button>
        ))}

        <nav className="inspection-room-navigation" aria-label="Maintenance location navigation">
          <button className="navigation-button" type="button" data-testid="inspection-back-to-room" onClick={onBack}>
            ← BACK // MAINTENANCE
          </button>
          <button className="navigation-button" type="button" data-testid="inspection-to-workstation" onClick={onWorkstation}>
            OPEN WORKSTATION // RECORD
          </button>
        </nav>

        <aside className="inspection-observation-panel" aria-label="Inspection observations">
          <span className="inspection-panel-kicker">MAINTENANCE // VISUAL INSPECTION</span>
          <h2>{inspection.title}</h2>
          <p>{inspection.description}</p>
          <div className="inspection-observation-options" aria-label="Choose an inspection point">
            {inspection.targets.map((target) => (
              <button
                type="button"
                key={target.id}
                data-testid={`inspection-option-${target.id}`}
                aria-pressed={selectedId === target.id}
                className={selectedId === target.id ? 'is-selected' : ''}
                onClick={() => setSelectedId(target.id)}
              >
                {target.label}
              </button>
            ))}
          </div>
          <div className="inspection-observation-result" role="status" aria-live="polite" data-testid="inspection-result">
            {selected ? (
              <>
                <strong>{selected.label}</strong>
                <p>{selected.observation}</p>
              </>
            ) : (
              <p>Select a detail on the image or use the inspection buttons above.</p>
            )}
          </div>
          <small>Field observation only. The formal replacement record is at the Workstation.</small>
        </aside>
      </div>
    </section>
  )
}
