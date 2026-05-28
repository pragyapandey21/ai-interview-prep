// backend/routes/ai.js
const express = require("express");
const router  = express.Router();
const { askGemini } = require("../utils/gemini");

// ─────────────────────────────────────────────────────────────
// 1. TOPIC LEARNING
// POST /api/ai/topic
// Body: { topic: "DSA", subtopic: "Arrays" }
// ─────────────────────────────────────────────────────────────
router.post("/topic", async (req, res) => {
  const { topic, subtopic } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const prompt = `
You are an expert computer science tutor helping a student prepare for technical interviews.

Topic: ${topic}
${subtopic ? `Subtopic: ${subtopic}` : ""}

Generate a comprehensive, interview-focused learning guide. Structure your response EXACTLY as JSON:

{
  "title": "${subtopic || topic}",
  "overview": "2-3 sentence beginner-friendly overview",
  "keyConcepts": [
    { "concept": "name", "explanation": "clear explanation", "example": "concrete example or code snippet" }
  ],
  "interviewQuestions": [
    { "question": "...", "difficulty": "Easy|Medium|Hard", "answer": "detailed answer" }
  ],
  "codingProblems": [
    { "title": "...", "description": "...", "difficulty": "Easy|Medium|Hard", "hint": "..." }
  ],
  "importantPoints": ["bullet point 1", "bullet point 2", "bullet point 3"]
}

Return ONLY valid JSON, no markdown, no extra text.
For ${topic === "HR Interview" ? "HR topics, skip codingProblems and focus on communication tips" : "DSA topics, include at least 2 code examples in keyConcepts"}.
  `.trim();

  try {
    const raw  = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Topic AI error:", err.message);
    res.status(500).json({ error: "AI generation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 2. MCQ QUIZ GENERATION
// POST /api/ai/quiz
// Body: { topic: "DBMS" }
// ─────────────────────────────────────────────────────────────
router.post("/quiz", async (req, res) => {
  const { topic = "Mixed (DBMS, OS, Computer Networks, OOPs)" } = req.body;

  const prompt = `
Generate exactly 10 multiple-choice questions for a technical interview quiz on: ${topic}.

Return ONLY valid JSON in this exact structure, no markdown:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correctIndex": 0,
      "explanation": "why this answer is correct",
      "difficulty": "Easy|Medium|Hard",
      "subject": "specific subtopic"
    }
  ]
}

Rules:
- correctIndex is 0-based (0=A, 1=B, 2=C, 3=D)
- Mix Easy (4), Medium (4), Hard (2) questions
- Questions must be factual and interview-relevant
- No duplicate questions
- Options should be plausible (not obviously wrong)
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Quiz AI error:", err.message);
    res.status(500).json({ error: "Quiz generation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 3. DAILY CODING CHALLENGE — Generate
// POST /api/ai/challenge
// Body: { difficulty: "Medium" }
// ─────────────────────────────────────────────────────────────
router.post("/challenge", async (req, res) => {
  const { difficulty = "Medium" } = req.body;

  const prompt = `
Create a ${difficulty} difficulty LeetCode-style coding challenge for today's daily practice.

Return ONLY valid JSON:
{
  "title": "Problem Name",
  "difficulty": "${difficulty}",
  "topic": "Arrays|Strings|Trees|Graphs|DP|etc",
  "description": "full problem statement with context",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [
    { "input": "...", "output": "...", "explanation": "..." }
  ],
  "hint": "a helpful hint without giving away the solution",
  "timeComplexity": "expected optimal time complexity",
  "spaceComplexity": "expected optimal space complexity",
  "tags": ["tag1", "tag2"]
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Challenge AI error:", err.message);
    res.status(500).json({ error: "Challenge generation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 4. DAILY CHALLENGE — Code Review
// POST /api/ai/challenge/review
// Body: { problem: { title, description }, code: "user's code", language: "JavaScript" }
// ─────────────────────────────────────────────────────────────
router.post("/challenge/review", async (req, res) => {
  const { problem, code, language = "JavaScript" } = req.body;
  if (!code) return res.status(400).json({ error: "code is required" });

  const prompt = `
You are a senior software engineer doing a code review for an interview candidate.

Problem: ${problem?.title || "Coding Challenge"}
Description: ${problem?.description || ""}

Candidate's ${language} solution:
\`\`\`${language}
${code}
\`\`\`

Provide a thorough review. Return ONLY valid JSON:
{
  "overallScore": 85,
  "verdict": "Good|Needs Improvement|Excellent|Poor",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "correctness": "Is the solution correct? Explain.",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "optimizedApproach": "brief description of a better approach if applicable",
  "sampleSolution": "clean optimized code snippet"
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Code review AI error:", err.message);
    res.status(500).json({ error: "Code review failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 5. MOCK INTERVIEW — Get next question (with conversation memory)
// POST /api/ai/mock/question
// Body: { history: [{role, content}], topics: ["DSA","OS"], questionNumber: 1 }
// ─────────────────────────────────────────────────────────────
router.post("/mock/question", async (req, res) => {
  const { history = [], topics = ["DSA", "DBMS", "OS", "CN", "HR"], questionNumber = 1 } = req.body;

  const topicList = topics.join(", ");
  const historyText = history
    .map(h => `${h.role === "ai" ? "Interviewer" : "Candidate"}: ${h.content}`)
    .join("\n");

  const prompt = `
You are a strict but fair technical interviewer conducting a mock interview.

Topics to cover: ${topicList}
This is question ${questionNumber} of 7.

${historyText ? `Conversation so far:\n${historyText}\n` : ""}

Ask the next interview question. Vary between technical (DSA, DBMS, OS, CN) and behavioral (HR) questions.
Do NOT repeat previous questions.
${questionNumber <= 2 ? "Start with a warm-up easy question." : questionNumber >= 6 ? "Ask a challenging question now." : "Ask a medium difficulty question."}

Return ONLY valid JSON:
{
  "question": "your interview question here",
  "topic": "which topic this belongs to",
  "difficulty": "Easy|Medium|Hard",
  "expectedKeyPoints": ["key point 1", "key point 2", "key point 3"]
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Mock question AI error:", err.message);
    res.status(500).json({ error: "Question generation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 6. MOCK INTERVIEW — Evaluate answer
// POST /api/ai/mock/evaluate
// Body: { question, answer, expectedKeyPoints, topic }
// ─────────────────────────────────────────────────────────────
router.post("/mock/evaluate", async (req, res) => {
  const { question, answer, expectedKeyPoints = [], topic } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "question and answer required" });

  const prompt = `
You are a technical interviewer evaluating a candidate's answer.

Question: ${question}
Topic: ${topic}
Expected Key Points: ${expectedKeyPoints.join(", ")}

Candidate's Answer: "${answer}"

Evaluate this answer fairly. Return ONLY valid JSON:
{
  "score": 75,
  "grade": "A|B|C|D|F",
  "verdict": "one sentence summary verdict",
  "coveredPoints": ["points the candidate mentioned correctly"],
  "missedPoints": ["important points they missed"],
  "feedback": "2-3 sentences of constructive feedback",
  "improvedAnswer": "a model answer for this question in 3-4 sentences",
  "encouragement": "one motivating sentence for the candidate"
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Mock evaluate AI error:", err.message);
    res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 7. MOCK INTERVIEW — Final Report
// POST /api/ai/mock/report
// Body: { scores: [{ question, answer, score, topic }] }
// ─────────────────────────────────────────────────────────────
router.post("/mock/report", async (req, res) => {
  const { scores = [] } = req.body;

  const summary = scores.map((s, i) =>
    `Q${i+1} [${s.topic}]: Score ${s.score}/100`
  ).join("\n");

  const prompt = `
A candidate just completed a mock interview. Here are their scores:
${summary}

Generate a final performance report. Return ONLY valid JSON:
{
  "overallScore": 78,
  "grade": "B+",
  "summary": "2-3 sentence overall assessment",
  "strongTopics": ["topic1", "topic2"],
  "weakTopics": ["topic3"],
  "topicBreakdown": [
    { "topic": "DSA", "score": 80, "comment": "brief comment" }
  ],
  "recommendations": ["actionable recommendation 1", "recommendation 2", "recommendation 3"],
  "nextSteps": "What should the candidate focus on next?"
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Mock report AI error:", err.message);
    res.status(500).json({ error: "Report generation failed", details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 8. HR PRACTICE — Analyze answer
// POST /api/ai/hr/analyze
// Body: { question: "Tell me about yourself", answer: "..." }
// ─────────────────────────────────────────────────────────────
router.post("/hr/analyze", async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "question and answer required" });

  const prompt = `
You are an HR interview coach analyzing a candidate's response.

HR Question: "${question}"
Candidate's Answer: "${answer}"

Give detailed coaching feedback. Return ONLY valid JSON:
{
  "score": 72,
  "communicationScore": 80,
  "contentScore": 65,
  "verdict": "one sentence assessment",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "grammarTips": ["grammar or phrasing suggestion"],
  "improvedAnswer": "a polished, professional version of their answer",
  "confidenceTips": ["tip to sound more confident"],
  "keywordsToUse": ["powerful word 1", "powerful word 2"]
}
  `.trim();

  try {
    const raw   = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const data  = JSON.parse(clean);
    res.json({ success: true, data });
  } catch (err) {
    console.error("HR AI error:", err.message);
    res.status(500).json({ error: "HR analysis failed", details: err.message });
  }
});

module.exports = router;