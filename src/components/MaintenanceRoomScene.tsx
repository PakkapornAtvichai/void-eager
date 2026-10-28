import { HOTSPOT_BOUNDS, MAINTENANCE_ASSETS } from '../content/maintenanceAssets'
import { WorldAssetHotspot } from './WorldAssetHotspot'
import type { MaintenanceInspectionArea } from './MaintenanceInspectionScene'

type Props = {
  onWorkstation: () => void
  onInspect: (area: MaintenanceInspectionArea) => void
  briefingVisible: boolean
  onDismissBriefing: () => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceRoomScene({ onWorkstation, onInspect, briefingVisible, onDismissBriefing, hubAvailable, onHub }: Props) {
  return (
    <section className="maintenance-stage" data-testid="maintenance-room" aria-label="Maintenance room">
      <div className="maintenance-canvas">
        <img
          className="maintenance-layer maintenance-layer--base"
          src={MAINTENANCE_ASSETS.background}
          alt="Maintenance room aboard Void-eager"
        />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickWorkbench} alt="" aria-hidden="true" />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickWorkstation} alt="" aria-hidden="true" />
        <img className="maintenance-layer" src={MAINTENANCE_ASSETS.clickJunction} alt="" aria-hidden="true" />

        <WorldAssetHotspot
          label="Open Workstation"
          bounds={HOTSPOT_BOUNDS.workstation}
          testId="workstation-hotspot"
          onActivate={onWorkstation}
        />
        <WorldAssetHotspot
          label="Inspect Workbench"
          bounds={HOTSPOT_BOUNDS.workbench}
          testId="workbench-hotspot"
          onActivate={() => onInspect('workbench')}
        />
        <WorldAssetHotspot
          label="Inspect Junction"
          bounds={HOTSPOT_BOUNDS.junction}
          testId="junction-hotspot"
          onActivate={() => onInspect('junction')}
        />

        {briefingVisible && (
          <aside className="mission-briefing" data-testid="mission-briefing" aria-label="Investigation briefing">
            <span className="mission-briefing__eyebrow">VOID-EAGER // INCIDENT SYSTEMS OFFICE</span>
            <h1>Verify the Coupler</h1>
            <p>Void-eager's stabilizer failed. Glint's log says the Coupler was replaced. Check that claim.</p>
            <p className="mission-briefing__assignment">Start at Workstation. Workbench and Junction are optional.</p>
            <div className="mission-briefing__actions">
              <button type="button" data-testid="begin-coupler-investigation" onClick={onWorkstation}>
                REVIEW WORK ORDER
              </button>
              <button type="button" className="mission-briefing__dismiss" onClick={onDismissBriefing}>
                EXPLORE ROOM
              </button>
            </div>

          </aside>
        )}

        {hubAvailable && (
          <button
            type="button"
            className="maintenance-hub-exit"
            data-testid="maintenance-hub-exit"
            onClick={onHub}
            aria-label="Leave Maintenance and return to the Incident Hub"
          >
            <span>INCIDENT HUB</span>
            <small>EXIT MAINTENANCE</small>
          </button>
        )}
      </div>
    </section>
  )
}
