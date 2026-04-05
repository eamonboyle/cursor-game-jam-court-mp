# `/data`

JSON and config for cases, evidence, witnesses, jurors, cards, and role definitions. Structure will grow during implementation; see [`docs/repo_layout.md`](../docs/repo_layout.md).

## Cases (Milestone I)

Bundled dossiers live in **`cases/`**:

- `index.json` — `defaultCaseId` + ordered list for the UI.
- One JSON file per case (`id`, `title`, `tagline`, `witnessId`, `prosecutionCards`, `defenseCards`, `evidence`).

The app imports these at build time via [`src/data/caseRegistry.ts`](../src/data/caseRegistry.ts) (validated on load).
