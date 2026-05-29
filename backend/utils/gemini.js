// backend/utils/gemini.js
const Groq = require("groq-sdk");

async function askGemini(prompt) {
  // Initialize inside function so .env is already loaded
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
  });
  return response.choices[0].message.content;
}

module.exports = { askGemini };