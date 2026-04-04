# Roles and Rules Specification

Role powers, guardrails, verdict logic, and card family definitions.

## Document snapshot

| Field | Definition |
|---|---|
| Purpose | Define responsibilities, powers, constraints, and fairness rules for every role and card family. |
| Primary roles | Prosecutor, Defense, Judge |
| Secondary roles | Witness, Juror |
| Verdict owner | Jury, not Judge |
| Design principle | Bounded authority with readable consequences |
| v1 content model | Structured prompts and authored card effects |

## Role roster

| Role | Depth | Human priority | Gameplay purpose |
|---|---|---|---|
| Prosecutor | High | Yes | Prove guilt or strongest liability theory |
| Defense | High | Yes | Create doubt, reframe, and expose weak claims |
| Judge | Medium | Yes when available | Maintain procedure and rule on objections |
| Witness | Low to medium | Optional | Deliver testimony and create contradiction opportunities |
| Juror | Low | Optional | Vote on verdict after interpreting the trial |

The game should not assume every seat is human. A two-player lobby with AI Judge, Witnesses, and Jurors is a valid and important mode. Role depth is uneven by design so the core fun lives with counsel while support roles remain easy to understand.

## Prosecutor and Defense

### Shared goals

- Build the most convincing explanation of the case.
- Use evidence at the right time rather than dumping everything early.
- Trigger contradiction bonuses by challenging weak testimony or context manipulation.
- Manage credibility, because reckless objections and failed reveals should reduce trust.

### Core counsel actions

| Action type | Cost | Effect |
|---|---|---|
| Question | 1 | Prompt a witness with a targeted testimony choice set |
| Reveal evidence | 1 | Place a visible evidence item into the court record |
| Pressure | 1 | Increase the chance of witness slips or extra context |
| Reframe | 1 | Convert current discussion into a claim that affects jury sentiment |
| Object | Reaction | Challenge a current action during allowed windows |
| Closing package | Special | Bundle final claims and synergies at end of trial |

> **Fairness rule:** Neither side should ever receive a case with no viable path to a persuasive or truthful argument. Both need leverage, even if one side has the stronger ultimate truth.

## Judge role design

Judge is a referee role with guardrails. The Judge helps create drama and rhythm, but cannot arbitrarily decide guilt. This preserves fairness while still giving the role real agency.

### Judge responsibilities

- Rule on objections during specific interrupt windows.
- Advance the phase if discussion drags or players time out.
- Issue warnings for repeated theatrics or invalid spam patterns.
- Request clarification in rare cases where the current action needs one more structured prompt.

### Allowed rulings

| Ruling | Availability | Effect |
|---|---|---|
| Sustain | On valid objection | Cancels or weakens the challenged action |
| Overrule | On valid objection | Allows the challenged action to continue |
| Strike statement | Limited | Removes some sentiment impact from a line or claim |
| Clarify | Limited | Requests one more structured explanation prompt |
| Warning | Limited | Reduces repeat disruptive play from one side |
| Move on | Always after timer threshold | Ends the current exchange and preserves pace |

> **Judge scoring:** Judge performance should be measured by procedural accuracy, pace, and fairness alignment. This discourages troll behavior and makes the role feel like a game, not just moderation.

## Witness design

Witnesses are structured actors, not freeform improv engines in v1. Each witness has authored testimony branches, reliability parameters, and context reveals that can be pulled out by the right questions or evidence.

- Every witness has a personality tag, bias rating, memory quality, and pressure tolerance.
- Witness testimony should be readable in one to three lines and tied to known evidence ids.
- Human witnesses use the same prompt framework as AI witnesses to keep balance consistent.
- Witnesses should create friction and comedy, but they must never make the case unsolvable.

## Juror design and verdict logic

Jurors decide the verdict. Human jurors are free to choose, but the UI should show the issues they are expected to weigh. AI jurors use weighted personality models so outcomes feel varied but not arbitrary.

| Factor | Effect on AI juror evaluation |
|---|---|
| Evidence quality | Strongest positive weight; direct support matters more than flair |
| Contradiction count | Repeatedly exposing lies or missing context heavily shifts trust |
| Counsel credibility | Bad objections and failed claims reduce persuasive power |
| Personal bias trait | Small modifier, such as preferring drama, authority, or hard facts |
| Judge interventions | Minor modifier when a side is frequently warned or struck |

> **Verdict rule:** The final result should be explainable from visible trial events. Players should understand why jurors leaned one way.

## Card families

| Family | Examples | Design note |
|---|---|---|
| Argument | Establish Motive, Reasonable Doubt, Pattern of Behavior | Used in openings, reframes, and closings |
| Evidence | Screenshot, DM excerpt, clip transcript, timestamp log | Each item has visible text and hidden logic tags |
| Objection | Relevance, Speculation, Out of Context, Leading | Used as reactions only during legal windows |
| Pressure | Press Timeline, Demand Specifics, Ask Motive | Targets witness stability and context release |
| Judge action | Sustain, Overrule, Clarify, Warning | Never available to counsel |

Card language should be punchy, easy to scan, and funny without obscuring function. Every card must say what it does in plain terms.