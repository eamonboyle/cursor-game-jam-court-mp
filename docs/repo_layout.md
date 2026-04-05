# Repository layout

Planned structure before and during bootstrap (Vite + TypeScript). Aligns with technical architecture Phase 1 folder ownership.

## `/src` (application code)

Planned top-level folders:

| Path | Responsibility |
|------|----------------|
| `src/app` | App bootstrap, lifecycle, composition root |
| `src/rendering` | Three.js renderer, scenes, cameras, loop |
| `src/ui` | HTML/CSS overlay, HUD, panels |
| `src/game` | Match state, rules, actions, trial phases |
| `src/net` | Room protocol + browser WebSocket client (Milestone H) |
| `src/server` | Dev-only authoritative room host (Node `ws`) |
| `src/data` | Loaders, validation against JSON schemas |
| `src/audio` | Music and one-shot hooks |
| `src/debug` | Dev panels, inspectors, logging helpers |

`src/main.ts` is the Vite entry (imports global CSS and calls `createApp()` from `src/app/bootstrap.ts`).

### File ownership (Vision Phase 1 bootstrap)

| Location | Responsibility |
|----------|----------------|
| [`src/main.ts`](../src/main.ts) | Application entry only: CSS import + `createApp().start()`. |
| [`src/style.css`](../src/style.css) | Full-viewport layout: `#canvas`, `#ui-root`, `#debug-root`. |
| [`src/app/bootstrap.ts`](../src/app/bootstrap.ts) | `createApp()` — installs global error handlers, returns `AppRoot`. |
| [`src/app/AppRoot.ts`](../src/app/AppRoot.ts) | Wires `MatchController`, `RoomClient`, Three.js stage, overlay (`mountUiOverlay` + `wsUrl` / `?room=`), and debug HUD. |
| [`src/app/installGlobalErrorHandlers.ts`](../src/app/installGlobalErrorHandlers.ts) | Fail-safe `error` / `unhandledrejection` console logging. |
| [`src/rendering/stage.ts`](../src/rendering/stage.ts) | Composes renderer, courtroom placeholder scene, cinematic cameras, loop, dev hotkeys. |
| [`src/rendering/rendererBootstrap.ts`](../src/rendering/rendererBootstrap.ts) | WebGL renderer factory (color space, DPR). |
| [`src/rendering/courtroom/buildCourtroomPlaceholder.ts`](../src/rendering/courtroom/buildCourtroomPlaceholder.ts) | PS1-style labeled prop/floor/wall placeholders. |
| [`src/rendering/camera/cinematicPresets.ts`](../src/rendering/camera/cinematicPresets.ts) | Named fixed camera positions for the single courtroom. |
| [`src/rendering/seats/roleAnchors.ts`](../src/rendering/seats/roleAnchors.ts) | In-scene anchors for judge, counsel, witness, jury, defendant. |
| [`src/rendering/characters/roleCapsules.ts`](../src/rendering/characters/roleCapsules.ts) | Colored capsule stand-ins before authored characters. |
| [`src/rendering/courtroomSceneState.ts`](../src/rendering/courtroomSceneState.ts) | Trial `phase` + `activeSpeaker` → cinematic camera preset. |
| [`src/ui/overlay.ts`](../src/ui/overlay.ts) | UI shell + live trial readout bound to `MatchController`. |
| [`src/debug/hud.ts`](../src/debug/hud.ts) | Combined Three.js + trial debug HUD. |
| [`src/game/trialPhase.ts`](../src/game/trialPhase.ts) | Canonical `TrialPhase` union + ordering. |
| [`src/game/roles.ts`](../src/game/roles.ts) | `ActiveRole` for who may speak / highlight. |
| [`src/game/matchState.ts`](../src/game/matchState.ts) | `MatchState` model + initial factory. |
| [`src/game/turnTimer.ts`](../src/game/turnTimer.ts) | Turn timer with pause / resume / expire ticks. |
| [`src/game/phaseTransitions.ts`](../src/game/phaseTransitions.ts) | Allowed-edge map + `applyPhaseTransition`. |
| [`src/game/matchCore.ts`](../src/game/matchCore.ts) | Authoritative trial simulation: timers, phase transitions, counsel/judge/jury actions, AI seat fill (shared by client shell and room server, Milestone H). |
| [`src/game/matchController.ts`](../src/game/matchController.ts) | Browser shell: RAF loop (paused in network client mode), dev keys / network key forward, visual sync, `hydrateFromNetwork`. |
| [`src/net/roomProtocol.ts`](../src/net/roomProtocol.ts) | Room player public view, client/server messages, command validation, role assignment. |
| [`src/net/roomClient.ts`](../src/net/roomClient.ts) | Browser WebSocket client for the local room host. |
| [`src/server/roomHost.ts`](../src/server/roomHost.ts) | Node `ws` authoritative room server (`npm run room-server`; `ROOM_PORT` or default `8787`). |
| [`src/game/counsel.ts`](../src/game/counsel.ts) | `CounselSide`, stub card/evidence definitions (Milestone D). |
| [`src/game/judgeRulings.ts`](../src/game/judgeRulings.ts) | Bounded judge ruling IDs + `tryAppendJudgeRuling` (Milestone E). |
| [`src/game/judgeRulings.test.ts`](../src/game/judgeRulings.test.ts) | Vitest for objection-only rulings palette. |
| [`src/game/jury.ts`](../src/game/jury.ts) | Stub jury poll, `tryCastJuryVote`, verdict resolution (Milestone F). |
| [`src/game/jury.test.ts`](../src/game/jury.test.ts) | Vitest for jury votes and majority / hung rules. |
| [`src/game/seatFill.ts`](../src/game/seatFill.ts) | Human vs AI per seat; jam solo preset (Milestone G). |
| [`src/game/ai/seatBehavior.ts`](../src/game/ai/seatBehavior.ts) | Deterministic AI picks for votes, rulings, counsel stubs. |
| [`src/game/ai/seatBehavior.test.ts`](../src/game/ai/seatBehavior.test.ts) | Vitest for AI helpers + latch reset. |
| [`src/game/phaseTransitions.test.ts`](../src/game/phaseTransitions.test.ts) | Vitest coverage for transition graph. |
| [`src/data/loaders.ts`](../src/data/loaders.ts) | Placeholder for `/data` JSON load + validation. |
| [`src/audio/audioBus.ts`](../src/audio/audioBus.ts) | Stub audio bus until Web Audio integration. |
| [`index.html`](../index.html) | DOM roots: `#canvas`, `#ui-root`, `#debug-root`. |

## `/data` (authoring-facing JSON and config)

Runtime-loadable **structured content** committed to the repo:

- **Cases** — trial scripts, beats, win/lose conditions
- **Evidence** — evidence definitions and metadata for cards UI
- **Witnesses** — witness profiles and testimony hooks
- **Jurors** — juror archetypes and bias parameters if data-driven
- **Cards** — action/objection/deck definitions
- **Role configs** — seat maps, permissions, AI seat defaults

See [`data/README.md`](../data/README.md) for submodule folders as they are added.

## `/public` (static assets)

Served as-is by Vite’s `public/` root:

- **Textures** — PS1-style materials, UI atlases
- **Fonts** — webfonts for UI
- **Audio** — music, SFX (organized by type)
- **Models** — exported meshes/GLTF (or agreed format)

See [`public/README.md`](../public/README.md) for subfolders as they are added.

## Naming conventions

- **IDs** — `snake_case` for stable content IDs in JSON (e.g. `case_01_opening`, `evidence_screenshot_crop`). Prefix by domain when helpful (`case_`, `ev_`, `wit_`, `jur_`, `card_`).
- **TypeScript filenames** — `camelCase.ts` for modules (e.g. `audioBus.ts`, `installGlobalErrorHandlers.ts`). Classes use `PascalCase` in code (e.g. `AppRoot`).
- **Scene files** — one primary courtroom scene for MVP; name with domain prefix, e.g. `courtroom_main` (implementation detail: module or glTF basename).
- **UI panels** — match role or feature: `panel-prosecution`, `panel-defense`, `panel-jury-verdict` (kebab-case in DOM IDs and CSS where used).
- **Gameplay systems** — one module per system (`MatchPhaseController`, `EvidenceDeck`, etc.); avoid vague names like `manager.ts` without a domain.

Update this document if conventions change; mention the change in [`TODO_IMPLEMENTATION.md`](../TODO_IMPLEMENTATION.md) session log.
