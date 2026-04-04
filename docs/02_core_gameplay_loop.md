# Core Gameplay Loop Specification

Authoritative phase-by-phase design for one full courtroom match.

## Document snapshot

| Field | Definition |
|---|---|
| Purpose | Specify how one trial flows from room entry to verdict and scoring. |
| Target length | 8 to 12 minutes |
| Supported player counts | 2 to 6 humans with AI fill |
| Primary loop | Briefing -> statements -> witness rounds -> closings -> jury vote |
| Input model | Cards, multiple choice prompts, timed windows |
| Failure to avoid | Dead air, unreadable turns, and unresolved ambiguity |

## Round structure overview

A trial should move through tightly controlled phases so players always know who acts, why they are acting, and what they can achieve. Most roles interact in short windows rather than constant freeform play. This keeps the pace high and allows the camera, UI, and audio cues to dramatize each decision.

| Phase | Time budget | Purpose | Owner |
|---|---|---|---|
| Room setup | 30 to 45 sec | Assign roles, load case, show readiness | Server |
| Case reveal | 30 sec | Explain charge and absurd setup | Game |
| Private briefings | 30 to 45 sec | Give each role their information packet | Game |
| Opening statements | 60 to 90 sec | Set theory of the case | Prosecution, Defense |
| Witness round A | 2 to 3 min | Question, object, reveal first clues | Counsel, Judge, Witness |
| Witness round B | 2 to 3 min | Escalate pressure and surface contradictions | Counsel, Judge, Witness |
| Closing statements | 60 to 90 sec | Assemble the strongest remaining argument | Prosecution, Defense |
| Jury vote | 30 to 45 sec | Lock verdict | Jurors |
| Verdict and score | 20 to 30 sec | Reveal outcome and highlights | Game |

## Detailed phase flow

### 1. Room setup and case loading

- Server creates authoritative room state and chooses a case from the configured pool.
- Human seats are assigned first to Prosecutor and Defense where possible, then Judge, then optional Witness or Juror seats.
- Empty required seats are filled with AI role controllers.
- All players see the courtroom and seating chart immediately. No loading screens beyond a short transition.

### 2. Case reveal

The game presents the case title, defendant, charge, and one-line incident summary. This information is public. It should be short enough to scan in one glance and funny enough to set the tone.

### 3. Private briefings

Each role receives role-specific information. Prosecutor and Defense get their opening card options, initial evidence, and working theory. Judge gets procedure powers and any special rule reminders. Witnesses get their testimony branch card set. Jurors get a public persona plus hidden weighting traits for how they judge the round.

### 4. Opening statements

Counsel select one opening frame card and one tone modifier card. The result drives a short authored line and a small initial sentiment push with some jurors. Openings should not determine the case, but they should establish early momentum.

### 5. Witness rounds

Witness rounds are the core of the match. Counsel spend action points on questions, pressure plays, and evidence reveals. Witnesses respond through structured testimony choices. The other side may object during allowed interrupt windows, and the Judge must issue a bounded ruling before play continues.

### 6. Closing statements

Both sides combine their strongest remaining claims, evidence synergies, and contradiction bonuses into a final statement package. Closings should summarize what the jury is meant to believe, not reopen the case.

### 7. Jury vote and verdict

Human jurors cast directly. AI jurors evaluate weighted factors such as evidence quality, contradiction count, role credibility, and personal bias traits. The verdict reveal should include the win result plus two or three highlighted moments that explain why the room swung.

## Action economy

Action economy keeps turns meaningful and prevents spam. During each witness round, each counsel has a limited pool of actions. The Judge also has a smaller procedural action pool. This makes timing and restraint part of the strategy.

| Role | Budget per witness round | Notes |
|---|---|---|
| Prosecutor | 3 actions | Usually question, reveal, pressure, or reframe |
| Defense | 3 actions | Mirrors Prosecutor budget for fairness |
| Judge | 2 rulings plus move-on power | Rulings only during valid windows |
| Witness | Triggered responses only | Responds when examined or challenged |
| Juror | No active budget in v1 | Reacts and votes only |

> **Pacing rule:** If a player times out, the game auto-selects a safe default action so the match never stalls.

## Information flow

- Public information: case title, charge, visible evidence once revealed, Judge rulings, scoreboard moments, final verdict.
- Private information: role briefings, some witness truth flags, juror bias weights, and hidden evidence tags until discovered.
- Discoverable information: contradiction links, fuller context behind partial evidence, and witness credibility shifts.

This split is important. The game should create social uncertainty without becoming random. Players win by uncovering and framing discoverable information, not by guessing what the designer secretly withheld.

## Success metrics for the loop

1. A first-time player can understand whose turn it is within two seconds.
2. Most rounds complete inside the target session window.
3. At least one major reversal happens in a typical match.
4. The verdict can be explained by visible play, not only hidden math.
5. Solo and duo lobbies remain entertaining because AI keeps the case moving.