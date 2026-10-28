import { useState } from 'react'
import type { CSSProperties } from 'react'
import { MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import { EvidenceModal } from './EvidenceModal'

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
    description: 'Inspect Glint\'s service notes and part sketches.',
    image: MAINTENANCE_ASSETS.focusedWorkbench,
    imageAlt: 'Close view of the maintenance workbench with a handwritten checklist and sketches of coupler parts',
    targets: [
      {
        id: 'checklist',
        label: 'Service checklist',
        observation: 'Routine checks and a reminder to update the maintenance log. No installation verification appears here.',
        bounds: { left: 170, top: 395, width: 420, height: 415 },
      },
      {
        id: 'spare',
        label: 'Spare-part sketch',
        observation: 'Handwritten: "Spare?" and "Check stock." A reason to trace the part, but not proof of installation.',
        bounds: { left: 1160, top: 720, width: 325, height: 250 },
      },
    ],
  },
  junction: {
    title: 'Junction Access',
    description: 'Inspect the local status display and closed panel.',
    image: MAINTENANCE_ASSETS.focusedJunction,
    imageAlt: 'Close view of the maintenance junction with a small blue system display and a closed electrical service panel',
    targets: [
      {
        id: 'display',
        label: 'Local status display',
        observation: 'The display is active but shows no replacement serial. It cannot verify the work order.',
        bounds: { left: 385, top: 345, width: 265, height: 360 },
      },
      {
        id: 'cover',
        label: 'Service enclosure',
        observation: 'The panel is closed. Its exterior cannot verify a replacement; compare the work order with physical stock.',
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

        {selected && (
          <EvidenceModal
            title={selected.label}
            kicker={inspection.title.toUpperCase() + ' // VISUAL INSPECTION'}
            testId="inspection-dialog"
            onClose={() => setSelectedId(null)}
          >
            <div data-testid="inspection-result" className="inspection-observation-result">
              <p>{selected.observation}</p>
            </div>
            <small>Observation only. The formal Coupler record is at the Workstation.</small>
          </EvidenceModal>
        )}
      </div>
    </section>
  )
}
