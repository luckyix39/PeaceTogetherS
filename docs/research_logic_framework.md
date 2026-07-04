# Research Logic Framework
## AI-Assisted Research Tool for Enslaved Ancestors

### Purpose and Guardrails

This tool does **not** generate a narrative of what happened to a specific person as settled fact. It generates a **research checklist plus a set of hypothetical narratives**: given known facts (approximate dates, locations, names, events) and documented historical patterns, it constructs conditional accounts of what may have happened, then matches each to relevant databases using static metadata (region, era, record type) — never by querying the database itself. The tool performs no live lookups against any external database or archive.

**Hard rules for the AI layer:**
1. The tool may construct multiple hypothetical narratives — plausible accounts consistent with the user's known data and documented historical patterns — but every narrative must be explicitly labeled as a hypothesis to verify, never presented as established fact.
2. Each hypothetical narrative must be paired with the specific database(s) or record type(s) where the user could confirm or rule it out. A narrative with no verification path is not usable output.
3. Every detail in a narrative must be traceable to either (a) a fact the user provided, or (b) a documented historical pattern (a record type known to exist for that era/place, a known migration route, a known legal change) — never invented specific detail (no invented names, no invented dialogue, no invented specific dates/events not grounded in a pattern).
4. Narratives are framed conditionally throughout ("may have," "records from this era often show," "if X, then Y would be expected") — never in a settled past tense that implies confirmed fact.
5. When historical context (a migration wave, a war, a legal change) is used to build a hypothesis, the tool states the historical fact and how it supports that specific hypothesis, so the user can judge its strength.
6. If inputs are too sparse to construct a meaningfully distinct set of hypotheses, the tool says so and falls back to Step 0 follow-up questions rather than filling gaps with generic-sounding but unsupported narrative detail.

---

### Step 0 — Follow-Up Questions When Inputs Are Sparse

If the user's initial inputs aren't enough to narrow the search meaningfully, the tool asks targeted follow-up questions rather than stopping. Each question comes with plausible answer options specific to the region/era, so the user isn't stuck guessing at a blank field. Examples:

- *Missing enslaver denomination, location known to be colonial Louisiana:* "What was the likely religious affiliation of the household? Common in this region/era: Catholic (French or Spanish colonial parish), Protestant (after U.S. acquisition, post-1803)."
- *Missing denomination, location in the antebellum Upper South (e.g., Virginia, Maryland):* "Common in this region/era: Anglican/Episcopal, Baptist, Methodist, Presbyterian, Catholic (less common outside Maryland)."
- *Missing region/era entirely, only a family surname known:* "Do you know roughly when the family transitioned from enslaved to free status? Options: before 1865 (manumission), 1865 (general emancipation), unknown."

The options offered are drawn from documented denominational/settlement patterns for that specific place and time — not generic guesses — so the follow-up itself is doing research work, not just collecting form data.

---

### Non-U.S.-Norm Regions (Louisiana, Caribbean-linked, other colonial contexts)

For regions outside the Protestant/Catholic U.S. norm (French/Spanish Louisiana, Caribbean-linked families, other colonial contexts):
1. Check church/parish sacramental records first, regardless of region — colonial Catholic record-keeping is often the most systematic and earliest-starting source available (see Step 5 below), including in early Spanish Florida and French/Spanish Louisiana.
2. If no relevant church records surface, fall back to the standard record-type ladder in Step 4 (deeds, estate records, colonial-era civil registries where applicable, etc.), adapted to whatever civil record-keeping system governed that colony (Spanish/French civil law records differ structurally from English common-law county records).
3. The tool should flag explicitly when it's operating outside the U.S. Protestant/Catholic default, so the user knows the record ladder has shifted.

---

### Input Fields (v1)

- Approximate birth/death years or range (can be inferred from later records, e.g. 1870 census age)
- Last known location(s) — state, county, and town/parish if known
- Known names: the person, family members, suspected or known enslaver
- Known religious affiliation (of the person or, more often, the likely enslaver) — optional
- Any known events: sale, migration, runaway attempt, military service, manumission
- Migration path, if partially known (e.g., "family believed to have moved from Virginia to Missouri")

---

### Core Reasoning Steps

**Step 1 — Anchor to 1870.**
If the person or a descendant appears in the 1870 census, treat this as the anchor point: first record where the person is named individually. Everything before 1870 is inferred through *the enslaver's* records, not the person's own.

**Step 2 — Identify the pre-1870 gap type.**
- If no 1870-or-later record exists yet: recommend census research (1870–1940) to establish the anchor first.
- If an anchor exists: proceed to enslaver identification.

**Step 3 — Enslaver identification (if not already known).**
- Apply the "neighbor method": in the 1870 census, list landowning households within ~10 pages (before and after) of the person's entry. These are candidate former enslavers.
- Cross-reference candidate names against county deeds, wills, estate inventories, and tax lists for the relevant years.
- Flag surname continuity as a weak signal only — freed people sometimes kept an enslaver's surname, but not always, and the tool must not treat this as confirmation.
- **Caution list — post-emancipation chosen surnames:** names like Freeman, Freedman, Newman, Justice, and similar symbolic names were disproportionately *chosen* at emancipation rather than inherited from an enslaver. If the user's known surname falls in this pattern, the tool should flag it as a poor lead for enslaver identification and prioritize other identifying details (location, approximate age, family composition) instead of searching for a landowner with that surname.

**Step 4 — Record-type mapping by era and place.**
For the known date range and location, output which record types are plausible:

| Era | Record types likely to exist | Notes |
|---|---|---|
| Pre-1850 | Deeds, wills, estate inventories, tax lists, church sacramental records | No census names for enslaved individuals before 1870 |
| 1850–1860 | + Slave schedules (1850, 1860 federal census) | Named only by tally under enslaver — do NOT expect individual names here |
| 1861–1865 | + Fugitive Slave Act case files, wartime records | Available where U.S. District/Circuit court records survive |
| 1865–1870 | + Freedmen's Bureau records, Freedman's Bank records, cohabitation records | Cohabitation records confirm pre-emancipation unions |
| 1870+ | + Federal census by name, church records continue, WPA slave narratives (1930s) | First point of individual naming |

**Step 5 — Church record path (new).**
- Identify the likely denomination/congregation of the *enslaver* (not the enslaved person) based on location and era — this is the parish whose sacramental books to search.
- Recommend checking: baptism, marriage, confirmation, and burial/death records.
- Flag that Catholic parish records are often the most systematic and can predate U.S. civil registration entirely; Protestant/Baptist records vary more but may include membership rolls or burial records.
- Flag that many regions kept **separate baptismal/burial books by race or status** — the tool should note this as a research fact (helps the user know what to ask an archive for) without inventing which book applies.
- Flag that these records are usually **not name-indexed electronically** — the practical next step is identifying the specific parish via the enslaver's residence, not searching a global database.

**Step 6 — Historical-event cross-reference.**
Maintain a timeline of major events that affect record availability and likely movement, e.g.:
- Domestic slave trade shifts after 1808 (international trade banned → increased interstate/domestic sales, especially Upper South → Deep South)
- Forced migrations tied to specific wars, land cessions, or territorial expansion
- State-specific emancipation dates (gradual abolition in the North vs. 1865 in the South)
- Local county formation dates (affects which county holds relevant records if boundaries changed)

The tool uses this timeline only to explain *why* a record type might or might not exist, or *why* a migration might have happened — e.g., "if the family disappears from records in [county] around [year], the domestic slave trade routes active in this period moved people from [region] to [region] — worth checking [database] for the destination region," not "the person was sold to X."

**Step 6.5 — Database discovery (static + dynamic).**
Database matching draws from two sources, used together:
- **Static finding aid**: a curated, structured set of known databases (see companion document `database_finding_aid.md`), each tagged with geographic coverage, date range, record types, access type, and notes.
- **Live web search for additional databases**: the tool is not limited to the finding aid. It may search the web for other relevant databases/archives not yet catalogued — including crawling aggregator or portal pages (e.g., a university LibGuide) to surface the specific databases *they* link to, not just citing the aggregator itself as the answer. This is discovery of database *descriptions* and metadata only — it is never a live lookup of a specific person's name or record within any database (that restriction, established earlier, still holds). Any newly discovered database should ideally be added back into the finding aid for reuse.

Both sources feed the same matching logic in Step 7: relevance is judged by metadata (region, era, record type), not by querying the database itself.

**Critical rule — no silent substitution:** if the static finding aid has no genuine region/era match for a hypothesis (e.g., a Louisiana Catholic case where the aid's only ecclesiastical entry covers Brazil/Cuba/Colombia/Spanish Florida but not Louisiana), the tool must say so explicitly — "no direct match in the curated aid" — before offering any live-search-derived alternative. The user must always be able to tell a vetted finding-aid match apart from a freshly surfaced, unvetted one. Never stretch a loosely-related entry to look like a fit just because it shares a broad category (e.g., "Catholic colonial") with the hypothesis.

**Step 7 — Output.**
Two linked components, always presented together. Neither involves querying any external database live — both are generated from (a) the historical-event timeline and user-provided facts, and (b) static metadata about known databases (the finding aid), matched by region/era/record type.

1. **A checklist**: record types to check (ranked by likelihood), specific databases/archives for each, search terms to try (surname candidates, county, parish), and the historical reasoning behind each suggestion — kept separate from user-provided facts.
2. **2–4 hypothetical narratives**: short, explicitly conditional accounts of what *may* have happened, each built only from user-provided facts plus documented historical patterns (never invented specifics). **This range is a ceiling, not a quota** — if the input is too thin to support multiple genuinely distinct hypotheses, the tool should generate fewer (even just one) rather than padding out redundant or overly similar narratives to hit a target count. Each narrative is paired with database(s) selected by matching the narrative's implied era/region/record-type against the finding aid's metadata (not a live search of the database itself — a static relevance match). Narratives that match the same database should be flagged as such (e.g., "hypotheses 1 and 2 both point to the same parish register — check there first").

Example shape:
> **Hypothesis:** If the family disappears from [county] records after [year], they may have been sold or relocated as part of the domestic slave trade routes active in that period, which commonly moved people from [region] toward [region]. **Related database:** [database name], selected because it covers [region]/[date range]/[record type] — matches this hypothesis's implied search area. (This is a pointer to check manually, not a completed search.)

---

### Record Type Reference Table (for the tool's knowledge base)

- Deeds, wills, estate inventories, tax lists — county-level, often earliest documentation
- Slave schedules (1850/1860) — tallies only, not names
- Freedmen's Bureau records — post-1865, links pre/post-Civil War records
- Freedman's Bank records — post-1865, financial/family details
- Cohabitation records — post-emancipation, confirms pre-emancipation unions
- Church/parish sacramental records — baptism, marriage, confirmation, burial; tied to enslaver's congregation
- WPA slave narratives (1930s) — first-person accounts, later era
- Runaway advertisements / "Freedom on the Move" — self-liberation attempts
- Fugitive Slave Act case files — federal court records, 1793/1850 acts
- Cemetery and Bible records — private, often family-held

---

### Open Questions for Next Iteration
- How to handle regions/denominations outside U.S. Protestant/Catholic norms (e.g., French/Spanish colonial Louisiana, Caribbean-linked families)?
- How to represent confidence level in the output (e.g., "high confidence record type exists" vs "possible, but rare for this region")?
- Should the tool ask follow-up questions when inputs are sparse, or just state limitations and stop?
