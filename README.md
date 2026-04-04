# Court of Public Opinion

Browser-based multiplayer courtroom party game: fast, theatrical trials with structured evidence, objections, and jury verdicts—retro PS1-style presentation.

## MVP in brief

- **Session length:** about 8–12 minutes per trial (see [`docs/01_game_vision.md`](docs/01_game_vision.md)).
- **Focus:** one stable courtroom, deterministic data-driven cases, AI-filled empty seats, desktop browser first.
- **Design and implementation tracking:** [`docs/`](docs/) for specs; [`TODO_IMPLEMENTATION.md`](TODO_IMPLEMENTATION.md) for current status; **[`AGENTS.md`](AGENTS.md)** for mandatory AI/human workflow.

## Stack (target)

- **Vite** + **TypeScript**
- **Three.js** for 3D
- **HTML/CSS** UI overlay
- Room architecture compatible with **Colyseus** (or equivalent authoritative server) when multiplayer ships

## Local development

**Not yet bootstrapped.** Run commands (`npm install`, `npm run dev`, etc.) will be added in **Vision Phase 1** per [`docs/01_game_vision_execution_checklist.md`](docs/01_game_vision_execution_checklist.md). Until then, this repo is design + repo framing only.

## Contributing / agents

Read **[`AGENTS.md`](AGENTS.md)** before writing implementation code. Progress lives in execution checklists under `docs/`, not in duplicate lists.
