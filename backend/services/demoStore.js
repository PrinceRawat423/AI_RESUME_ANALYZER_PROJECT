const crypto = require('crypto');
const mongoose = require('mongoose');

const resumes = [];
const analyses = [];
const feedback = [];

function databaseConnected() {
  return mongoose.connection.readyState === 1;
}

function createRecord(values) {
  const timestamp = new Date();
  return {
    _id: crypto.randomUUID(),
    ...values,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function saveResume(values) {
  const resume = createRecord(values);
  resumes.push(resume);
  return resume;
}

function findResume(id, userId) {
  return resumes.find((resume) => String(resume._id) === String(id) && (!userId || resume.userId === userId)) || null;
}

function latestResume(userId) {
  return resumes
    .filter((resume) => !userId || resume.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)[0] || null;
}

function updateResume(id, values) {
  const resume = findResume(id);
  if (!resume) return null;
  Object.assign(resume, values, { updatedAt: new Date() });
  return resume;
}

function saveAnalysis(values) {
  const analysis = createRecord(values);
  analyses.push(analysis);
  return analysis;
}

function analysisWithResume(analysis) {
  if (!analysis) return null;
  return { ...analysis, resumeId: findResume(analysis.resumeId) };
}

function latestAnalysis(userId) {
  const analysis = analyses
    .filter((item) => !userId || item.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  return analysisWithResume(analysis);
}

function analysisHistory(userId) {
  return analyses
    .filter((item) => !userId || item.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(analysisWithResume);
}

function saveFeedback(values) {
  const item = createRecord(values);
  feedback.push(item);
  return item;
}

function feedbackHistory() {
  return [...feedback].sort((a, b) => b.createdAt - a.createdAt);
}

module.exports = {
  databaseConnected,
  saveResume,
  findResume,
  latestResume,
  updateResume,
  saveAnalysis,
  latestAnalysis,
  analysisHistory,
  saveFeedback,
  feedbackHistory,
};
