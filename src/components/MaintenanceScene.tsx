import { MaintenanceRoomScene } from './MaintenanceRoomScene'
import type { MaintenanceInspectionArea } from './MaintenanceInspectionScene'

type Props = {
  onWorkstation: () => void
  onInspect: (area: MaintenanceInspectionArea) => void
  briefingVisible: boolean
  onDismissBriefing: () => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceScene({ onWorkstation, onInspect, briefingVisible, onDismissBriefing, hubAvailable, onHub }: Props) {
  return (
    <MaintenanceRoomScene
      onWorkstation={onWorkstation}
      onInspect={onInspect}
      briefingVisible={briefingVisible}
      onDismissBriefing={onDismissBriefing}
      hubAvailable={hubAvailable}
      onHub={onHub}
    />
  )
}
