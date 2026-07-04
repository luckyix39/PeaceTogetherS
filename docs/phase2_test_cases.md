# Phase 2 — Test Cases

Testing the logic framework (research_logic_framework.md) and finding aid (database_finding_aid.md) against five deliberately varied cases: a sparse-input case, a straightforward U.S. antebellum case, a Northeast case with strong database coverage, a Louisiana Catholic case designed to test the non-U.S.-norm branch, and a Caribbean-linked case designed to expose coverage gaps. The goal is to see where the logic holds up and where it's too generic, wrong, or missing something — not to produce a polished demo.

---

## Case 1 — Sparse input (tests Step 0: follow-up questions)

**User input:** "Family surname Freeman. Believed to have been freed by 1870. Don't know where."

**Tool process:**
- Location and denomination are both missing — too sparse to run Step 3 (enslaver ID) or Step 5 (church records) meaningfully.
- Per Step 0, the tool asks follow-up questions with plausible options rather than stopping cold:
 - "Do you have any record of the family after 1870 — a census entry, a death certificate, an obituary — that names a state or county?" *(This is the actual blocking question; nothing else can proceed without it.)*
 - "Is 'Freeman' a name the family took after emancipation, or one used earlier?" Options: *taken after emancipation (common practice)*, *used earlier / unsure*. (This matters because a post-emancipation chosen surname, common for people who selected symbolic names like Freeman, Freedman, or Newman at emancipation, means the surname is a poor lead for finding a pre-1865 enslaver — the tool should flag this rather than searching for a "Freeman" plantation owner.)

**Result:** No checklist or hypotheses generated yet — correctly stops at follow-up questions rather than inventing a location.

**What this revealed:** The logic worked as designed, but exposed a gap not in the original framework: surnames like "Freeman" are disproportionately likely to be *chosen* names rather than inherited enslaver names, and the tool should know this as a named pattern, not just handle it ad hoc. **Recommend adding this to Step 3** (surname continuity is flagged as a weak signal — should explicitly list common post-emancipation chosen surnames as a caution).

---

## Case 2 — U.S. antebellum South, moderate detail (tests Steps 1–5, U.S. church branch)

**User input:** "Ancestor appears in the 1870 census in Loudoun County, Virginia, surname Carter, approx. age 40 (so born ~1830). Family believed Baptist."

**Tool process:**
- **Step 1–2:** 1870 anchor exists → proceed to enslaver identification.
- **Step 3:** Apply neighbor method — list landowning Carters and other households within ~10 census pages of the entry in Loudoun County's 1870 census; cross-reference against Loudoun County deed and will indexes for the 1850s–60s.
- **Step 4:** Record-type ladder for 1830–1870 Virginia: deeds/wills/estate inventories (pre-1850), slave schedules (1850/1860, tallies only, flag explicitly not name-searchable), Freedmen's Bureau records (Virginia had active Bureau field offices), cohabitation records (Virginia required registration of pre-emancipation marriages in 1866).
- **Step 5:** Denomination given as Baptist — tool notes Baptist congregations kept less systematic sacramental records than Catholic parishes, but recommends checking church membership/burial rolls for Loudoun-area Baptist congregations active in the 1850s–60s, and flags that the *enslaver's* congregation (likely also Baptist or another Protestant denomination, not necessarily the same one) is the one to search, not an assumed present-day Black Baptist church (those largely formed post-emancipation).
- **Step 6:** Historical context check: Loudoun County is Upper South — flag the domestic slave trade pattern (Upper South → Deep South sales increased after 1808) as a plausible reason for any unexplained disappearance from records between 1830–1860, if that turns out to be relevant.

**Hypotheses generated (example):**
1. *"The Carter family were enslaved by a landowning Carter household in Loudoun County — surname continuity plus proximity in the 1870 census is suggestive but not confirmed. Related records: Loudoun County deed/will indexes (via Library of Virginia); NARA Freedmen's Bureau Virginia field office records."*
2. *"If the family cannot be traced to a Carter landowner, they may have taken the surname from a prior enslaver, employer, or through free choice at emancipation — worth checking Loudoun County tax and personal property records for any household, Carter or otherwise, matching the family's known composition in 1860."*

**Result:** This case worked cleanly — real county, real record types, plausible hypotheses with actual verification paths (Library of Virginia, NARA). The framework's core design (1870 anchor → neighbor method → record ladder → church branch → hypotheses) held up well here because it's the case the framework was originally built around.

---

## Case 3 — Northeast, strong database match (tests finding aid fit)

**User input:** "Family lived in Ulster County, New York, before New York's abolition in 1827. Surname Van Wagenen."

**Tool process:**
- Step 6 flags immediately: this predates the 1870 anchor entirely and predates most of the standard U.S. South-focused record ladder — New York had its own gradual abolition timeline (full abolition 1827), so the tool needs to note it's using a different legal/historical timeline than the antebellum South cases.
- Step 4 record types shift: pre-1827 New York manumission records, county-level slave records (NY required registration of enslaved births under gradual abolition law), church records (Dutch Reformed church records are common and often well-preserved in this region), local historical society/project records.
- Database discovery: MHAHP (Mid-Hudson Antislavery History Project) is a near-perfect static-finding-aid match — same county, right era, court/tax record holdings. NESRI (Northeast Slavery Records Index) also matches on region.

**Hypotheses generated (example):**
1. *"The family may appear in Ulster County's gradual-abolition-era birth registrations, since New York law required enslavers to register children born to enslaved mothers after 1799. Related database: MHAHP's local resources and NESRI."*
2. *"Dutch-descended landowning families were common enslavers in this region; if 'Van Wagenen' is the enslaver's surname rather than the family's own, county tax and church records under that name may be productive. Related database: MHAHP; Ulster County historical society records (would require a live search to confirm current holdings, since MHAHP's page is a portal, not the archive itself)."*

**Result:** Strong match — this is the case type the aid handles best. Confirms that having a genuinely regional resource in the finding aid produces sharper, more specific hypotheses than the national-level ones. Also correctly noted MHAHP is a portal, consistent with the "aggregators are portals, not single databases" caveat already in the aid.

---

## Case 4 — Louisiana, Catholic, non-U.S.-norm branch (tests Step 5's non-U.S. branch — and its limits)

**User input:** "Family from St. Landry Parish, Louisiana. Believed enslaved by a Catholic French Creole family. Records seem to disappear after the 1820s."

**Tool process:**
- Step 5 non-U.S.-norm branch triggers correctly: Catholic colonial context, French/Spanish Louisiana → check church/parish sacramental records first, per the framework's rule.
- **Database discovery attempted a match against SSDA (Slave Societies Digital Archive) — and this is where the test found a real gap.** SSDA's stated coverage is Brazil, Cuba, Colombia, and Spanish Florida — it does **not** list Louisiana. A naive matching step could easily have offered SSDA anyway because "Catholic colonial" sounds like a fit — that would have been a false positive.
- Correct behavior (what the tool should do): state plainly that the curated finding aid doesn't have a Louisiana-specific ecclesiastical database, then fall back to Step 6.5's live search branch — searching the web for Louisiana-specific Catholic diocesan archives (e.g., Diocese of Lafayette or Archdiocese of New Orleans sacramental records, both of which are known in general genealogical practice to hold relevant colonial-era baptism/marriage/burial registers for enslaved people) rather than forcing an ill-fitting match from the static aid.
- Step 6 historical cross-reference: the 1820s disappearance lines up with a known domestic slave trade acceleration period; the tool should surface this as a hypothesis but explicitly flag that it's using a broad national pattern, not Louisiana-specific data, so the user should weigh it as a lower-confidence hypothesis than the church-records lead.

**Result:** This case is the most valuable failure-mode test so far. **It confirms the static aid must not be stretched to cover a region it doesn't actually list**, and that Step 6.5 (live search) needs to be a genuine fallback the tool actively uses here, not an afterthought. **Recommend making this explicit in the framework**: when the static aid has no in-region match, the tool must say so before offering a live-search-derived alternative, so the user can tell the difference between a vetted match and a freshly surfaced one.

---

## Case 5 — Caribbean-linked migration (tests cross-border gap + hypothesis discipline)

**User input:** "Family oral history says an ancestor came from Jamaica before appearing in South Carolina records around 1800. No other detail."

**Tool process:**
- This is a genuinely hard case with very little to anchor on. Step 0 should trigger a follow-up question here rather than jumping to hypotheses: "Do you know roughly how the ancestor came to South Carolina — purchased/sold, a Loyalist enslaver relocating after the American Revolution, or unknown?" with those options offered because Jamaica-to-South-Carolina movement in this era is disproportionately linked to Loyalist relocations after 1783 and to the broader Caribbean-to-mainland slave trade — a genuine historical pattern, not a guess.
- If the user has no further detail, the tool should generate at most one cautious hypothesis (not the usual 2–4), explicitly noting the input is too thin to differentiate multiple scenarios, and should say so rather than padding out three similar-sounding narratives to hit a target count.
- Database discovery: none of the five aid entries cover Jamaica-specific or Caribbean-to-Carolina migration well. Slave Voyages (linked via the Brown portal) covers the Atlantic trade broadly and could show general Jamaica-Carolina shipping patterns for the era, but wouldn't name this specific family. This should be stated as a partial, general-pattern match, not a personalized lead.

**Result:** This exposed an important discipline check: **the tool should not force itself to produce 2–4 hypotheses when the input can't actually support that many distinct, non-redundant ones.** The "2–4 narratives" language in Step 7 needs a caveat that it's a ceiling, not a quota.

---

## Summary of Framework Adjustments Needed

1. **Step 3:** Add an explicit caution list of common post-emancipation chosen surnames (Freeman, Freedman, Newman, etc.) so surname-continuity reasoning doesn't chase a name the family chose rather than inherited.
2. **Step 6.5 / Step 7:** When the static finding aid has no genuine regional/era match, the tool must say so explicitly before offering a live-search-derived alternative — never silently substitute a loosely-related database as if it were a confirmed fit (this is what almost happened with Louisiana + SSDA).
3. **Step 7:** "2–4 hypotheses" is a ceiling, not a quota — thin input should produce fewer, more honestly-hedged hypotheses rather than padded ones.
4. **General:** cases with strong regional finding-aid matches (Northeast, via MHAHP/NESRI) produced noticeably better output than cases relying only on national-level resources — reinforces that growing the finding aid with regional/county projects (as already noted) is high-value work, not a nice-to-have.
