const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPT } = require('./systemPrompt');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

/**
 * Calls the model with the user's research input and returns the parsed
 * JSON response described in systemPrompt.js. Web search is enabled so the
 * model can describe additional databases beyond the curated finding aid —
 * it is never used to look up the specific person.
 */
async function generateHypotheses(userInput) {
  const userMessage = `User-provided research input (JSON):\n${JSON.stringify(userInput, null, 2)}\n\nFollow the system instructions and respond with the JSON object only.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
  });

  const textBlocks = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  const cleaned = textBlocks.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Model did not return valid JSON. Raw output: ${cleaned.slice(0, 500)}`
    );
  }
}

module.exports = { generateHypotheses };
