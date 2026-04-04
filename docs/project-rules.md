# Court of Public Opinion — project rules

Core principles and Definition of Done for implementation. Agents must read this after [`TODO_IMPLEMENTATION.md`](../TODO_IMPLEMENTATION.md) and the active execution checklist.

## Core principles

1. **Deterministic case logic** — Trial outcomes follow data-defined rules and valid state transitions, not ad hoc or generative reasoning at runtime.
2. **Structured player input** — Players choose from defined actions, prompts, and UI affordances; freeform chat or open-ended text is not the primary input channel for MVP.
3. **Jury decides verdict** — The jury’s vote or evaluation is authoritative for the verdict outcome in the shipped loop.
4. **Judge is bounded** — Judge rulings operate within explicit windows and rule sets (no unlimited improvisation).
5. **One courtroom map for MVP** — Single shipped environment until the first stable playable trial exists; variety comes after.

## Definition of Done (per feature or checklist step)

A step is not done until all of the following hold (unless the session log in [`TODO_IMPLEMENTATION.md`](../TODO_IMPLEMENTATION.md) records an intentional deferral with a follow-up step ID):

- **Code exists** — The change is present in the repo (no “we’ll add it later” without logging deferral).
- **Behavior is testable** — Someone can run the app or a script and observe the intended behavior.
- **UI feedback exists** — For player-facing work, there is visible or accessible feedback (placeholder copy is acceptable in early phases).
- **Data schema is documented** — New or changed content shapes are reflected in `docs/` or inline schema docs, as appropriate.
- **No blocking console errors** — The feature does not introduce errors that block the flow under normal use (warnings may be logged if explicitly acceptable).

## Agent responsibilities

- When completing execution checklist steps, **update the corresponding checkboxes** in the relevant `docs/*_execution_checklist.md` file (and vision milestones or suggested tickets if you use them).
- When **data schemas, match rules, or architecture** change, update the relevant `docs/*.md` so the next session does not rely on stale design text.
- For substantial **UI or 3D scene** changes, capture or describe visual verification in the session log or pass report as required by [`AGENTS.md`](../AGENTS.md).
