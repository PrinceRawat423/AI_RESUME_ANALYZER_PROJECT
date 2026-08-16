const { extractSkills } = require('./skillExtractor');

const SECTION_KEYWORDS = ['summary', 'experience', 'education', 'skills', 'projects'];

function calculateATSScore({ resumeText = '', extractedSkills = [], jobDescription = '' }) {
  const normalizedResume = String(resumeText).toLowerCase();
  const normalizedJobDescription = String(jobDescription).trim();
  const resumeLength = normalizedResume.split(/\s+/).filter(Boolean).length;
  const jobSkills = extractSkills(normalizedJobDescription);
  const matchedSkills = extractedSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase())
  );
  const missingSkills = jobSkills.filter((skill) =>
    !extractedSkills.some((resumeSkill) => resumeSkill.toLowerCase() === skill.toLowerCase())
  );

  // A role-specific compatibility score needs a job description. The score is
  // deliberately transparent instead of claiming to reproduce a vendor ATS.
  const skillCoverage = jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 60)
    : 0;
  const sectionCoverage = SECTION_KEYWORDS.filter((section) => normalizedResume.includes(section)).length * 3;
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,4}\)?[-.\s]?){2,4}\d{3,4}/.test(resumeText);
  const contactScore = (hasEmail ? 4 : 0) + (hasPhone ? 4 : 0);
  const measurableResults = (resumeText.match(/\b\d+(?:\.\d+)?%|\b\d+\+?\s*(?:years?|months?|users?|customers?|projects?|team members?)\b|[$₹€£]\s?\d+/gi) || []).length;
  const impactScore = Math.min(7, measurableResults * 2);
  const readabilityScore = resumeLength >= 400 ? 10 : resumeLength >= 250 ? 7 : resumeLength >= 150 ? 4 : 1;
  const score = Math.min(100, skillCoverage + sectionCoverage + contactScore + impactScore + readabilityScore);

  return {
    score,
    matchedSkills,
    missingSkills,
    jobSkills,
    scoreBreakdown: {
      skillCoverage,
      sectionCoverage,
      contactScore,
      impactScore,
      readabilityScore,
      jobSkillCount: jobSkills.length,
    },
  };
}

module.exports = { calculateATSScore };
