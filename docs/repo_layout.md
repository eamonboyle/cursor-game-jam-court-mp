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
| [`src/app/AppRoot.ts`](../src/app/AppRoot.ts) | Composes Three.js stage, UI overlay, debug HUD, and stub domains. |
| [`src/app/installGlobalErrorHandlers.ts`](../src/app/installGlobalErrorHandlers.ts) | Fail-safe `error` / `unhandledrejection` console logging. |
| [`src/rendering/stage.ts`](../src/rendering/stage.ts) | Renderer, scene, camera, neutral background + smoke-test mesh, resize, animation loop. |
| [`src/ui/overlay.ts`](../src/ui/overlay.ts) | Mounts placeholder overlay markup into `#ui-root`. |
| [`src/debug/hud.ts`](../src/debug/hud.ts) | Live debug readout; returns dispose for `AppRoot`. |
| [`src/game/session.ts`](../src/game/session.ts) | Stub game session until match / trial state exists. |
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
