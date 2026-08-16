const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');

const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');
const { extractSkills } = require('../services/skillExtractor');
const { calculateATSScore } = require('../services/atsService');
const { generateInsights, generateInterviewQuestions } = require('../services/geminiService');
const { buildResumeProfile } = require('../services/resumeProfile');
const demoStore = require('../services/demoStore');

async function parsePdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return {
    text: data.text || '',
    numpages: data.numpages || 0,
  };
}

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const resumeValues = {
      userId: req.user?.id || null,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    };
    const resume = demoStore.databaseConnected()
      ? await Resume.create(resumeValues)
      : demoStore.saveResume(resumeValues);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    const resumeId = req.body.resumeId || req.params.resumeId;
    const jobDescription = req.body.jobDescription || '';
    const userFilter = req.user?.id ? { userId: req.user.id } : {};

    if (!jobDescription.trim()) {
      return res.status(400).json({ message: 'Please paste a job description to calculate an ATS compatibility score.' });
    }

    const databaseConnected = demoStore.databaseConnected();
    let resume = null;
    if (databaseConnected) {
      resume = resumeId
        ? await Resume.findById(resumeId)
        : await Resume.findOne(userFilter).sort({ createdAt: -1 });
    } else {
      resume = resumeId
        ? demoStore.findResume(resumeId, req.user?.id)
        : demoStore.latestResume(req.user?.id);
    }

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const filePath = path.resolve(resume.filePath);
    const parsedPdf = await parsePdf(filePath);
    const resumeText = parsedPdf.text;
    const pageCount = parsedPdf.numpages;
    const extractedSkills = extractSkills(resumeText);
    const ats = calculateATSScore({ resumeText, extractedSkills, jobDescription });
    const suggestions = await generateInsights({
      resumeText,
      matchedSkills: ats.matchedSkills,
      missingSkills: ats.missingSkills,
    });
    const interviewQuestions = await generateInterviewQuestions({
      resumeText,
      skills: ats.matchedSkills,
    });
    const resumeProfile = buildResumeProfile({
      resumeText,
      matchedSkills: ats.matchedSkills,
      pageCount,
    });
    if (req.body.name || req.body.email || req.body.mobile) {
      resumeProfile.name = req.body.name || resumeProfile.name;
      resumeProfile.email = req.body.email || resumeProfile.email;
      resumeProfile.mobileNumber = req.body.mobile || resumeProfile.mobileNumber;
    }

    const analysisValues = {
      userId: req.user?.id || null,
      resumeId: resume._id,
      resumeText,
      atsScore: ats.score,
      scoreBreakdown: ats.scoreBreakdown,
      matchedSkills: ats.matchedSkills,
      missingSkills: ats.missingSkills,
      suggestions,
      interviewQuestions,
      chatbotPrompt: `Resume skills: ${ats.matchedSkills.join(', ')}`,
      candidateName: resumeProfile.name,
      candidateEmail: resumeProfile.email,
      candidateMobile: resumeProfile.mobileNumber,
      degree: resumeProfile.degree,
      pageCount,
      predictedField: resumeProfile.predictedField,
      experienceLevel: resumeProfile.experienceLevel,
      recommendedSkills: resumeProfile.recommendedSkills,
      recommendedCourses: resumeProfile.recommendedCourses,
      resumeTips: resumeProfile.resumeTips,
      resumeVideos: resumeProfile.resumeVideos,
      interviewVideos: resumeProfile.interviewVideos,
    };
    const analysis = databaseConnected
      ? await Analysis.create(analysisValues)
      : demoStore.saveAnalysis(analysisValues);

    if (databaseConnected) {
      await Resume.findByIdAndUpdate(resume._id, { extractedText: resumeText });
    } else {
      demoStore.updateResume(resume._id, { extractedText: resumeText });
    }

    res.json({
      message: 'Resume analyzed successfully',
      resume,
      analysis,
      resumeProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = demoStore.databaseConnected()
      ? await Analysis.find(req.user?.id ? { userId: req.user.id } : {})
        .populate('resumeId')
        .sort({ createdAt: -1 })
      : demoStore.analysisHistory(req.user?.id);

    res.json({ history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestAnalysis = async (req, res) => {
  try {
    const analysis = demoStore.databaseConnected()
      ? await Analysis.findOne(req.user?.id ? { userId: req.user.id } : {})
        .populate('resumeId')
        .sort({ createdAt: -1 })
      : demoStore.latestAnalysis(req.user?.id);

    if (!analysis) {
      return res.status(404).json({ message: 'No analysis found' });
    }

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
