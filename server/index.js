require('dotenv').config();
const express = require('express');
const path = require('path');
const { generateHypotheses } = require('./anthropicClient');
const { annotateHypothesesWithMatches } = require('./matching');
const findingAid = require('./data/findingAid.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/api/research', async (req, res) => {
  try {
    const userInput = req.body;

    if (!userInput || typeof userInput !== 'object') {
      return res.status(400).json({ error: 'Request body must be a JSON object.' });
    }

    const result = await generateHypotheses(userInput);

    if (result.needsFollowUp) {
      return res.json({
        needsFollowUp: true,
        followUpQuestions: result.followUpQuestions || [],
      });
    }

    const hypothesesWithMatches = annotateHypothesesWithMatches(
      result.hypotheses || [],
      findingAid
    );

    return res.json({
      needsFollowUp: false,
      checklist: result.checklist || [],
      hypotheses: hypothesesWithMatches,
    });
  } catch (err) {
    console.error('Error in /api/research:', err);
    return res.status(500).json({ error: 'Internal error generating research plan.', detail: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
