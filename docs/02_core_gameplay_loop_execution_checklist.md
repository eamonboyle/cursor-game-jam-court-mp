# Court of Public Opinion
## Core Gameplay Loop Execution Checklist

**Purpose:** Break the trial loop into implementation phases and verifiable gameplay tasks.

---

## Phase 1. Trial state machine

### Goals
- Build the full match as explicit phases.
- Prevent hidden or ad hoc state transitions.

### Checklist
- [ ] Phase 1, Step 1: Define the full trial phase enum in TypeScript.
- [ ] Phase 1, Step 2: Create a `MatchState` model containing:
  - current phase
  - active role
  - turn timer
  - current witness
  - current evidence stack
  - jury sentiment
  - ruling history
- [ ] Phase 1, Step 3: Create a central phase transition function.
- [ ] Phase 1, Step 4: Add validation so invalid transitions are rejected.
- [ ] Phase 1, Step 5: Create dev tools to manually jump between phases.
- [ ] Phase 1, Step 6: Log all phase transitions in debug mode.
- [ ] Phase 1, Step 7: Add UI text showing current phase and active player.
- [ ] Phase 1, Step 8: Add a timer model that can pause, resume, and expire.
- [ ] Phase 1, Step 9: Define end-of-phase callbacks for cleanup.
- [ ] Phase 1, Step 10: Write a unit-tested phase transition map.

### Exit criteria
- Every trial phase is explicit.
- Phase order is testable.
- Debugging the trial flow is easy.

---

## Phase 2. Case loading and hidden truth model

### Goals
- Load a predefined case file.
- Preserve a solvable hidden truth under the comedy layer.

### Checklist
- [ ] Phase 2, Step 1: Define a JSON schema for a case file.
- [ ] Phase 2, Step 2: Add fields for:
  - title
  - charge
  - summary
  - prosecution theory
  - defense theory
  - hidden truth
  - witnesses
  - evidence
  - contradiction graph
  - suggested phase order
- [ ] Phase 2, Step 3: Create one complete sample case.
- [ ] Phase 2, Step 4: Load the sample case into local state.
- [ ] Phase 2, Step 5: Display public case summary in the intro UI.
- [ ] Phase 2, Step 6: Deliver role-specific private info to each role.
- [ ] Phase 2, Step 7: Ensure hidden truth is not exposed in normal UI.
- [ ] Phase 2, Step 8: Add a debug-only inspector for hidden truth and contradiction links.
- [ ] Phase 2, Step 9: Validate that every case has at least:
  - one strong prosecution clue
  - one strong defense clue
  - two contradiction opportunities
- [ ] Phase 2, Step 10: Write a case validation script.

### Exit criteria
- A full case loads cleanly.
- The hidden truth exists and is solvable.
- Public and private information are separated.

---

## Phase 3. Opening statements

### Goals
- Create the first dramatic interaction in the trial.
- Keep the interaction structured and quick.

### Checklist
- [ ] Phase 3, Step 1: Define opening statement card types.
- [ ] Phase 3, Step 2: Create a data model for selectable opening angles.
- [ ] Phase 3, Step 3: Create UI for prosecution opening card selection.
- [ ] Phase 3, Step 4: Create UI for defense opening card selection.
- [ ] Phase 3, Step 5: Add short voice-line or text playback for selected statements.
- [ ] Phase 3, Step 6: Show visible courtroom reaction to each opening move.
- [ ] Phase 3, Step 7: Update jury sentiment after each opening.
- [ ] Phase 3, Step 8: Add judge acknowledgement to close the phase.
- [ ] Phase 3, Step 9: Add timeout fallback if a player does not act.
- [ ] Phase 3, Step 10: Verify the phase can complete without networking.

### Exit criteria
- Both sides can make a structured opening.
- Jury sentiment updates.
- The next phase begins cleanly.

---

## Phase 4. Witness examination

### Goals
- Build the main back-and-forth of the trial.
- Support questioning, testimony branches, and pressure.

### Checklist
- [ ] Phase 4, Step 1: Create a witness data schema with testimony branches.
- [ ] Phase 4, Step 2: Add witness selection and active witness state.
- [ ] Phase 4, Step 3: Add prosecution question options.
- [ ] Phase 4, Step 4: Add defense question options.
- [ ] Phase 4, Step 5: Add witness response options for structured play.
- [ ] Phase 4, Step 6: Add witness reliability, bias, and pressure tolerance.
- [ ] Phase 4, Step 7: Implement pressure cards that can alter response branches.
- [ ] Phase 4, Step 8: Show testimony history in a scrollable court transcript panel.
- [ ] Phase 4, Step 9: Flag testimony lines that connect to contradiction nodes.
- [ ] Phase 4, Step 10: Add logic to move to the next witness or next phase when questioning ends.

### Exit criteria
- Witnesses can be examined.
- Structured responses work.
- Testimony history is visible and useful.

---

## Phase 5. Evidence system

### Goals
- Let players introduce information at the right moment.
- Make evidence readable, dramatic, and logically connected.

### Checklist
- [ ] Phase 5, Step 1: Define an evidence schema.
- [ ] Phase 5, Step 2: Add fields for:
  - title
  - type
  - description
  - thumbnail
  - tags
  - linked claims
  - contradiction targets
  - side relevance
- [ ] Phase 5, Step 3: Build an evidence panel UI with thumbnails and metadata.
- [ ] Phase 5, Step 4: Add evidence selection for active counsel.
- [ ] Phase 5, Step 5: Add evidence reveal animation or presentation view.
- [ ] Phase 5, Step 6: Add logic for valid and invalid evidence usage windows.
- [ ] Phase 5, Step 7: Apply jury sentiment changes when evidence is strong, weak, or misleading.
- [ ] Phase 5, Step 8: Add transcript entries for evidence reveals.
- [ ] Phase 5, Step 9: Add context-link logic so some evidence unlocks follow-up facts.
- [ ] Phase 5, Step 10: Add debugging support to inspect evidence tags and linked contradiction nodes.

### Exit criteria
- Evidence can be presented and understood.
- Evidence affects the case state.
- Timing matters.

---

## Phase 6. Objections and judge rulings

### Goals
- Add interruption windows and bounded judge authority.
- Keep rulings meaningful but controlled.

### Checklist
- [ ] Phase 6, Step 1: Define objection card types.
- [ ] Phase 6, Step 2: Mark which game actions can be objected to.
- [ ] Phase 6, Step 3: Add a short objection timing window after eligible actions.
- [ ] Phase 6, Step 4: Add UI for selecting an objection.
- [ ] Phase 6, Step 5: Add a judge ruling prompt with limited choices.
- [ ] Phase 6, Step 6: Implement ruling results:
  - sustain
  - overrule
  - strike statement
  - ask for clarification
  - warning
- [ ] Phase 6, Step 7: Add visible courtroom feedback for ruling outcomes.
- [ ] Phase 6, Step 8: Log rulings in the transcript and match history.
- [ ] Phase 6, Step 9: Add anti-spam guardrails so objections cannot be abused every second.
- [ ] Phase 6, Step 10: Add a judge score metric for fairness and pacing.

### Exit criteria
- Objections are dramatic and readable.
- The judge has agency without controlling the verdict.
- Ruling outcomes are explicit.

---

## Phase 7. Contradictions and claim resolution

### Goals
- Deliver the deduction layer under the humor.
- Reward good timing and inference.

### Checklist
- [ ] Phase 7, Step 1: Define a contradiction node model.
- [ ] Phase 7, Step 2: Link contradiction nodes to testimony and evidence.
- [ ] Phase 7, Step 3: Add a “press contradiction” action for counsel.
- [ ] Phase 7, Step 4: Validate whether the contradiction claim is correct.
- [ ] Phase 7, Step 5: Apply payoff effects:
  - credibility shift
  - jury sentiment shift
  - transcript marker
  - witness destabilization
- [ ] Phase 7, Step 6: Add failure effects for weak contradiction attempts.
- [ ] Phase 7, Step 7: Add UI feedback showing contradiction success or failure.
- [ ] Phase 7, Step 8: Add debug overlays to verify contradiction graph integrity.
- [ ] Phase 7, Step 9: Ensure at least one contradiction path can swing the case meaningfully.
- [ ] Phase 7, Step 10: Test contradiction handling across all sample cases.

### Exit criteria
- Contradictions are discoverable and actionable.
- Correct reads matter.
- Bad reads have consequences.

---

## Phase 8. Closing statements and verdict

### Goals
- End the trial clearly and dramatically.
- Turn the whole match into a readable result.

### Checklist
- [ ] Phase 8, Step 1: Create closing statement card sets.
- [ ] Phase 8, Step 2: Let each side build a final argument from remaining options.
- [ ] Phase 8, Step 3: Display a summary of key evidence and contradiction moments.
- [ ] Phase 8, Step 4: Lock all actions except deliberation and vote.
- [ ] Phase 8, Step 5: Build jury voting UI for human jurors.
- [ ] Phase 8, Step 6: Build AI vote calculation for AI jurors.
- [ ] Phase 8, Step 7: Aggregate the final verdict.
- [ ] Phase 8, Step 8: Display verdict cinematics and final score breakdown.
- [ ] Phase 8, Step 9: Show post-match “why the jury voted this way” summary.
- [ ] Phase 8, Step 10: Return players to room summary or rematch flow.

### Exit criteria
- Trials end cleanly.
- Verdicts are understandable.
- The result feels earned and dramatic.

---

## MVP gameplay acceptance checklist

- [ ] One full case can be played from intro to verdict locally.
- [ ] Opening, witness, evidence, objection, contradiction, and verdict phases all work.
- [ ] The jury decides the verdict.
- [ ] The judge never directly declares guilt or innocence.
- [ ] Cases remain solvable.
- [ ] The transcript makes the match legible for players and debugging.
