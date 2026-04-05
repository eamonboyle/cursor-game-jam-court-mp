# Implementation status — Court of Public Opinion

**Single snapshot for “where we are.”** Checkboxes for work items live **only** in `docs/*_execution_checklist.md`. This file holds the current focus, links, and session handoff.

---

## Status snapshot


| Field                    | Value                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project**              | Court of Public Opinion                                                                                                                                                                                   |
| **Active track**         | Vision Phase 5 milestones + gameplay loop checklist ([`docs/02_core_gameplay_loop_execution_checklist.md`](docs/02_core_gameplay_loop_execution_checklist.md)).                                      |
| **Current phase / step** | **Milestone C** complete; **next: Milestone D** — Prosecutor/Defense cards + evidence actions.                                                                                                             |
| **Next action**          | Follow [`docs/production_sequencing.md`](docs/production_sequencing.md); gameplay Phase 2+ or Vision **Ticket 5** (card panel) as appropriate.                                                             |


**Blockers:** none.

---

## Documentation index


| Design doc                                                               | Execution checklist                                                                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `[docs/01_game_vision.md](docs/01_game_vision.md)`                       | `[docs/01_game_vision_execution_checklist.md](docs/01_game_vision_execution_checklist.md)`                       |
| `[docs/02_core_gameplay_loop.md](docs/02_core_gameplay_loop.md)`         | `[docs/02_core_gameplay_loop_execution_checklist.md](docs/02_core_gameplay_loop_execution_checklist.md)`         |
| `[docs/03_roles_and_rules.md](docs/03_roles_and_rules.md)`               | `[docs/03_roles_rules_execution_checklist.md](docs/03_roles_rules_execution_checklist.md)`                       |
| `[docs/04_technical_architecture.md](docs/04_technical_architecture.md)` | `[docs/04_technical_architecture_execution_checklist.md](docs/04_technical_architecture_execution_checklist.md)` |


Supporting docs: [`docs/project-rules.md`](docs/project-rules.md), [`docs/repo_layout.md`](docs/repo_layout.md), [`docs/mvp-scope.md`](docs/mvp-scope.md), [`docs/art_direction_and_assets.md`](docs/art_direction_and_assets.md), [`docs/production_sequencing.md`](docs/production_sequencing.md). Human/agent contract: [`AGENTS.md`](AGENTS.md).

### Dual-track note

**Vision** phases (bootstrap, MVP lock, sequencing) and **technical architecture** phases (frontend shell, rendering, etc.) will overlap once coding starts. Each session MUST name the **driving** checklist in the snapshot (e.g. “Vision Phase 1, Step 3” vs “Tech arch Phase 1, Step 4”) so work does not fork silently.

---

## How to update this file

1. **First** toggle the relevant checkbox(es) on the correct `docs/*_execution_checklist.md`.
2. **Then** update the **Status snapshot** table (phase, step ID, next action, blockers).
3. **Finally** append a **Session log** entry below (date, done, next, decisions).

Do **not** paste full checklists into this file.

---

## Session log (newest first)

### Template (copy for new entries)

```
### YYYY-MM-DD — short title
- **Done:** …
- **Next:** …
- **Blockers / decisions:** …
```

### 2026-04-06 — Milestone C trial state machine + debug

- **Done:** `MatchState`, `TurnTimer`, `phaseTransitions` + Vitest tests, `MatchController` (] legal, [ \\ dev cycle, console logs), UI trial panel, HUD + camera refresh on visual sync; Gameplay loop Phase 1 checklist complete; Milestone C + Ticket 4; removed unused `session` stub.
- **Next:** Milestone D / card + evidence UI and actions.
- **Blockers / decisions:** none.

### 2026-04-06 — Milestone B courtroom + Tech arch Phase 2

- **Done:** Modular rendering (`rendererBootstrap`, placeholder courtroom props/walls, `CourtroomSceneState`, cinematic presets, seat anchors, role capsules); HUD + keys **1–6** camera presets / **0** auto; Milestone B + Tech Phase 2 + suggested Ticket 3 marked complete; [`docs/repo_layout.md`](docs/repo_layout.md) table updated.
- **Next:** Milestone C — local trial flow + debug phase controller ([`docs/02_core_gameplay_loop_execution_checklist.md`](docs/02_core_gameplay_loop_execution_checklist.md) Phase 1).
- **Blockers / decisions:** none.

### 2026-04-06 — Vision Phase 4 production sequencing

- **Done:** Added [`docs/production_sequencing.md`](docs/production_sequencing.md) (canonical build order, rationale, milestone mapping, dependency diagram); Vision Phase 4 checklist steps 1–10 marked complete.
- **Next:** **Milestone B** + technical roadmap (courtroom placeholders — Tech arch Phase 2 rendering tasks).
- **Blockers / decisions:** none.

### 2026-04-06 — Vision Phase 3 art direction and assets

- **Done:** Added `[docs/art_direction_and_assets.md](docs/art_direction_and_assets.md)` (scene/character/UI/SFX lists, PS1 rules, rig spec, texture rules, props, must-have vs nice-to-have board); Vision Phase 3 checklist steps 1–10 marked complete.
- **Next:** Vision Phase 4 — production sequencing (see checklist); optional: capture order in a short repo doc.
- **Blockers / decisions:** none.

### 2026-04-06 — Vision Phase 2 MVP scope lock

- **Done:** Added `[docs/mvp-scope.md](docs/mvp-scope.md)` (MVP statement, locked decisions, content targets, not-in-MVP, freeze rule); Vision Phase 2 checklist steps 1–10 marked complete in `[docs/01_game_vision_execution_checklist.md](docs/01_game_vision_execution_checklist.md)`.
- **Next:** Vision Phase 3, Step 1 — courtroom art asset list (and rest of Phase 3 per checklist).
- **Blockers / decisions:** none.

### 2026-04-05 — Vision Phase 1 bootstrap (Vite + Three.js shell)

- **Done:** Vite + strict TypeScript, Three.js, ESLint/Prettier, `src/{app,rendering,ui,game,data,audio,debug}`, `AppRoot`, canvas + UI + debug HUD, resize handler, minimal lit scene, global error handlers; Vision Phase 1 and Technical Phase 1 checklists marked complete; `[docs/repo_layout.md](docs/repo_layout.md)` updated with file ownership; README run commands.
- **Next:** Vision Phase 2, Step 1 — `[docs/mvp-scope.md](docs/mvp-scope.md)`.
- **Blockers / decisions:** `@types/three` added as devDependency (Three npm package lacks `types` entry for this toolchain).

### 2026-04-04 — Phase 0 repo framing

- **Done:** Added `docs/project-rules.md`, `docs/repo_layout.md`, `data/` and `public/` placeholders, root `README.md`, `TODO_IMPLEMENTATION.md`, `AGENTS.md`, `.cursor/rules/court-of-public-opinion.mdc`; marked Vision Phase 0 checklist items complete.
- **Next:** Vision Phase 1, Step 1 — Vite + TypeScript project init.
- **Blockers / decisions:** none.

