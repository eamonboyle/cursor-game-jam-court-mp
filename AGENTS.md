# Agent contract — Court of Public Opinion

This document is **binding** for anyone (human or AI) implementing the game in this repository. Deviating from it is incorrect unless the **session log** in `[TODO_IMPLEMENTATION.md](TODO_IMPLEMENTATION.md)` records a dated team decision with rationale.

## 1. Startup sequence (ordered)

Before writing or editing **implementation** code, the agent MUST read, in order:

1. `[TODO_IMPLEMENTATION.md](TODO_IMPLEMENTATION.md)` — **status snapshot** and the latest **session log** entry.
2. The **specific** `docs/*_execution_checklist.md` file (and phase/step) indicated by that snapshot.
3. `[docs/project-rules.md](docs/project-rules.md)` — principles and Definition of Done.

If the snapshot is missing, empty, or obviously stale, the agent MUST say so and propose updates. The agent MUST NOT silently assume scope or phase.

## 2. Single source of truth for progress

Progress MUST be recorded by checking boxes **only** on the execution checklists in `docs/` (and the vision checklist’s Phase 5 milestones or suggested tickets if used).

The agent MUST NOT maintain a parallel checklist inside `[TODO_IMPLEMENTATION.md](TODO_IMPLEMENTATION.md)`.

## 3. Phase discipline

The agent MUST NOT skip phases or steps except where `[TODO_IMPLEMENTATION.md](TODO_IMPLEMENTATION.md)` **session log** records a **documented decision** (date + rationale). Unilateral scope jumps are forbidden.

## 4. One focused pass

Each coding session MUST target **one** checklist step, or a **small subset explicitly named** in the TODO snapshot. The agent MUST NOT bundle unrelated systems in one pass.

## 5. End-of-pass handoff (non-negotiable)

Before finishing work, the agent MUST:

1. Toggle the completed checklist item(s) on the correct execution checklist(s).
2. Update the **Status snapshot** in `[TODO_IMPLEMENTATION.md](TODO_IMPLEMENTATION.md)` (phase, step ID, next action).
3. Append a **session log** entry (date, done, next, blockers/decisions).
4. If data schemas or architecture changed, update the relevant `docs/*.md` as required by `[docs/project-rules.md](docs/project-rules.md)`.

## 6. Pass report in chat

Each coding pass MUST state: **files touched**, **behavior added or changed**, **assumptions**, and **how to verify** (see “Cursor handoff rules” in `[docs/01_game_vision_execution_checklist.md](docs/01_game_vision_execution_checklist.md)`).

## 7. Definition of Done gate

No step is complete until `[docs/project-rules.md](docs/project-rules.md)` **Definition of Done** is satisfied for that change, **unless** the session log records an intentional deferral with a **follow-up step ID**.

---

Long explanations belong in `docs/`, not here.