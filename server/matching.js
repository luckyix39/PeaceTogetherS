/**
 * Static matching layer.
 *
 * This module NEVER queries any external database for a person's record.
 * It only filters the curated finding aid by metadata (coverage / date range /
 * record types) against a hypothesis's implied search area. This is the
 * "no silent substitution" rule from the logic framework: a hypothesis with
 * no genuine match must say so, not receive a loosely-related entry dressed
 * up as a fit.
 */

/**
 * @param {object} query
 * @param {string[]} query.coverage - region tags to match against, e.g. ["louisiana"]
 * @param {number} query.yearStart - earliest year of interest
 * @param {number} query.yearEnd - latest year of interest
 * @param {string[]} query.recordTypes - record type tags of interest, e.g. ["church-baptism"]
 * @param {object[]} findingAid - the loaded findingAid.json array
 * @returns {{matches: object[], noMatch: boolean}}
 */
function matchFindingAid(query, findingAid) {
  const { coverage = [], yearStart, yearEnd, recordTypes = [] } = query;

  const matches = findingAid.filter((entry) => {
    const coverageOverlap =
      coverage.length === 0 ||
      coverage.some((tag) => entry.coverage.includes(tag));

    const dateOverlap =
      yearStart === undefined ||
      yearEnd === undefined ||
      (entry.dateRange[0] <= yearEnd && entry.dateRange[1] >= yearStart);

    const recordTypeOverlap =
      recordTypes.length === 0 ||
      recordTypes.some((tag) => entry.recordTypes.includes(tag));

    // Require ALL THREE to overlap. This is deliberately strict: coverage
    // is the dimension most prone to false positives (e.g. "Catholic colonial"
    // matching SSDA even when the specific region, like Louisiana, isn't listed).
    return coverageOverlap && dateOverlap && recordTypeOverlap;
  });

  return {
    matches,
    noMatch: matches.length === 0,
  };
}

/**
 * Applies matchFindingAid to each hypothesis produced by the model and
 * annotates it with either real matches or an explicit no-match flag,
 * so the API layer can never present an unmatched hypothesis as matched.
 */
function annotateHypothesesWithMatches(hypotheses, findingAid) {
  return hypotheses.map((hyp) => {
    const { matches, noMatch } = matchFindingAid(hyp.searchArea || {}, findingAid);
    return {
      ...hyp,
      findingAidMatches: matches.map((m) => ({ id: m.id, name: m.name, url: m.url })),
      noFindingAidMatch: noMatch,
    };
  });
}

module.exports = { matchFindingAid, annotateHypothesesWithMatches };
