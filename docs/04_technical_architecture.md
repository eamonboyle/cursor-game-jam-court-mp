# Technical Architecture Specification

Build-ready technical design for Three.js, TypeScript, and room-based multiplayer.

## Document snapshot

| Field | Definition |
|---|---|
| Purpose | Translate the design into a buildable Three.js and TypeScript architecture for a browser-first jam game. |
| Client stack | Vite, TypeScript, Three.js, HTML/CSS overlay UI |
| Server stack | Node.js room server with authoritative match state |
| Recommended networking | Colyseus or equivalent room/state sync layer |
| Content source | JSON or typed data modules checked into repo |
| Core principle | Rule-based simulation first, presentation-rich rendering second |

## Architecture goals

- Join a room quickly and reach gameplay without heavy downloads or login.
- Keep trial state authoritative on the server so card usage, timers, and rulings stay consistent.
- Separate game rules from presentation so AI-authored code can be generated in smaller, safer modules.
- Use data-driven cases, cards, witnesses, and jurors to reduce hard-coded branching.
- Make 3D scene work as a stage layer while most interaction happens in reliable UI overlays.

## High-level system map

| Layer | Main modules | Responsibility |
|---|---|---|
| Frontend app | Scene, UI, input, client store | Render courtroom and collect player actions |
| Network client | Room adapter, serializers, event handlers | Sync local state with authoritative room |
| Game server | Room state, rules engine, timers, AI controllers | Validate actions and progress the match |
| Content data | Cases, cards, witnesses, jurors, localization strings | Drive game rules and authored text |
| Asset pipeline | Models, textures, audio, portraits | Support presentation without changing logic |

> **Non-negotiable separation:** No gameplay rule should depend on a Three.js object existing in the scene. The scene reflects state; it does not define state.

## Frontend structure

The client should be split into scene code and game UI code. Three.js handles courtroom rendering, camera changes, animations, and reactions. An HTML overlay handles menus, cards, evidence lists, timers, vote prompts, and accessibility-friendly text presentation.

| Module | Notes |
|---|---|
| app/bootstrap | Creates renderer, routes, network connection, and root stores |
| scene/courtroom | Loads courtroom set, avatars, lights, and camera presets |
| scene/director | Applies camera cuts and reaction cues from game events |
| ui/screens | Lobby, briefing, trial HUD, verdict, and reconnect views |
| ui/components | Cards, evidence panels, timers, role badges, vote controls |
| state/client-store | Read-only derived state plus local UI flags |
| net/room-client | Encodes player commands and receives snapshots or patches |

## Server structure

The server owns the truth. It loads case data, assigns roles, validates every action, and advances timers. AI players also live on the server side so their decisions are synchronized and cannot drift from room state.

| Module | Notes |
|---|---|
| rooms/trial-room | Colyseus room or equivalent authoritative session |
| game/trial-state | Serializable state tree for phase, timers, record, and seats |
| game/rules-engine | Pure functions that validate and apply commands |
| game/phase-runner | Starts and ends phases, handles turn order and timeouts |
| game/ai | Simple heuristic controllers for Judge, Witnesses, and Jurors |
| content/loaders | Loads case and card definitions from JSON or TS data |
| telemetry | Logs errors, phase durations, disconnects, and win reasons |

> **Implementation rule:** Rules-engine functions should be deterministic and testable in isolation. This is critical for AI-assisted development and later balancing.

## State model

Use a single trial state tree that can be serialized and patched over the network. Keep it intentionally explicit. Hidden information should still live in the server state, but each client receives only the role-scoped view it is allowed to see.

### Suggested top-level state fields

- roomMeta: room id, case id, seed, reconnect tokens, player seats
- phase: current phase, remaining time, acting seat, interrupt window status
- courtRecord: revealed evidence, accepted claims, Judge rulings, strike history
- roles: role packets with public and private fields
- sentiment: juror lean values, counsel credibility, witness credibility
- scoreSummary: contradiction count, highlight moments, final verdict explanation

## Content pipeline

Predefined data should live in human-readable files and be validated before runtime. For jam scope, JSON or TypeScript objects are both acceptable, but a schema validator should reject broken case files early.

| Content type | Suggested file | Required fields |
|---|---|---|
| Case | cases/*.json | title, charge, summary, hiddenTruth, evidenceIds, witnessIds, contradictionMap |
| Card | cards/*.json | id, family, label, rulesText, effect payload |
| Witness | witnesses/*.json | name, traits, testimony branches, evidence links |
| Juror | jurors/*.json | bias weights, vote heuristics, flavor lines |
| Localization | strings/*.json | UI labels, prompts, result text |

## Networking and resilience

1. Authoritative server validates all commands so clients cannot spoof card effects or phase changes.
2. Reconnect support should preserve seat identity for a short window.
3. Timeout fallbacks must choose default actions automatically to protect pacing.
4. Room snapshots should be compact enough for browser play on average home connections.
5. Every client-visible event should be idempotent so repeated packets do not duplicate effects.

## Testing priorities

| Test target | What to verify |
|---|---|
| Rules engine unit tests | Action validation, contradiction triggers, scoring, phase transitions |
| AI controller tests | Bots choose legal actions and finish rounds without deadlocks |
| Content validation tests | Case files reference valid ids and remain solvable |
| Room integration tests | Disconnect, reconnect, timeout, and verdict flow |
| Client smoke tests | Core screens render and basic room flow works in browser build |

> **Jam realism:** Automate the rules engine first. Visual polish can come later, but broken state sync will sink the project.