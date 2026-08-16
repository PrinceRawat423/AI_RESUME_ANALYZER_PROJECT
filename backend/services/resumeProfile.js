const COURSE_LIBRARY = {
  'Data Science': [
    ['Machine Learning Specialization', 'https://www.coursera.org/specializations/machine-learning-introduction'],
    ['Python for Data Science', 'https://www.coursera.org/specializations/python'],
    ['Data Analysis with Pandas', 'https://www.freecodecamp.org/news/learn-data-analysis-with-python/'],
    ['TensorFlow Developer Course', 'https://www.coursera.org/professional-certificates/tensorflow-in-practice'],
    ['Statistics for Data Science', 'https://www.khanacademy.org/math/statistics-probability'],
  ],
  'Web Development': [
    ['Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/'],
    ['Modern React with Redux', 'https://www.coursera.org/learn/react-redux'],
    ['Node.js Fundamentals', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'],
    ['JavaScript Algorithms', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/'],
    ['Backend API Design', 'https://www.coursera.org/learn/restful-api'],
  ],
  'Android Development': [
    ['Android Basics with Kotlin', 'https://developer.android.com/courses/android-basics-kotlin/course'],
    ['Flutter & Dart', 'https://docs.flutter.dev/get-started/codelab'],
    ['Android UI Design', 'https://developer.android.com/guide/topics/ui'],
    ['Jetpack Compose', 'https://developer.android.com/courses/pathways/compose'],
    ['Mobile App Architecture', 'https://developer.android.com/topic/architecture'],
  ],
  'IOS Development': [
    ['SwiftUI Essentials', 'https://developer.apple.com/tutorials/swiftui'],
    ['Develop in Swift', 'https://developer.apple.com/education/pursuit-of-app-development/'],
    ['iOS App Development', 'https://www.coursera.org/specializations/app-development'],
    ['Xcode Fundamentals', 'https://developer.apple.com/xcode/'],
    ['Mobile UI Patterns', 'https://developer.apple.com/design/human-interface-guidelines/'],
  ],
  'UI-UX Development': [
    ['Figma for Beginners', 'https://help.figma.com/hc/en-us/categories/360002042553-Learn-design-with-Figma'],
    ['Adobe XD Masterclass', 'https://helpx.adobe.com/xd/user-guide.html'],
    ['User Research Methods', 'https://www.interaction-design.org/literature/topics/user-research'],
    ['Wireframing & Prototyping', 'https://www.figma.com/resource-library/wireframing/'],
    ['Design Systems', 'https://www.interaction-design.org/literature/topics/design-systems'],
  ],
  NA: [
    ['Communication Skills', 'https://www.coursera.org/learn/wharton-communication-skills'],
    ['Microsoft Office Essentials', 'https://support.microsoft.com/en-us/office'],
    ['Leadership Fundamentals', 'https://www.coursera.org/learn/leading-people-and-teams'],
    ['Resume Writing Tips', 'https://www.indeed.com/career-advice/resumes-cover-letters'],
    ['Interview Practice', 'https://www.pramp.com/'],
  ],
};

const VIDEO_LIBRARY = {
  resume: [
    ['How to Build a Better Resume', 'https://www.youtube.com/watch?v=byj6JXHhW9g'],
    ['ATS Resume Tips', 'https://www.youtube.com/watch?v=9ZqB8HnFh4s'],
    ['Resume Writing for Beginners', 'https://www.youtube.com/watch?v=Tk5qF4wK8Jg'],
  ],
  interview: [
    ['Interview Questions & Answers', 'https://www.youtube.com/watch?v=Qn0aG1uQ2y4'],
    ['How to Answer Tell Me About Yourself', 'https://www.youtube.com/watch?v=6b8R6t4y6uQ'],
    ['Mock Interview Tips', 'https://www.youtube.com/watch?v=HAnw168huqA'],
  ],
};

const RECOMMENDED_SKILLS = {
  'Data Science': [
    'Data Visualization',
    'Predictive Analysis',
    'Statistical Modeling',
    'Data Mining',
    'Clustering & Classification',
    'Data Analytics',
    'Quantitative Analysis',
    'Web Scraping',
    'ML Algorithms',
    'Keras',
    'PyTorch',
    'Probability',
    'Scikit-learn',
    'TensorFlow',
    'Flask',
    'Streamlit',
  ],
  'Web Development': [
    'React',
    'Django',
    'Node JS',
    'React JS',
    'PHP',
    'Laravel',
    'Magento',
    'WordPress',
    'JavaScript',
    'Angular JS',
    'C#',
    'Flask',
    'SDK',
  ],
  'Android Development': [
    'Android',
    'Android Development',
    'Flutter',
    'Kotlin',
    'XML',
    'Java',
    'Kivy',
    'Git',
    'SDK',
    'SQLite',
  ],
  'IOS Development': [
    'iOS',
    'iOS Development',
    'Swift',
    'Cocoa',
    'Cocoa Touch',
    'Xcode',
    'Objective-C',
    'SQLite',
    'Plist',
    'StoreKit',
    'UIKit',
    'AV Foundation',
    'Auto-Layout',
  ],
  'UI-UX Development': [
    'UI',
    'User Experience',
    'Adobe XD',
    'Figma',
    'Zeplin',
    'Balsamiq',
    'Prototyping',
    'Wireframes',
    'Storyframes',
    'Adobe Photoshop',
    'Illustrator',
    'After Effects',
    'Premier Pro',
    'Indesign',
    'User Research',
  ],
  NA: ['No Recommendations'],
};

const FIELD_KEYWORDS = [
  {
    field: 'Data Science',
    keywords: ['tensorflow', 'keras', 'pytorch', 'machine learning', 'deep learning', 'flask', 'streamlit', 'python', 'pandas', 'numpy'],
  },
  {
    field: 'Web Development',
    keywords: ['react', 'django', 'node js', 'node.js', 'php', 'laravel', 'wordpress', 'javascript', 'angular', 'html', 'css', 'bootstrap'],
  },
  {
    field: 'Android Development',
    keywords: ['android', 'flutter', 'kotlin', 'xml', 'kivy', 'mobile app'],
  },
  {
    field: 'IOS Development',
    keywords: ['ios', 'swift', 'cocoa', 'xcode', 'objective-c', 'storekit'],
  },
  {
    field: 'UI-UX Development',
    keywords: ['ux', 'ui', 'figma', 'adobe xd', 'zeplin', 'balsamiq', 'wireframe', 'prototype', 'user research', 'illustrator', 'photoshop'],
  },
];

const DEFAULT_TIPS = [
  'Add a short professional summary at the top.',
  'Quantify achievements with numbers and results.',
  'Mention tools and technologies more clearly.',
  'Use strong action verbs in experience points.',
  'Add missing skills that match the target role.',
];

function normalize(text) {
  return String(text || '').toLowerCase();
}

function detectField({ resumeText = '', matchedSkills = [] }) {
  const normalizedText = normalize(resumeText);
  const skillText = matchedSkills.map(normalize).join(' ');

  for (const entry of FIELD_KEYWORDS) {
    if (entry.keywords.some((keyword) => normalizedText.includes(keyword) || skillText.includes(keyword))) {
      return entry.field;
    }
  }

  return 'NA';
}

function detectExperienceLevel({ resumeText = '', pageCount = 0 }) {
  const text = normalize(resumeText);

  if (pageCount < 1) return 'NA';
  if (text.includes('internship') || text.includes('internships')) return 'Intermediate';
  if (text.includes('experience') || text.includes('work experience')) return 'Experienced';
  return 'Fresher';
}

function extractContactInfo(resumeText = '') {
  const lines = String(resumeText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,4}\)?[-.\s]?){2,4}\d{3,4}/);

  let name = lines.find((line) => {
    const lowered = line.toLowerCase();
    return (
      line.length <= 40 &&
      /[a-z]/i.test(line) &&
      !lowered.includes('@') &&
      !lowered.includes('resume') &&
      !lowered.includes('curriculum vitae') &&
      !lowered.includes('linkedin') &&
      !lowered.includes('github')
    );
  });

  if (!name && lines.length) {
    name = lines[0];
  }

  const degreeCandidates = [
    'b.tech',
    'btech',
    'b.e',
    'be',
    'b.sc',
    'bsc',
    'm.tech',
    'mtech',
    'm.sc',
    'msc',
    'mba',
    'mca',
    'phd',
    'bca',
    'computer science',
    'information technology',
  ];

  const degreeLine = lines.find((line) => degreeCandidates.some((candidate) => line.toLowerCase().includes(candidate)));

  return {
    name: name || 'Unknown Candidate',
    email: emailMatch ? emailMatch[0] : '',
    mobileNumber: phoneMatch ? phoneMatch[0] : '',
    degree: degreeLine || 'Not specified',
  };
}

function buildRecommendationBundle(field) {
  const recommendedSkills = RECOMMENDED_SKILLS[field] || RECOMMENDED_SKILLS.NA;
  return {
    recommendedSkills,
    courses: COURSE_LIBRARY[field] || COURSE_LIBRARY.NA,
    resumeVideos: VIDEO_LIBRARY.resume,
    interviewVideos: VIDEO_LIBRARY.interview,
  };
}

function buildResumeProfile({ resumeText = '', matchedSkills = [], pageCount = 0 }) {
  const contact = extractContactInfo(resumeText);
  const predictedField = detectField({ resumeText, matchedSkills });
  const experienceLevel = detectExperienceLevel({ resumeText, pageCount });
  const recommendations = buildRecommendationBundle(predictedField);

  return {
    ...contact,
    predictedField,
    experienceLevel,
    recommendedSkills: recommendations.recommendedSkills,
    recommendedCourses: recommendations.courses,
    resumeVideos: recommendations.resumeVideos,
    interviewVideos: recommendations.interviewVideos,
    resumeTips: DEFAULT_TIPS,
  };
}

module.exports = {
  buildResumeProfile,
  buildRecommendationBundle,
  detectField,
  detectExperienceLevel,
  extractContactInfo,
  DEFAULT_TIPS,
};
