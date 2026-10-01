# Web App Architecture

## Default stack
Use React + TypeScript + Vite unless an existing implementation discovered later gives a stronger reason not to.
No backend for the class prototype.
State remains client-side.

## Architectural rule
Separate engine/state from narrative content so additional puzzle pieces can reuse the same loop.

Suggested modules:
- app/game state
- scene router/state machine
- content/evidence data
- content/interruption data
- Quick Pin
- deduction
- reflection
- lightweight event logging

## Minimum game state
```ts
type GameState = {
  scene: string
  currentThread: string | null
  evidenceFound: string[]
  knowledgeFlags: string[]
  quickPin: QuickPin | null
  interruption: string | null
  secondaryTaskComplete: boolean
  deduction: string | null
}
```

## Constraints
- no server requirement;
- no authentication;
- no database;
- no procedural story;
- no AI dialogue;
- no complex inventory;
- no free-roaming ship simulation.

The browser is a delivery platform, not the design focus.
