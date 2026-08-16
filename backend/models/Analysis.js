const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    resumeText: { type: String, default: '' },
    atsScore: { type: Number, default: 0 },
    scoreBreakdown: { type: Object, default: {} },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    interviewQuestions: { type: [String], default: [] },
    chatbotPrompt: { type: String, default: '' },
    candidateName: { type: String, default: '' },
    candidateEmail: { type: String, default: '' },
    candidateMobile: { type: String, default: '' },
    degree: { type: String, default: '' },
    pageCount: { type: Number, default: 0 },
    predictedField: { type: String, default: 'NA' },
    experienceLevel: { type: String, default: 'NA' },
    recommendedSkills: { type: [String], default: [] },
    recommendedCourses: { type: Array, default: [] },
    resumeTips: { type: [String], default: [] },
    resumeVideos: { type: Array, default: [] },
    interviewVideos: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', analysisSchema);
