async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function generateInsights({ resumeText = '', matchedSkills = [], missingSkills = [] }) {
  const prompt = `
You are a resume analyzer.
Give 5 short resume improvement suggestions in plain English.
Resume text: ${resumeText.slice(0, 4000)}
Matched skills: ${matchedSkills.join(', ')}
Missing skills: ${missingSkills.join(', ')}
Return only bullet-style suggestions.
`;

  const geminiText = await callGemini(prompt);
  if (geminiText) {
    return geminiText
      .split('\n')
      .map((line) => line.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
  }

  const fallback = [
    'Add a short professional summary at the top.',
    'Quantify achievements with numbers and results.',
    'Mention tools and technologies more clearly.',
    'Use strong action verbs in experience points.',
    'Add missing skills that match the target role.',
  ];

  if (missingSkills.length) {
    fallback.unshift(`Highlight skills like ${missingSkills.slice(0, 3).join(', ')} if you have used them.`);
  }

  return fallback;
}

async function generateInterviewQuestions({ resumeText = '', skills = [] }) {
  const prompt = `
Create 7 interview questions based on this resume.
Focus on the listed skills and keep the questions short.
Skills: ${skills.join(', ')}
Resume: ${resumeText.slice(0, 3000)}
Return each question on a new line.
`;

  const geminiText = await callGemini(prompt);
  if (geminiText) {
    return geminiText
      .split('\n')
      .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
      .filter(Boolean);
  }

  const baseSkills = skills.length ? skills.slice(0, 5) : ['your experience', 'problem solving', 'projects'];
  return [
    `Tell me about a project where you used ${baseSkills[0]}.`,
    `How do you handle challenging deadlines?`,
    `Explain one decision you made in a recent project.`,
    `Which part of your resume are you most proud of?`,
    `How do you keep learning new tools or technologies?`,
    `What was your biggest technical problem and how did you solve it?`,
    `Why should we hire you for this role?`,
  ];
}

async function answerInterviewChat({ question = '', context = '' }) {
  const prompt = `
You are a friendly interview coach.
Answer the candidate in 4-6 simple sentences.
Question: ${question}
Context: ${context}
`;

  const geminiText = await callGemini(prompt);
  if (geminiText) return geminiText.trim();

  return 'Keep your answer clear, honest, and short. Start with your direct response, then add one example, and finish with the result.';
}

module.exports = {
  generateInsights,
  generateInterviewQuestions,
  answerInterviewChat,
};
