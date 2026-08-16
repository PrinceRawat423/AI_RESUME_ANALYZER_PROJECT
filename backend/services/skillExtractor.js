const skillLibrary = [
  'JavaScript',
  'TypeScript',
  'React',
  'React JS',
  'Redux',
  'Node.js',
  'Express',
  'MongoDB',
  'Mongoose',
  'HTML',
  'CSS',
  'Tailwind',
  'Bootstrap',
  'Python',
  'Java',
  'C++',
  'SQL',
  'MySQL',
  'PostgreSQL',
  'Git',
  'GitHub',
  'REST API',
  'GraphQL',
  'JWT',
  'bcrypt',
  'AWS',
  'Docker',
  'Kubernetes',
  'Firebase',
  'Figma',
  'Adobe XD',
  'Zeplin',
  'Balsamiq',
  'Flask',
  'Streamlit',
  'TensorFlow',
  'Keras',
  'PyTorch',
  'Machine Learning',
  'Deep Learning',
  'Android',
  'Android Development',
  'Flutter',
  'Kotlin',
  'XML',
  'iOS',
  'iOS Development',
  'Swift',
  'Cocoa',
  'Xcode',
  'Communication',
  'Leadership',
  'Problem Solving',
  'Teamwork',
  'User Experience',
  'User Research',
  'Prototyping',
  'Wireframes',
  'Sketch',
  'Photoshop',
  'Illustrator'
];

function normalize(text) {
  return String(text || '').toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsSkill(text, skill) {
  const pattern = escapeRegExp(skill.toLowerCase());
  return new RegExp(`(^|[^a-z0-9+#])${pattern}(?=$|[^a-z0-9+#])`, 'i').test(text);
}

function extractSkills(text = '') {
  const source = normalize(text);
  return skillLibrary.filter((skill) => containsSkill(source, skill));
}

module.exports = { extractSkills, skillLibrary };
