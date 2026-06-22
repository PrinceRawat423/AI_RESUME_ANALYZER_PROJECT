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

function extractSkills(text = '') {
  const source = normalize(text);
  return skillLibrary.filter((skill) => source.includes(skill.toLowerCase()));
}

module.exports = { extractSkills, skillLibrary };
