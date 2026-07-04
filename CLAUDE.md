# Project context for Claude Code

This file exists so a fresh Claude Code session can pick up this project without
re-deriving the design decisions from scratch. Read this fully before making changes,
especially the "Hard rules" section — they are not implementation details, they are
the actual point of the project.

## What this is

A web tool that helps genealogists researching enslaved ancestors figure out **where to
look next**, not what happened. Given known facts (dates, location, names, denomination,
events), it generates:
1. A research checklist (which record types are likely to exist and why)
2. Up to 4 explicitly conditional hypotheses about what may have happened, each tied to
   real historical patterns
3. Database/archive matches for each hypothesis, drawn from a curated finding aid plus
   optional live web search for additional databases

It is deliberately **not** a genealogy-fact generator. It never claims to have found a
specific person's actual history. Every hypothesis is phrased conditionally and paired
with a place the user can go verify it themselves.

## Why this design exists (read before changing the rules)

Enslaved people's records are mostly silent by design — before the 1870 U.S. census they
usually weren't named as individuals, so a naive AI tool asked to "tell a person's story"
will fabricate a plausible-sounding but false biography, and a descendant could easily
mistake that for real information. Every hard rule below exists specifically to prevent
that failure mode. If you're asked to relax one of these rules, push back or flag it
explicitly rather than quietly loosening it — that's the actual risk in this project, not
a bug to be optimized away.

## Hard rules (encoded in `server/systemPrompt.js`, enforced partly in `server/matching.js`)

1. Never assert a specific enslaver, event, or biographical detail as settled fact —
   only what the user provided, or a documented historical pattern.
2. Hypotheses are always phrased conditionally ("may have," "records often show") —
   never settled past tense.
3. No invented specific names, dates, dialogue, or events beyond the user's input or a
   named historical pattern.
4. "Up to 4 hypotheses" is a **ceiling, not a quota** — thin input should produce fewer,
   more honestly hedged hypotheses, not padded redundant ones.
5. Watch for post-emancipation **chosen** surnames (Freeman, Freedman, Newman, Justice,
   etc.) — flag these as weak leads for enslaver identification, not inherited names.
6. **No silent substitution**: if the curated finding aid has no genuine region/era match
   for a hypothesis, the tool must say so explicitly before offering any live-search-
   derived alternative. This is enforced in code, not just prompt — see
   `server/matching.js`, which requires coverage AND date-range AND record-type overlap,
   all three, before counting something as a match. (The concrete case this guards
   against: a Louisiana Catholic hypothesis must NOT match the Slave Societies Digital
   Archive, which covers Brazil/Cuba/Colombia/Spanish Florida but not Louisiana, just
   because both are "Catholic colonial." See `server/matching.test.js` for the regression
   test.)
7. The tool never performs a live lookup of a specific named person in any archive. Web
   search is used only to discover/describe databases that exist, never to look up "did
   this person actually appear in X."
8. Church records split into two tracks: for U.S. Protestant/mixed-denomination contexts,
   there's no single searchable database — the tool should say so and point to identifying
   the likely parish (tied to the **enslaver's** denomination, not an assumed present-day
   Black church). For Catholic colonial contexts (Louisiana, Caribbean, Spanish Florida,
   Latin America), a real searchable archive may exist, but only the deterministic
   matching step confirms actual coverage — never assume from category alone.
9. Anchor to the 1870 U.S. census as the first point where formerly enslaved individuals
   are typically named individually in federal records. Pre-1870 research runs through the
   *enslaver's* records, not the person's own.
10. If input is too sparse to build a meaningful search area, ask a follow-up question
    with concrete, region/era-appropriate answer options — don't guess.

Full rationale and additional detail lives in `docs/research_logic_framework.md`. If you
change behavior in `systemPrompt.js` or `matching.js`, update that doc to match, and vice
versa — they're meant to stay in sync (the code is the "executable version" of the doc).

## Architecture

```
server/
  index.js              Express app, /api/research endpoint, /api/health
  matching.js            Deterministic finding-aid matching — NO LLM, NO live lookups.
                          Requires coverage + date-range + record-type overlap (all three)
                          before counting a match. This is the enforcement point for rule 6.
  matching.test.js        Regression tests for matching.js (run with `npm test`, no API key
                          needed). Includes the Louisiana/SSDA false-positive case and a
                          New York/MHAHP true-positive case.
  systemPrompt.js          The hard rules above, written as an LLM system prompt. Also
                          defines the required JSON output shape (see below).
  anthropicClient.js       Wraps the Anthropic API call. Model comes from
                          ANTHROPIC_MODEL env var, defaults to "claude-sonnet-5". Enables
                          the web_search_20250305 tool (discovery only, see rule 7).
                          max_tokens is 4096 — was 2000, got bumped after a real truncation
                          bug (see "Known issues, fixed" below).
  data/findingAid.json      Machine-readable version of docs/database_finding_aid.md.
                          Each entry: coverage[], dateRange[2], recordTypes[], access,
                          isPortal, notes.
public/
  index.html, app.js, style.css   Minimal test frontend — plain HTML/JS, no framework.
                                  Not styled/polished, built to validate the loop works.
docs/
  research_logic_framework.md   Full design doc — the "why" behind every rule.
  database_finding_aid.md       Human-readable version of findingAid.json, with notes on
                                 each source's strengths/gaps (worth reading — explains
                                 *why* SSDA doesn't cover Louisiana, why church records
                                 split into two tracks, etc.)
  phase2_test_cases.md          Five test cases run against the logic before any code was
                                 written — this is where rules 4, 5, and 6 above came from.
                                 Useful if you're ever unsure why a rule exists.
railway.json                Deploy config for Railway (Nixpacks auto-detects Node).
.env.example                Copy to .env, fill in ANTHROPIC_API_KEY.
```

## API contract

`POST /api/research` — body is a free-form JSON object of whatever the user knows
(currently the frontend sends `location`, `dateRange`, `names`, `denomination`, `events`
as strings — this is intentionally loose since Phase 1 didn't lock down a strict schema
per field).

Response shape (see `systemPrompt.js` for the authoritative version):
```json
{
  "needsFollowUp": false,
  "checklist": [ { "recordType": "string", "why": "string" } ],
  "hypotheses": [
    {
      "text": "string",
      "confidence": "low | medium | high",
      "searchArea": { "coverage": ["string"], "yearStart": 0, "yearEnd": 0, "recordTypes": ["string"] },
      "findingAidMatches": [ { "id": "string", "name": "string", "url": "string" } ],
      "noFindingAidMatch": false,
      "discoveredDatabases": [ { "name": "string", "url": "string", "note": "string" } ]
    }
  ]
}
```
or, if input was too sparse:
```json
{ "needsFollowUp": true, "followUpQuestions": [ { "question": "string", "options": ["string"] } ] }
```

`findingAidMatches` / `noFindingAidMatch` are added server-side by `matching.js` after the
model returns — the model only produces `searchArea`, it doesn't pick databases itself.
Don't let the model choose databases directly; that would defeat the point of rule 6.

## Current status

- Phase 1 (logic framework) and Phase 2 (hand-tested cases) are done — see docs/.
- Phase 3 (real matching layer + API + minimal frontend) is built and passes
  `npm test`. Confirmed working end-to-end with a real API key by the project owner
  (a Fairfield, CT / colonial New England case returned real hypotheses — candidate
  enslavers "Hannah Osborn" and "Ebenezer Banks" for an enslaved person "Cesar" — before
  hitting a truncation bug).

### Known issues, fixed
- **Truncation bug**: `max_tokens` was 2000, model responses were getting cut off
  mid-JSON on detailed cases, causing `JSON.parse` to fail. Fixed by raising to 4096 and
  adding an explicit 2-3 sentence cap on `why`/`text` fields in the prompt. If truncation
  ever reappears (very detailed cases, verbose model output), raise `max_tokens` further
  before doing anything else — that's almost certainly the cause.

### Not yet built / open work
- No persistent storage — each request is stateless, nothing is saved between sessions.
- No refinement loop — if a hypothesis's `noFindingAidMatch` is true, the user can't yet
  ask the tool to search harder or provide more detail specifically for that hypothesis.
- Finding aid has only ~9 entries (`server/data/findingAid.json`) — the docs note several
  more sources exist (Freedmen's Bank, WPA narratives, county-specific projects like
  Jackson County, MO) that haven't been added yet. Growing this file is high-value,
  low-risk work — it's just data, doesn't touch the rules above.
- Frontend is deliberately unstyled/minimal (plain HTML/JS) — was built to prove the loop
  works, not as a real UI. A design pass is expected before this is a real deliverable.
- No tests yet for `systemPrompt.js`/`anthropicClient.js` beyond the manual test above —
  `matching.test.js` only covers the deterministic layer, not the model's actual behavior
  against the hard rules. Worth adding eval-style tests eventually (e.g., feed known
  sparse input, assert `needsFollowUp` is true; feed a chosen-surname case, assert the
  model flags it per rule 5).

## Local dev

```bash
npm install
cp .env.example .env      # then add your own ANTHROPIC_API_KEY
npm test                  # matching logic only, no API key needed
npm start                 # visit http://localhost:3000
```

## Deployment target

GitHub → Railway. `railway.json` is already configured for Railway's Nixpacks builder
(auto-detects Node, runs `npm install && npm start`). Set `ANTHROPIC_API_KEY` as an
environment variable in the Railway project settings — never commit it.
