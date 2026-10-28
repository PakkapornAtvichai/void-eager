import { MaintenanceRoomScene } from './MaintenanceRoomScene'

type Props = {
  onWorkstation: () => void
  briefingVisible: boolean
  onDismissBriefing: () => void
  hubAvailable: boolean
  onHub: () => void
}

export function MaintenanceScene({ onWorkstation, briefingVisible, onDismissBriefing, hubAvailable, onHub }: Props) {
  return (
    <MaintenanceRoomScene
      onWorkstation={onWorkstation}
      briefingVisible={briefingVisible}
      onDismissBriefing={onDismissBriefing}
      hubAvailable={hubAvailable}
      onHub={onHub}
    />
  )
}
