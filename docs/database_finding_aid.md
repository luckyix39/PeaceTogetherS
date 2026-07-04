# Database Finding Aid
## Structured metadata for static matching against generated hypotheses

Fields: geographic coverage, date range, record types held, access type, and scope/strengths — used to match hypothetical narratives to relevant databases (no live querying; matching is a static relevance filter, per the tool's design).

---

### 1. Enslaved: Peoples of the Historical Slave Trade
**URL:** https://enslaved.org/
- **Geographic coverage:** Global (Atlantic World — Americas, Africa, Europe)
- **Date range:** 15th–early 20th century
- **Record types held:** Aggregated biographical dataset — People, Events, Places, Sources (731,500+ people records, 474,000+ events, drawn from many contributed datasets)
- **Access type:** Free
- **Scope/strengths:** Best used as a broad first pass — it aggregates many underlying datasets rather than being a single archive. Strong for cross-referencing a name/place/event across multiple contributed sources at once. Includes a "Visualizations" tool for space/time/data exploration. Not church-record-specific, but may surface church-sourced data contributed by partner projects.

---

### 2. U.S. National Archives (NARA) — African American Heritage / Slavery Records
**URL:** https://www.archives.gov/research/african-americans/slavery-records-civil.html (and related NARA pages: congressional, judicial, military records)
- **Geographic coverage:** United States (federal-level only — NARA holds federal records; most slavery-related records are actually held at state/county level, not NARA)
- **Date range:** Primarily 1861–1877 (Civil War/Reconstruction); some earlier congressional/judicial records back to 1789
- **Record types held:** Freedmen's Bureau records, Freedman's Bank records, U.S. District/Circuit Court fugitive slave case files, DC-area slavery records (1851–63), congressional petitions, military records (USCT, Buffalo Soldiers), 1850/1860 slave schedules (tallies, not names)
- **Access type:** Free (many digitized on catalog.archives.gov; some also on FamilySearch, Fold3, Ancestry)
- **Scope/strengths:** Best for the 1861–1877 gap-bridging records (Step 4 of the logic framework). Explicitly states most antebellum property/ownership records are NOT here — those are county-level. Good "which record group" reference but requires knowing the county to go further back.

---

### 3. Brown University Library — Researching Slavery and the Slave Trade (LibGuide)
**URL:** https://libguides.brown.edu/slavery
- **Geographic coverage:** Varies by linked sub-resource — Atlantic-wide (Slave Voyages), Southern U.S. (Race and Slavery Petitions), Mid-Atlantic (Georgetown/Maryland), Chesapeake/Carolinas/Caribbean (DAACS), NYC (Sydney Howard Gay's Record of Fugitives)
- **Date range:** 16th–19th century (varies by sub-resource)
- **Record types held:** This is a finding-aid/portal, not a single database. Key linked resources:
  - **Slave Voyages** (slavevoyages.org) — 35,000+ trans-Atlantic slave voyage records, ~12 million individuals transported
  - **Race and Slavery Petitions Project** (UNC Greensboro) — 15,000+ petitions by African Americans to Southern county courts
  - **Georgetown Slavery Archive** — Maryland Jesuit/Georgetown-linked enslaved people records
  - **Columbia University & Slavery** — institutional slaveholding research
  - **DAACS** (Digital Archaeological Archive of Comparative Slavery) — archaeological assemblages, Chesapeake/Carolinas/Caribbean
  - **Sydney Howard Gay's "Record of Fugitives"** — arrivals of self-liberating people, NYC, 1855–56
  - Runaway ad collections (Virginia/Maryland newspapers, 4,000+ ads)
  - WPA slave narratives compilation reference
- **Access type:** Free (most linked resources are open; some require WorldCat lookup for physical microform)
- **Scope/strengths:** Use as a portal to route to the *right specific* database once you know the likely region/era — not a single searchable index itself.

---

### 4. Slave Societies Digital Archive (SSDA) — formerly Ecclesiastical and Secular Sources for Slave Societies
**URL:** https://www.slavesocieties.org/
- **Geographic coverage:** Brazil, Cuba, Colombia, Spanish Florida (St. Augustine), with smaller collections from Angola, Benin, Cabo Verde
- **Date range:** 1594–1882 (St. Augustine collection is the oldest — oldest serial records of African-descended people in what is now the U.S.)
- **Record types held:** **Church/ecclesiastical records** — baptisms, marriages, confirmations, burials, petitions to wed, wills, annulments — plus secular municipal records (bills of sale, property registries, manumission letters, dowries)
- **Access type:** Free for most digitized images; some collections (e.g., Angola) viewable only in person at Vanderbilt
- **Scope/strengths:** **This is the primary church-records source for non-U.S.-Protestant-norm regions** (Step 5's non-U.S.-norm branch) — directly relevant for Louisiana-linked, Caribbean-linked, or Spanish Florida research. Records document ~4–6 million individuals. Entries sometimes include parents' names and African birthplace references — unusually rich for pre-1800 records. Best matched to hypotheses involving Catholic colonial contexts.

---

### 5. Mid-Hudson Antislavery History Project (MHAHP) — Vassar College
**URL:** https://mhahp.vassarspaces.net/databases-selected-resources/
- **Geographic coverage:** Northeastern U.S., focused on New York's Mid-Hudson Valley (especially Ulster County)
- **Date range:** Colonial era through abolition in NY (full abolition 1827)
- **Record types held:** Court cases, tax records, speeches, local primary sources; links out to NESRI (Northeast Slavery Records Index — individual enslaved persons/enslavers, Northeast U.S.), Slave Voyages, and Intra-American slave trade database
- **Access type:** Free
- **Scope/strengths:** Best example of a **regional/local project** — good template for the kind of hyper-local resource that may exist for other counties (like the Jackson County, MO project mentioned earlier). Strong reminder that slavery-related records exist well outside the South, and that the tool's finding aid should keep growing with county/regional projects as they're found, not just the large national ones.

---

### Carried Over From Earlier Research (already cited, keep in aid)
- **Freedmen's Bureau Search Portal** (NMAAHC) / FamilySearch Freedmen's Bureau Project — US, 1865+, free
- **Freedom on the Move** — runaway ads, US, free
- **Northeast Slavery Records Index (NESRI)** — NY/ME/NH/VT/MA/RI/CT/NJ, free
- **Digital Library on American Slavery** (UNC Greensboro) — court/legislative petitions + ~35,000 voyage records, free
- **Ancestry's 2024 newspaper collection** (183,000 individuals named in sale/runaway notices) — US, subscription
- **County-specific projects** (e.g., Jackson County, MO — launched Feb 2026) — free, pattern to watch for elsewhere

---

### Notes for Phase 3 Build
- This aid is a **starting set, not a closed list** — the tool's matching logic should be designed to accept new entries easily (same fields: coverage, date range, record types, access, notes) since regional/county projects keep appearing.
- Church records specifically split into two tracks depending on region:
  - **U.S. Protestant/mixed denominations:** no single searchable database exists; tool must point to "find the parish" logic (Step 5, U.S. branch).
  - **Catholic colonial contexts (Louisiana, Caribbean, Spanish Florida, Latin America):** SSDA is a real searchable/browsable point of entry — much stronger than the U.S. Protestant equivalent.
