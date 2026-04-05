# MVP scope — Court of Public Opinion

**Purpose:** Single source of truth for what ships in the jam MVP vs what waits. Aligns with [01_game_vision.md](01_game_vision.md) and [03_roles_and_rules.md](03_roles_and_rules.md).

**Session target:** 8–12 minutes per trial. **Platform:** desktop browser first (no mobile requirement). **Stack:** Vite + TypeScript + Three.js (PS1-style courtroom) + HTML/CSS UI; rooms eventually Colyseus-compatible.

---

## MVP statement (what we ship)

Court of Public Opinion MVP is **one polished, data-driven trial loop** in a **single retro courtroom**: 2–6 players (with **AI filling empty seats**) resolve **authored cases** through **structured actions**—cards, evidence reveals, objections, witness prompts, and a **jury verdict**. The Judge **moderates and rules on objections inside explicit windows** but **does not decide guilt**; the **jury owns the verdict**. The experience must stay **funny and theatrical** while remaining **fair, solvable, and readable** under the hood (deterministic logic from JSON/content, not live LLM generation during play).

---

## Locked MVP decisions (checklist alignment)

| # | Decision | Status |
|---|-----------|--------|
| 1 | **One map for MVP** — only a **single courtroom** ships; no extra venues or hub worlds. | Locked |
| 2 | **Deep roles** — **Prosecutor** and **Defense** carry the core strategic depth; other roles support the loop. | Locked |
| 3 | **Judge** — **bounded** powers (objection windows, phase advance, warnings, strike/clarify where allowed per rules); **cannot substitute for jury on verdict**. | Locked |
| 4 | **Verdict** — **Jury decides** final outcome. | Locked |
| 5 | **Witness / Juror** — **light** roles for MVP:Witness = authored branches and structured prompts; Juror = interpret and vote without deep buildcraft. | Locked |
| 6 | **Player input** — **structured only** (menus, cards, timed choices). No required open voice or freeform chat as a core mechanic. | Locked |
| 7 | **Cases** — **predefined data** (JSON / content packs). No procedural generation of case facts **during** the trial. | Locked |

---

## MVP content targets (jam-sized)

These are **shipping targets** for the MVP build, not aspirational backlogs:

| Category | Target count |
|----------|----------------|
| Courtroom scene | **1** |
| Playable cases | **3–5** |
| Evidence cards (total across cases) | **20–30** |
| Objection / reaction cards (or equivalent discrete objection actions) | **8–12** |
| Witness archetypes (reusable profiles) | **6–10** |
| Juror archetypes (bias / readability templates) | **6–10** |

Counts may be adjusted only via a **session-logged decision** in [TODO_IMPLEMENTATION.md](../TODO_IMPLEMENTATION.md).

---

## Explicitly not in MVP

Scope creep guardrail. **Unless** recorded as a dated decision in `TODO_IMPLEMENTATION.md`, the MVP **does not** include:

- **Extra maps** or explorable 3D spaces; **free movement** or physics puzzles as core play.
- **Live generative case content** during trials (LLM-authored facts on the fly).
- **Open voice / unrestricted text** required for play.
- **Deep** avatar customization, accounts, ranked ladders, or **progression economies**.
- **Legal realism** — tone stays **satire / theater**, not simulation.
- **Mobile-native** UI and performance parity.
- **Full production multiplayer services** beyond what’s needed for **browser play with AI-filled seats** and a minimal room flow (Colyseus-class server **after** local/offline loop is stable, per production sequencing).

---

## Freeze rule

**MVP scope is frozen until the first playable exists** — defined as: **one full trial** runnable end-to-end (phases, counsel actions, bounded judge, jury verdict) with **no blocking errors**, even if art is placeholder. After that milestone, scope changes require a **TODO session log** entry (date + rationale).

**Last updated:** Vision Phase 2 complete — scope doc authored and checklist items satisfied.
