const { generateInterviewQuestions, answerInterviewChat } = require('../services/geminiService');
const Analysis = require('../models/Analysis');

exports.generateQuestions = async (req, res) => {
  try {
    const analysis = req.body.analysisId
      ? await Analysis.findById(req.body.analysisId)
      : await Analysis.findOne(req.user?.id ? { userId: req.user.id } : {}).sort({ createdAt: -1 });

    const questions = await generateInterviewQuestions({
      resumeText: analysis?.resumeText || req.body.resumeText || '',
      skills: analysis?.matchedSkills || req.body.skills || [],
    });

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { question = '', context = '' } = req.body;
    const answer = await answerInterviewChat({ question, context });
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
