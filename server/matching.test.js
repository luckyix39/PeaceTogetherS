const { matchFindingAid } = require('./matching');
const findingAid = require('./data/findingAid.json');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exitCode = 1;
  } else {
    console.log('PASS:', message);
  }
}

// Case 4 from Phase 2 testing: Louisiana Catholic case must NOT match SSDA,
// since SSDA's coverage list is Brazil/Cuba/Colombia/Spanish Florida only.
const louisiana = matchFindingAid(
  {
    coverage: ['louisiana'],
    yearStart: 1800,
    yearEnd: 1830,
    recordTypes: ['church-baptism', 'church-marriage'],
  },
  findingAid
);
assert(louisiana.noMatch === true, 'Louisiana + church records correctly produces no finding-aid match (SSDA does not cover Louisiana)');
assert(
  !louisiana.matches.some((m) => m.id === 'slave-societies-digital-archive'),
  'SSDA is not falsely matched for Louisiana'
);

// Case 3 from Phase 2 testing: Ulster County, NY should match MHAHP and NESRI.
const newYork = matchFindingAid(
  {
    coverage: ['new-york', 'ulster-county'],
    yearStart: 1790,
    yearEnd: 1827,
    recordTypes: ['court-cases', 'individual-records'],
  },
  findingAid
);
assert(
  newYork.matches.some((m) => m.id === 'mhahp'),
  'Ulster County, NY correctly matches MHAHP'
);

// Spanish Florida + church-burial in range should match SSDA correctly (true positive check).
const florida = matchFindingAid(
  {
    coverage: ['spanish-florida'],
    yearStart: 1700,
    yearEnd: 1800,
    recordTypes: ['church-burial'],
  },
  findingAid
);
assert(
  florida.matches.some((m) => m.id === 'slave-societies-digital-archive'),
  'Spanish Florida + church-burial correctly matches SSDA (true positive control)'
);

console.log('\nDone.');
