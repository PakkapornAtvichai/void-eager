const asset = (name: string) =>
  new URL(
    `../../assets/incoming-yoko/Void-Eager-20261002T200218Z-1-001/Void-Eager/${name}`,
    import.meta.url,
  ).href

export const MAINTENANCE_ASSETS = {
  background: asset('Background_Maintenance.png'),
  clickWorkbench: asset('Click_Workbench.png'),
  clickWorkstation: asset('Click_Workstation.png'),
  clickJunction: asset('Click_Junction.png'),
  focusedWorkstation: asset('Focused_Workstation.png'),
  focusedWorkbench: asset('Focused_Workbench.png'),
  focusedJunction: asset('Focused_Junction.png'),
  workstationNavigation: asset('Panel_Workstation_Navigation _ source _ subsystem menu.png'),
  workstationPrimary: asset('Panel_Workstation_Primary readable evidence panel.png'),
  workstationTechnical: asset('Panel_Workstation_Technical status _ mini timeline _ quick summary.png'),
} as const

export type HotspotBounds = {
  left: number
  top: number
  width: number
  height: number
}

export const HOTSPOT_BOUNDS = {
  workbench: { left: 0, top: 296, width: 517, height: 527 },
  workstation: { left: 636, top: 399, width: 663, height: 371 },
  junction: { left: 1414, top: 233, width: 506, height: 559 },
} as const satisfies Record<string, HotspotBounds>
