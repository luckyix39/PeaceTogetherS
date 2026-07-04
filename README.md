# Enslaved Ancestor Research Assistant

Generates a research checklist and a small set of explicitly conditional hypotheses to help
narrow down where to look for records on an enslaved ancestor — never a claim of confirmed fact.

See `docs/research_logic_framework.md` for the full design rationale and hard rules, and
`docs/database_finding_aid.md` for the human-readable version of the curated database list
(machine-readable version lives in `server/data/findingAid.json`).

## How it works

1. User submits known facts (location, date range, names, denomination, events).
2. The model (Claude, via the Anthropic API) either asks region/era-specific follow-up
   questions (if input is too sparse) or returns a checklist plus up to 4 conditional
   hypotheses, each with a `searchArea` (region/date/record-type tags).
3. The server deterministically matches each hypothesis's `searchArea` against the curated
   finding aid (`server/matching.js`) — no LLM involved in this step, so a hypothesis can
   never be silently paired with a loosely-related database it doesn't actually match.
4. If there's no finding-aid match, the model may separately surface databases found via live
   web search — always labeled as unvetted, never conflated with a curated match.
5. The tool never performs a live lookup of the specific person in any external database.

## Local setup

```bash
npm install
cp .env.example .env
# edit .env and add your own ANTHROPIC_API_KEY
npm start
```

Visit http://localhost:3000

## Running the matching-logic tests (no API key required)

```bash
npm test
```

This checks the deterministic matching layer only — e.g. that a Louisiana query does not
falsely match the Slave Societies Digital Archive (which covers Brazil/Cuba/Colombia/Spanish
Florida, not Louisiana), and that a New York query correctly matches MHAHP.

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Add an environment variable `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the
   Railway project settings — never commit the real key to the repo.
4. Railway's Nixpacks builder auto-detects Node and runs `npm install && npm start`
   (see `railway.json`).

## Project structure

```
server/
  index.js            Express app + /api/research endpoint
  matching.js          Deterministic finding-aid matching (no LLM, no live lookups)
  matching.test.js      Tests for the matching logic
  systemPrompt.js       The executable version of the logic framework's hard rules
  anthropicClient.js     Anthropic API call wrapper (web search enabled for db discovery only)
  data/findingAid.json   Machine-readable curated database list
public/
  index.html, app.js, style.css   Minimal frontend for testing the full loop
docs/
  research_logic_framework.md, database_finding_aid.md, phase2_test_cases.md
```
