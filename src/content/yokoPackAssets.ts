const approved = (name: string) =>
  new URL(`../../assets/approved/loop1/${name}`, import.meta.url).href

export const YOKO_PACK_ASSETS = {
  hubBackground: approved('hub_incident_1920x1080.png'),
  uiFrameCyan: approved('ui_frame_cyan_large.png'),
  uiFrameAmber: approved('ui_frame_amber_large.png'),
  uiBadgeCyan: approved('ui_badge_cyan.png'),
  uiButtonNeutral: approved('ui_button_neutral.png'),
  uiButtonCyan: approved('ui_button_cyan.png'),
  uiPanelCyanSmall: approved('ui_panel_cyan_small.png'),
  storageCrateClosed: approved('storage_crate_closed.png'),
  storageCrateOpen: approved('storage_crate_open.png'),
  storageCouplerInspection: approved('storage_coupler_inspection.png'),
  storageSerialDetail: approved('storage_serial_detail.png'),
} as const
