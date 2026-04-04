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

`src/main.ts` (or equivalent) remains the Vite entry once the project is initialized.

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
- **TypeScript symbols** — `PascalCase` for types/classes, `camelCase` for values and functions; filename `kebab-case` or `camelCase` — pick one when bootstrap lands and stay consistent.
- **Scene files** — one primary courtroom scene for MVP; name with domain prefix, e.g. `courtroom_main` (implementation detail: module or glTF basename).
- **UI panels** — match role or feature: `panel-prosecution`, `panel-defense`, `panel-jury-verdict` (kebab-case in DOM IDs and CSS where used).
- **Gameplay systems** — one module per system (`MatchPhaseController`, `EvidenceDeck`, etc.); avoid vague names like `manager.ts` without a domain.

Update this document if conventions change; mention the change in [`TODO_IMPLEMENTATION.md`](../TODO_IMPLEMENTATION.md) session log.
