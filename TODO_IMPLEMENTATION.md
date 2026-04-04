# Implementation status — Court of Public Opinion

**Single snapshot for “where we are.”** Checkboxes for work items live **only** in `docs/*_execution_checklist.md`. This file holds the current focus, links, and session handoff.

---

## Status snapshot


| Field                    | Value                                                                                                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project**              | Court of Public Opinion                                                                                                                                                                                                                  |
| **Active track**         | Vision checklist (game bootstrap) — *Technical architecture checklist may parallel later; this row names what drives the current pass.*                                                                                                  |
| **Current phase / step** | Phase 0 complete; **next: Vision Phase 1, Step 1** — Initialize a Vite TypeScript project.                                                                                                                                               |
| **Next action**          | Run Vision Phase 1 in `[docs/01_game_vision_execution_checklist.md](docs/01_game_vision_execution_checklist.md)` from Step 1; align `src/` creation with `[docs/repo_layout.md](docs/repo_layout.md)` and technical Phase 1 when coding. |


**Blockers:** none.

---

## Documentation index


| Design doc                                                               | Execution checklist                                                                                              |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `[docs/01_game_vision.md](docs/01_game_vision.md)`                       | `[docs/01_game_vision_execution_checklist.md](docs/01_game_vision_execution_checklist.md)`                       |
| `[docs/02_core_gameplay_loop.md](docs/02_core_gameplay_loop.md)`         | `[docs/02_core_gameplay_loop_execution_checklist.md](docs/02_core_gameplay_loop_execution_checklist.md)`         |
| `[docs/03_roles_and_rules.md](docs/03_roles_and_rules.md)`               | `[docs/03_roles_rules_execution_checklist.md](docs/03_roles_rules_execution_checklist.md)`                       |
| `[docs/04_technical_architecture.md](docs/04_technical_architecture.md)` | `[docs/04_technical_architecture_execution_checklist.md](docs/04_technical_architecture_execution_checklist.md)` |


Supporting docs: `[docs/project-rules.md](docs/project-rules.md)`, `[docs/repo_layout.md](docs/repo_layout.md)`. Human/agent contract: `[AGENTS.md](AGENTS.md)`.

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

### 2026-04-04 — Phase 0 repo framing

- **Done:** Added `docs/project-rules.md`, `docs/repo_layout.md`, `data/` and `public/` placeholders, root `README.md`, `TODO_IMPLEMENTATION.md`, `AGENTS.md`, `.cursor/rules/court-of-public-opinion.mdc`; marked Vision Phase 0 checklist items complete.
- **Next:** Vision Phase 1, Step 1 — Vite + TypeScript project init.
- **Blockers / decisions:** none.

