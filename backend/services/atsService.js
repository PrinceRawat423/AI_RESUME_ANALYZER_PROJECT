const { extractSkills } = require('./skillExtractor');

function calculateATSScore({ resumeText = '', extractedSkills = [], jobDescription = '' }) {
  const resumeLength = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const hasJobDescription = jobDescription.trim().length > 0;
  const jobSkills = extractSkills(jobDescription);
  const matchedSkills = hasJobDescription
    ? extractedSkills.filter((skill) => jobSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()))
    : extractedSkills;
  const missingSkills = hasJobDescription
    ? jobSkills.filter((skill) => !extractedSkills.some((resumeSkill) => resumeSkill.toLowerCase() === skill.toLowerCase()))
    : [];

  // With a JD, score the overlap against skills requested by the role. Without
  // one, the score remains a resume-quality heuristic rather than a job match.
  const skillCoverage = hasJobDescription && jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 70)
    : Math.min(70, extractedSkills.length * 8);
  const structureScore = resumeLength > 250 ? 20 : resumeLength > 100 ? 12 : 6;
  const resumeLowercase = resumeText.toLowerCase();
  const sectionScore = ['experience', 'education', 'skills'].filter((word) => resumeLowercase.includes(word)).length * 3;
  const score = Math.min(100, skillCoverage + structureScore + sectionScore);

  return {
    score,
    matchedSkills,
    missingSkills,
    jobSkills,
  };
}

module.exports = { calculateATSScore };
