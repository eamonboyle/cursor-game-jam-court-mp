# Court of Public Opinion

Browser-based multiplayer courtroom party game: fast, theatrical trials with structured evidence, objections, and jury verdicts—retro PS1-style presentation.

## MVP in brief

- **Session length:** about 8–12 minutes per trial (see [`docs/01_game_vision.md`](docs/01_game_vision.md)).
- **Scope:** locked MVP boundaries and content targets in [**`docs/mvp-scope.md`**](docs/mvp-scope.md).
- **Art / audio:** PS1 direction and asset lists in [**`docs/art_direction_and_assets.md`**](docs/art_direction_and_assets.md).
- **Build order:** [**`docs/production_sequencing.md`**](docs/production_sequencing.md) (locked sequencing for implementation).
- **Focus:** one stable courtroom, deterministic data-driven cases, AI-filled empty seats, desktop browser first.
- **Design and implementation tracking:** [`docs/`](docs/) for specs; [`TODO_IMPLEMENTATION.md`](TODO_IMPLEMENTATION.md) for current status; **[`AGENTS.md`](AGENTS.md)** for mandatory AI/human workflow.

## Stack (target)

- **Vite** + **TypeScript**
- **Three.js** for 3D
- **HTML/CSS** UI overlay
- Room architecture compatible with **Colyseus** (or equivalent authoritative server) when multiplayer ships

## Local development

```bash
npm install
npm run dev      # Vite dev server + hot reload
npm run build    # Typecheck + production bundle to dist/
npm run preview  # Serve dist/
npm run lint
npm run typecheck
npm run test      # Vitest (phase transition unit tests)
```

**Milestones A–D** are complete through counsel card + evidence stubs. See [`docs/01_game_vision_execution_checklist.md`](docs/01_game_vision_execution_checklist.md) and [`TODO_IMPLEMENTATION.md`](TODO_IMPLEMENTATION.md). Next: **Milestone E** — judge rulings.

## Contributing / agents

Read **[`AGENTS.md`](AGENTS.md)** before writing implementation code. Progress lives in execution checklists under `docs/`, not in duplicate lists.
