const form = document.getElementById('research-form');
const resultsEl = document.getElementById('results');
const followupEl = document.getElementById('followup');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultsEl.classList.add('hidden');
  followupEl.classList.add('hidden');
  errorEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    loadingEl.classList.add('hidden');

    if (!res.ok) {
      errorEl.textContent = data.error || 'Something went wrong.';
      errorEl.classList.remove('hidden');
      return;
    }

    if (data.needsFollowUp) {
      renderFollowUp(data.followUpQuestions);
    } else {
      renderResults(data);
    }
  } catch (err) {
    loadingEl.classList.add('hidden');
    errorEl.textContent = 'Network error: ' + err.message;
    errorEl.classList.remove('hidden');
  }
});

function renderFollowUp(questions) {
  followupEl.innerHTML = '<h2>A few more details would help</h2>' +
    questions.map(q => `
      <div class="card">
        <p>${escapeHtml(q.question)}</p>
        <p><em>Options to consider: ${q.options.map(escapeHtml).join(', ')}</em></p>
      </div>
    `).join('');
  followupEl.classList.remove('hidden');
}

function renderResults(data) {
  const checklistHtml = data.checklist.map(item => `
    <div class="card">
      <strong>${escapeHtml(item.recordType)}</strong>
      <p>${escapeHtml(item.why)}</p>
    </div>
  `).join('');

  const hypothesesHtml = data.hypotheses.map(hyp => `
    <div class="card confidence-${hyp.confidence || 'low'}">
      <p>${escapeHtml(hyp.text)}</p>
      <p><em>Confidence: ${escapeHtml(hyp.confidence || 'unspecified')}</em></p>
      ${renderMatches(hyp)}
    </div>
  `).join('');

  resultsEl.innerHTML = `
    <h2>Research checklist</h2>
    ${checklistHtml || '<p>No checklist items generated.</p>'}
    <h2>Hypotheses to verify</h2>
    ${hypothesesHtml || '<p>No hypotheses generated.</p>'}
  `;
  resultsEl.classList.remove('hidden');
}

function renderMatches(hyp) {
  if (hyp.noFindingAidMatch) {
    let html = '<p class="no-match">No direct match in the curated finding aid for this search area.</p>';
    if (hyp.discoveredDatabases && hyp.discoveredDatabases.length) {
      html += '<p class="match-list"><strong>Possibly relevant (from live search, unvetted):</strong><br>' +
        hyp.discoveredDatabases.map(d => `<a href="${escapeAttr(d.url)}" target="_blank">${escapeHtml(d.name)}</a> — ${escapeHtml(d.note)}`).join('<br>') +
        '</p>';
    }
    return html;
  }
  return '<p class="match-list"><strong>Matched databases:</strong><br>' +
    hyp.findingAidMatches.map(m => `<a href="${escapeAttr(m.url)}" target="_blank">${escapeHtml(m.name)}</a>`).join('<br>') +
    '</p>';
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function escapeAttr(str) { return escapeHtml(str); }
