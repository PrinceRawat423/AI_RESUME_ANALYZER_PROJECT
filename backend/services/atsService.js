const { skillLibrary } = require('./skillExtractor');

function calculateATSScore({ resumeText = '', extractedSkills = [], jobDescription = '' }) {
  const resumeLength = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const text = `${resumeText} ${jobDescription}`.toLowerCase();

  const matchedSkills = extractedSkills.filter((skill) => text.includes(skill.toLowerCase()));
  const missingSkills = skillLibrary.filter((skill) => !text.includes(skill.toLowerCase())).slice(0, 8);

  const skillCoverage = Math.min(70, matchedSkills.length * 8);
  const structureScore = resumeLength > 250 ? 20 : resumeLength > 100 ? 12 : 6;
  const sectionScore = ['experience', 'education', 'skills'].filter((word) => text.includes(word)).length * 3;
  const score = Math.min(100, skillCoverage + structureScore + sectionScore);

  return {
    score,
    matchedSkills,
    missingSkills,
  };
}

module.exports = { calculateATSScore };
