# Court of Public Opinion
## Roles and Rules Execution Checklist

**Purpose:** Turn the role system and game rules into phased implementation steps.

---

## Phase 1. Shared role framework

### Goals
- Create one common model for all courtroom roles.
- Prevent role logic from scattering across the codebase.

### Checklist
- [ ] Phase 1, Step 1: Define a `RoleType` enum for Judge, Prosecutor, Defense, Witness, Juror, and Defendant.
- [ ] Phase 1, Step 2: Create a base role profile interface.
- [ ] Phase 1, Step 3: Add shared role fields:
  - id
  - display name
  - seat position
  - controlled by human or AI
  - action permissions
  - UI panel type
- [ ] Phase 1, Step 4: Add a role registry for assigning seats in the courtroom.
- [ ] Phase 1, Step 5: Add role-specific intro screens.
- [ ] Phase 1, Step 6: Add role-specific private briefings.
- [ ] Phase 1, Step 7: Define when each role may act.
- [ ] Phase 1, Step 8: Define timeout behavior for each role.
- [ ] Phase 1, Step 9: Add debug tools to reassign a role in local mode.
- [ ] Phase 1, Step 10: Write documentation for role permissions.

### Exit criteria
- Roles are modeled consistently.
- Each role has a seat, permissions, and UI identity.

---

## Phase 2. Prosecutor implementation

### Goals
- Build one of the two main competitive roles.
- Make the role tactically expressive but structured.

### Checklist
- [ ] Phase 2, Step 1: Define Prosecutor action set.
- [ ] Phase 2, Step 2: Add opening statement options for Prosecutor.
- [ ] Phase 2, Step 3: Add question cards usable during witness examination.
- [ ] Phase 2, Step 4: Add evidence presentation actions.
- [ ] Phase 2, Step 5: Add objection actions the Prosecutor can use.
- [ ] Phase 2, Step 6: Add contradiction pressure actions.
- [ ] Phase 2, Step 7: Add a credibility or momentum meter for Prosecutor play.
- [ ] Phase 2, Step 8: Add UI panel showing hand, available actions, and timer.
- [ ] Phase 2, Step 9: Add AI fallback behavior for Prosecutor in solo mode.
- [ ] Phase 2, Step 10: Test full Prosecutor interaction flow in one case.

### Exit criteria
- Prosecutor can fully participate in all required phases.
- The role feels like a primary seat.

---

## Phase 3. Defense implementation

### Goals
- Build the second main competitive role.
- Ensure the role is equally viable and readable.

### Checklist
- [ ] Phase 3, Step 1: Define Defense action set.
- [ ] Phase 3, Step 2: Add opening statement options for Defense.
- [ ] Phase 3, Step 3: Add rebuttal-oriented question cards.
- [ ] Phase 3, Step 4: Add evidence presentation actions for context reversal and doubt.
- [ ] Phase 3, Step 5: Add objection actions the Defense can use.
- [ ] Phase 3, Step 6: Add contradiction and credibility attack actions.
- [ ] Phase 3, Step 7: Add a credibility or momentum meter for Defense play.
- [ ] Phase 3, Step 8: Add UI panel showing hand, available actions, and timer.
- [ ] Phase 3, Step 9: Add AI fallback behavior for Defense in solo mode.
- [ ] Phase 3, Step 10: Balance the Defense action pool against Prosecutor.

### Exit criteria
- Defense can contest the full trial.
- The match supports a real two-sided contest.

---

## Phase 4. Judge implementation

### Goals
- Make Judge meaningful but bounded.
- Prevent troll behavior and arbitrary control.

### Checklist
- [ ] Phase 4, Step 1: Define Judge action windows.
- [ ] Phase 4, Step 2: Limit Judge actions to explicit rulings and pacing controls.
- [ ] Phase 4, Step 3: Add Judge UI for objection responses.
- [ ] Phase 4, Step 4: Add Judge UI for clarification prompts.
- [ ] Phase 4, Step 5: Add Judge UI for warning and move-on controls.
- [ ] Phase 4, Step 6: Prevent Judge from directly setting the final verdict.
- [ ] Phase 4, Step 7: Add Judge scoring based on fairness, pacing, and consistency.
- [ ] Phase 4, Step 8: Add anti-abuse checks for repeated low-quality rulings.
- [ ] Phase 4, Step 9: Add AI fallback Judge logic for low-player modes.
- [ ] Phase 4, Step 10: Test that a trial remains fair with human Judge and AI jury.

### Exit criteria
- Judge feels active.
- Judge cannot override the core verdict structure.
- Judge behavior is measurable.

---

## Phase 5. Witness implementation

### Goals
- Keep witnesses lightweight and structured.
- Support both human and AI witnesses.

### Checklist
- [ ] Phase 5, Step 1: Define witness profile schema.
- [ ] Phase 5, Step 2: Add fields for:
  - personality
  - reliability
  - bias
  - pressure tolerance
  - testimony branches
  - contradiction hooks
- [ ] Phase 5, Step 3: Add witness intro panel.
- [ ] Phase 5, Step 4: Add structured response choices for human witnesses.
- [ ] Phase 5, Step 5: Add AI branch selection logic for AI witnesses.
- [ ] Phase 5, Step 6: Add witness reaction animations or portrait states.
- [ ] Phase 5, Step 7: Add witness destabilization on successful contradiction pressure.
- [ ] Phase 5, Step 8: Add limits so witnesses cannot improvise outside allowed branches in MVP.
- [ ] Phase 5, Step 9: Test witness readability for players who join mid-lobby.
- [ ] Phase 5, Step 10: Validate that witness actions preserve case solvability.

### Exit criteria
- Witnesses are playable.
- Human and AI witness flows use the same structured framework.

---

## Phase 6. Juror implementation

### Goals
- Make jurors lightweight but meaningful.
- Use the jury as the final verdict authority.

### Checklist
- [ ] Phase 6, Step 1: Define juror profile schema.
- [ ] Phase 6, Step 2: Add fields for:
  - personality
  - bias weights
  - trust in authority
  - sensitivity to facts
  - sensitivity to drama
  - voting rationale tags
- [ ] Phase 6, Step 3: Add juror reaction states during trial.
- [ ] Phase 6, Step 4: Add human juror vote UI.
- [ ] Phase 6, Step 5: Add AI juror weighted vote system.
- [ ] Phase 6, Step 6: Add post-match explanation for AI juror vote reasons.
- [ ] Phase 6, Step 7: Add support for mixed human and AI juries.
- [ ] Phase 6, Step 8: Ensure jury does not receive hidden-truth-only information.
- [ ] Phase 6, Step 9: Add jury box visuals in the courtroom scene.
- [ ] Phase 6, Step 10: Test jury vote outputs against expected case patterns.

### Exit criteria
- Jury can decide the verdict.
- Jury behavior is legible and configurable.

---

## Phase 7. Defendant handling

### Goals
- Include the Defendant role without overcomplicating MVP.
- Keep Defendant optional or lightweight.

### Checklist
- [ ] Phase 7, Step 1: Decide whether Defendant is active in the first playable.
- [ ] Phase 7, Step 2: If active, define a lightweight Defendant action set.
- [ ] Phase 7, Step 3: Add Defendant seat and courtroom presentation.
- [ ] Phase 7, Step 4: Add Defendant reaction states.
- [ ] Phase 7, Step 5: Add Defendant-only private information if needed.
- [ ] Phase 7, Step 6: Add guardrails so Defendant does not replace Defense gameplay depth.
- [ ] Phase 7, Step 7: Add AI fallback Defendant presentation if role is not player-controlled.
- [ ] Phase 7, Step 8: Ensure Defendant presence improves flavor without harming clarity.
- [ ] Phase 7, Step 9: Disable the role cleanly if not included in MVP lobbies.
- [ ] Phase 7, Step 10: Document the chosen MVP behavior.

### Exit criteria
- Defendant scope is deliberate.
- The role does not destabilize the main loop.

---

## Phase 8. Rules enforcement and fairness systems

### Goals
- Turn design intent into enforceable rules.
- Make edge cases predictable.

### Checklist
- [ ] Phase 8, Step 1: Define legal action windows by phase and role.
- [ ] Phase 8, Step 2: Prevent unauthorized actions outside valid windows.
- [ ] Phase 8, Step 3: Add timer expiry behavior for all active roles.
- [ ] Phase 8, Step 4: Add default fallback actions when a player times out.
- [ ] Phase 8, Step 5: Add anti-spam limits for objections and theatrics.
- [ ] Phase 8, Step 6: Add consistency checks so one action cannot resolve conflicting outcomes.
- [ ] Phase 8, Step 7: Add transcript logging for all role actions.
- [ ] Phase 8, Step 8: Add replay-friendly event records for debugging.
- [ ] Phase 8, Step 9: Add rule tests for invalid role actions.
- [ ] Phase 8, Step 10: Add a fairness checklist for every new role feature.

### Exit criteria
- Rules are enforceable by code.
- Match fairness is not left to assumption.

---

## Role acceptance checklist

- [ ] Prosecutor and Defense are complete primary roles.
- [ ] Judge is bounded and cannot directly force the verdict.
- [ ] Witnesses are structured.
- [ ] Jurors can be human or AI.
- [ ] Mixed-role lobbies still function.
- [ ] Role permissions are documented and testable.
