# Courtroom Game Vision Document

Vision and product boundaries for the v1 Court of Public Opinion build.

## Document snapshot

| Field | Definition |
|---|---|
| Purpose | Define the game fantasy, audience promise, and product boundaries for the v1 jam build. |
| Working title | Court of Public Opinion |
| Genre | Multiplayer courtroom party-deduction game |
| Target session | 8 to 12 minutes per trial |
| Primary platforms | Desktop browser first, mobile unsupported in v1 |
| Core promise | Fast, funny courtroom chaos that still rewards evidence and deduction. |

## Product vision

Court of Public Opinion is a browser-based multiplayer courtroom game where bizarre online disputes are treated like dramatic criminal trials. The player experience should feel loud, theatrical, and slightly ridiculous on the surface, while the underlying match logic remains fair, solvable, and strategically readable.

> **North star:** Every match should let players feel clever for spotting contradictions and funny for weaponizing internet nonsense in a formal courtroom.

The game is designed for Cursor Game Jam constraints. AI can help author code, assets, and content, but the shipped game logic should be stable, deterministic, and driven by structured data rather than real-time generative systems.

## Player fantasy

- Deliver a dramatic objection at the perfect moment.
- Catch the opposing side using a cropped screenshot or shaky timeline.
- Sway a jury through timing, rhetoric, and controlled chaos.
- Laugh at absurd internet crimes while still solving a real case.
- Roleplay a retro courtroom spectacle without needing open-ended text or voice chat.

## Audience and positioning

The ideal audience is players who enjoy party games, social deduction, short multiplayer sessions, and internet culture parody. The game should be understandable within one round and stream well because fixed cameras, reactive avatars, and fast verdict reveals create a strong spectator loop.

| Audience slice | What they want | How v1 serves them |
|---|---|---|
| Party-game players | Short chaos with clear turns | Structured phases, loud reactions, and rapid verdicts |
| Deduction players | Fair logic and contradiction hunting | Every case has a hidden truth and clue path |
| Jam judges | Readable scope and strong theme | Single courtroom, tight loop, polished aesthetic |
| Stream viewers | Moments to laugh at and clip | Objections, reversals, witness slips, verdict drama |

## Core pillars

1. Funny courtroom chaos. The game should parody online debate habits, moderation failures, AI blame-shifting, and screenshot culture.
2. Truth under the hood. Every case must have a consistent hidden truth, a contradiction map, and enough clues for a skilled player to solve it.
3. Structured social play. Players act through cards, prompts, and bounded role powers so the game stays readable and jam-feasible.
4. AI-compatible rooms. Missing seats can be filled by bots so solo, duo, and underfilled lobbies still work.
5. Stage-first 3D presentation. Three.js should make the trial feel dramatic rather than simulate a complex world.

## Game boundaries

### Included in v1

- One PS1-style courtroom with fixed cinematic cameras.
- Roles for Prosecutor, Defense, Judge, Witness, and Juror.
- Procedural-feeling but predefined case content loaded from data files.
- Multiple choice responses, argument cards, objections, and evidence reveals.
- AI seat filling for jurors, witnesses, and optional judge in low-player rooms.
- One tiny lobby only if it does not delay joining a trial.

### Excluded from v1

- Open voice chat or unrestricted text chat as a required mechanic.
- Large explorable 3D spaces, free movement, or physics-heavy interaction.
- Real-time content generation during a trial.
- Deep avatar customization, account systems, or progression economies.
- Legal realism. The tone is theatrical satire, not simulation.

## Winning experience

A successful match should end with players feeling that the verdict came from both performance and logic. The jury may be entertained by drama, but the strongest outcomes happen when timing, evidence, and contradictions line up. The player should leave the round with one memorable courtroom beat, such as a sustained objection, a witness collapse, or a screenshot reveal that flips the room.

> **Shipping standard:** If a round is funny but unreadable, the design failed. If a round is solvable but dry, the design also failed. v1 must hold both at once.