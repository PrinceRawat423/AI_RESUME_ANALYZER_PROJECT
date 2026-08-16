import React, { useEffect, useMemo, useState } from 'react';
import { feedbackApi, resumeApi } from './services/api';

const TAB_LABELS = ['User', 'Feedback', 'About', 'Admin'];

const ABOUT_POINTS = [
  'Parses resume content and turns it into structured insights.',
  'Highlights skills, ATS score, role prediction, and practical improvements.',
  'Includes course suggestions, interview prompts, and a feedback workflow.',
  'Keeps the interface simple and Streamlit-inspired so the core analysis stays front and center.',
];

const REQUIREMENTS = ['MongoDB URI', 'Node.js 18+', 'PDF resume file', 'Optional Gemini API key'];

const TECH_STACK = [
  ['Frontend', 'React + Vite'],
  ['Backend', 'Express + MongoDB'],
  ['Parsing', 'pdf-parse'],
  ['AI Suggestions', 'Gemini fallback / heuristics'],
  ['UI Style', 'Streamlit-inspired single page'],
];

function formatDate(value) {
  if (!value) return 'Recently';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function getBaseUrl() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  return apiBase.replace(/\/api\/?$/, '');
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escapeCell = (cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((key) => escapeCell(row[key])).join(','))].join('\n');
}

function normalizeProfile(analysis, resume) {
  return {
    name: analysis?.candidateName || resume?.candidateName || 'Unknown Candidate',
    email: analysis?.candidateEmail || resume?.candidateEmail || '',
    mobileNumber: analysis?.candidateMobile || resume?.candidateMobile || '',
    degree: analysis?.degree || resume?.degree || 'Not specified',
    pageCount: analysis?.pageCount || resume?.pageCount || 0,
    predictedField: analysis?.predictedField || resume?.predictedField || 'NA',
    experienceLevel: analysis?.experienceLevel || resume?.experienceLevel || 'NA',
    recommendedSkills: analysis?.recommendedSkills || resume?.recommendedSkills || [],
    recommendedCourses: analysis?.recommendedCourses || resume?.recommendedCourses || [],
    resumeTips: analysis?.resumeTips || resume?.resumeTips || [],
    resumeVideos: analysis?.resumeVideos || resume?.resumeVideos || [],
    interviewVideos: analysis?.interviewVideos || resume?.interviewVideos || [],
  };
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <div className="stat-value">{value}</div>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </div>
  );
}

function PillList({ items, tone = 'soft' }) {
  if (!items?.length) return <p className="empty-note">No items to display yet.</p>;
  return (
    <div className="pill-list">
      {items.map((item) => (
        <span key={String(item)} className={`pill pill-${tone}`}>
          {Array.isArray(item) ? item[0] : item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, subtitle, children, action }) {
  return (
    <section className="card section-card">
      <div className="section-head">
        <div>
          <p className="section-kicker">AI Resume Analyzer</p>
          <h2>{title}</h2>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('User');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    score: 5,
    comments: '',
  });

  const profile = useMemo(() => normalizeProfile(analysis?.analysis, analysis?.resumeProfile || analysis?.resume), [analysis]);
  const displayName = candidateForm.name || profile.name;
  const displayEmail = candidateForm.email || profile.email;
  const displayMobile = candidateForm.mobile || profile.mobileNumber;
  const latestResume = analysis?.resume || analysis?.analysis?.resumeId || null;
  const uploadsBase = getBaseUrl();
  const pdfUrl = latestResume?.storedName ? `${uploadsBase}/uploads/${encodeURIComponent(latestResume.storedName)}` : '';
  const atsScore = analysis?.analysis?.atsScore ?? 0;
  const matchedSkills = analysis?.analysis?.matchedSkills || [];
  const missingSkills = analysis?.analysis?.missingSkills || [];
  const suggestions = analysis?.analysis?.suggestions || [];
  const interviewQuestions = analysis?.analysis?.interviewQuestions || [];
  const totalFeedback = feedbackHistory.length;
  const averageRating = totalFeedback
    ? (feedbackHistory.reduce((sum, item) => sum + Number(item.score || 0), 0) / totalFeedback).toFixed(1)
    : '0.0';

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [latestResponse, historyResponse, feedbackResponse] = await Promise.all([
          resumeApi.latest().catch(() => null),
          resumeApi.history().catch(() => null),
          feedbackApi.history().catch(() => null),
        ]);

        if (!mounted) return;
        if (latestResponse?.data?.analysis) {
          setAnalysis(latestResponse.data);
        }
        setHistory(historyResponse?.data?.history || []);
        setFeedbackHistory(feedbackResponse?.data?.feedback || []);
      } catch {
        if (!mounted) return;
        setHistory([]);
        setFeedbackHistory([]);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshData = async () => {
    try {
      const [latestResponse, historyResponse, feedbackResponse] = await Promise.all([
        resumeApi.latest().catch(() => null),
        resumeApi.history().catch(() => null),
        feedbackApi.history().catch(() => null),
      ]);

      if (latestResponse?.data?.analysis) setAnalysis(latestResponse.data);
      setHistory(historyResponse?.data?.history || []);
      setFeedbackHistory(feedbackResponse?.data?.feedback || []);
    } catch {
      // keep the UI usable even if backend is unavailable
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setStatus('Please select a PDF resume first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    setStatus('Uploading and analyzing resume...');

    try {
      const uploadResponse = await resumeApi.upload(formData);
      const resumeId = uploadResponse.data.resume._id;
      const analyzeResponse = await resumeApi.analyze({
        resumeId,
        jobDescription,
        name: candidateForm.name,
        email: candidateForm.email,
        mobile: candidateForm.mobile,
      });

      setAnalysis(analyzeResponse.data);
      setStatus('Resume analyzed successfully.');
      await refreshData();
      setActiveTab('User');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Upload or analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await feedbackApi.submit(feedbackForm);
      setStatus('Feedback submitted successfully.');
      setFeedbackForm({ name: '', email: '', score: 5, comments: '' });
      await refreshData();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Feedback submit failed.');
    }
  };

  const downloadCsv = () => {
    const rows = history.map((item) => ({
      Name: item.candidateName || item.resumeId?.candidateName || '',
      Email: item.candidateEmail || item.resumeId?.candidateEmail || '',
      Mobile: item.candidateMobile || item.resumeId?.candidateMobile || '',
      ATSScore: item.atsScore ?? '',
      PredictedField: item.predictedField || '',
      ExperienceLevel: item.experienceLevel || '',
      ResumeFile: item.resumeId?.originalName || item.resumeId?.storedName || '',
      CreatedAt: formatDate(item.createdAt),
    }));

    const csv = toCsv(rows);
    if (!csv) {
      setStatus('No resume history available to export.');
      return;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-analysis-history.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const summaryByField = history.reduce((acc, item) => {
    const key = item.predictedField || 'NA';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const summaryByExperience = history.reduce((acc, item) => {
    const key = item.experienceLevel || 'NA';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-mark">AI</div>
          <div>
            <p className="brand-kicker">Resume Analyzer</p>
            <h1>Streamlit-style dashboard</h1>
          </div>
        </div>

        <p className="sidebar-copy">
          Upload a resume, get smart recommendations, leave feedback, and inspect analysis history.
        </p>

        <nav className="sidebar-nav">
          {TAB_LABELS.map((label) => (
            <button
              key={label}
              className={`sidebar-item ${activeTab === label ? 'active' : ''}`}
              onClick={() => setActiveTab(label)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-label">Current status</p>
          <div className="status-chip">{status || 'Ready to analyze'}</div>
        </div>
      </aside>

      <main className="workspace">
        {activeTab === 'User' ? (
          <div className="workspace-grid">
            <Section
              title="Upload Your Resume, And Get Smart Recommendations"
              subtitle="The resume is parsed, scored, and mapped to a suggested field, skills, courses, and interview prompts."
              action={<div className="score-badge"><span>ATS Score</span><strong>{atsScore}%</strong></div>}
            >
              <div className="form-grid">
                <label className="field">
                  <span>Name*</span>
                  <input
                    className="control"
                    value={candidateForm.name}
                    onChange={(event) => setCandidateForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                  />
                </label>
                <label className="field">
                  <span>Mail*</span>
                  <input
                    className="control"
                    value={candidateForm.email}
                    onChange={(event) => setCandidateForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="name@example.com"
                  />
                </label>
                <label className="field">
                  <span>Mobile Number*</span>
                  <input
                    className="control"
                    value={candidateForm.mobile}
                    onChange={(event) => setCandidateForm((prev) => ({ ...prev, mobile: event.target.value }))}
                    placeholder="Mobile number"
                  />
                </label>
                <label className="field">
                  <span>Choose your Resume</span>
                  <input
                    className="control file-control"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                  />
                </label>
                <label className="field field-wide">
                  <span>Job description</span>
                  <textarea
                    className="control textarea"
                    rows="4"
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    placeholder="Optional job description to improve matching..."
                  />
                </label>
              </div>

              <div className="action-row">
                <button className="primary-btn" onClick={handleAnalyze} disabled={loading} type="button">
                  {loading ? 'Analyzing...' : 'Upload and Analyze'}
                </button>
                <button className="ghost-btn" onClick={refreshData} type="button">
                  Refresh Data
                </button>
              </div>
            </Section>

            <div className="stats-grid">
              <StatCard label="Candidate" value={displayName} hint={profile.degree} />
              <StatCard label="Experience" value={profile.experienceLevel} hint={`Pages: ${profile.pageCount || 0}`} />
              <StatCard label="Predicted Field" value={profile.predictedField} hint="Based on detected skills" />
              <StatCard label="Matched Skills" value={matchedSkills.length} hint="Found in the resume text" />
            </div>

            <div className="two-col">
              <Section title="Resume Preview" subtitle="Uploaded file preview if the PDF is accessible from the backend.">
                {pdfUrl ? (
                  <iframe className="pdf-frame" title="Resume preview" src={pdfUrl} />
                ) : (
                  <div className="empty-preview">
                    <p>No resume preview yet.</p>
                    <span>Upload a PDF to see the preview and analysis here.</span>
                  </div>
                )}
              </Section>

              <Section title="Basic Info" subtitle="Auto-detected candidate details from the uploaded resume.">
                <div className="info-grid">
                  <div>
                    <p className="info-label">Name</p>
                    <p>{displayName}</p>
                  </div>
                  <div>
                    <p className="info-label">Email</p>
                    <p>{displayEmail || 'Not detected'}</p>
                  </div>
                  <div>
                    <p className="info-label">Contact</p>
                    <p>{displayMobile || 'Not detected'}</p>
                  </div>
                  <div>
                    <p className="info-label">Degree</p>
                    <p>{profile.degree}</p>
                  </div>
                </div>
              </Section>
            </div>

            <Section title="Skills Recommendation" subtitle="Current skills and suggested skills are shown side by side.">
              <div className="subsection">
                <h3>Your Current Skills</h3>
                <PillList items={matchedSkills} tone="solid" />
              </div>
              <div className="subsection">
                <h3>Recommended Skills</h3>
                <PillList items={profile.recommendedSkills} />
              </div>
            </Section>

            <div className="three-col">
              <Section title="Resume Tips & Ideas" subtitle="Quick ways to improve resume quality.">
                <ol className="number-list">
                  {(profile.resumeTips.length ? profile.resumeTips : suggestions).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </Section>

              <Section title="Courses & Certificates Recommendations" subtitle="Useful learning paths for the predicted field.">
                <ul className="link-list">
                  {(profile.recommendedCourses || []).map(([name, link]) => (
                    <li key={name}>
                      <a href={link} target="_blank" rel="noreferrer">
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Interview & Resume Tip Videos" subtitle="Curated video resources for quick preparation.">
                <div className="subsection">
                  <h3>Resume videos</h3>
                  <ul className="link-list">
                    {profile.resumeVideos.map(([name, link]) => (
                      <li key={name}>
                        <a href={link} target="_blank" rel="noreferrer">
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h3>Interview videos</h3>
                  <ul className="link-list">
                    {profile.interviewVideos.map(([name, link]) => (
                      <li key={name}>
                        <a href={link} target="_blank" rel="noreferrer">
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            </div>

            <Section title="Suggestions & Interview Questions" subtitle="Generated from the latest analysis.">
              <div className="two-col">
                <div>
                  <h3>Suggestions</h3>
                  <ol className="number-list">
                    {suggestions.length ? suggestions.map((item) => <li key={item}>{item}</li>) : <li>No suggestions yet.</li>}
                  </ol>
                </div>
                <div>
                  <h3>Interview Questions</h3>
                  <ol className="number-list">
                    {interviewQuestions.length ? (
                      interviewQuestions.map((item) => <li key={item}>{item}</li>)
                    ) : (
                      <li>No interview questions yet.</li>
                    )}
                  </ol>
                </div>
              </div>
            </Section>
          </div>
        ) : null}

        {activeTab === 'Feedback' ? (
          <div className="workspace-grid">
            <Section title="Feedback" subtitle="Rate the tool and leave a note for future improvements.">
              <div className="form-grid">
                <label className="field">
                  <span>Name</span>
                  <input
                    className="control"
                    value={feedbackForm.name}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    className="control"
                    value={feedbackForm.email}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="name@example.com"
                  />
                </label>
                <label className="field">
                  <span>Rating: {feedbackForm.score}</span>
                  <input
                    className="control"
                    type="range"
                    min="1"
                    max="5"
                    value={feedbackForm.score}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, score: Number(event.target.value) }))}
                  />
                </label>
                <label className="field field-wide">
                  <span>Comments</span>
                  <textarea
                    className="control textarea"
                    rows="5"
                    value={feedbackForm.comments}
                    onChange={(event) => setFeedbackForm((prev) => ({ ...prev, comments: event.target.value }))}
                    placeholder="Share what worked well and what should improve."
                  />
                </label>
              </div>
              <div className="action-row">
                <button className="primary-btn" onClick={handleFeedbackSubmit} type="button">
                  Submit Feedback
                </button>
              </div>
            </Section>

            <div className="stats-grid">
              <StatCard label="Total Feedback" value={totalFeedback} hint="Stored in MongoDB" />
              <StatCard label="Average Rating" value={averageRating} hint="Out of 5" />
              <StatCard label="Highest Score" value={feedbackHistory[0]?.score || 0} hint="Latest submitted rating" />
              <StatCard label="Latest Comment" value={feedbackHistory[0]?.comments ? 'Available' : 'None'} hint={feedbackHistory[0]?.name || 'No feedback yet'} />
            </div>

            <Section title="Past Feedback" subtitle="Recent comments and scores from users.">
              {feedbackHistory.length ? (
                <div className="history-list">
                  {feedbackHistory.map((item) => (
                    <article key={item._id} className="history-item">
                      <div className="history-top">
                        <strong>{item.name}</strong>
                        <span className="pill pill-solid">{item.score}/5</span>
                      </div>
                      <p className="muted">{item.email}</p>
                      <p>{item.comments || 'No comment provided.'}</p>
                      <small>{formatDate(item.createdAt)}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-preview">
                  <p>No feedback yet.</p>
                  <span>Once someone submits feedback, it will appear here.</span>
                </div>
              )}
            </Section>
          </div>
        ) : null}

        {activeTab === 'About' ? (
          <div className="workspace-grid">
            <Section
              title="AI Resume Analyzer"
              subtitle="A tool for resume analysis, predictions, and recommendations."
              action={<div className="score-badge">Light Mode</div>}
            >
              <div className="about-grid">
                <div>
                  <h3>About the project</h3>
                  <p>
                    The tool parses a resume, finds keywords, groups them into a likely field, and shows recommendations,
                    predictions, and analytics.
                  </p>
                </div>
                <div>
                  <h3>Scope</h3>
                  <ul className="number-list">
                    {ABOUT_POINTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Tech Stack</h3>
                  <ul className="info-list">
                    {TECH_STACK.map(([label, value]) => (
                      <li key={label}>
                        <strong>{label}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Requirements</h3>
                  <ul className="info-list">
                    {REQUIREMENTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        ) : null}

        {activeTab === 'Admin' ? (
          <div className="workspace-grid">
            <div className="stats-grid">
              <StatCard label="Uploaded Resumes" value={history.length} hint="Analysis records" />
              <StatCard label="Average ATS" value={history.length ? Math.round(history.reduce((sum, item) => sum + Number(item.atsScore || 0), 0) / history.length) : 0} hint="Across the history list" />
              <StatCard label="Feedback Count" value={feedbackHistory.length} hint="Submitted comments" />
              <StatCard label="Top Field" value={Object.entries(summaryByField).sort((a, b) => b[1] - a[1])[0]?.[0] || 'NA'} hint="Most common prediction" />
            </div>

            <Section
              title="Admin Summary"
              subtitle="Resume records, field breakdowns, experience mix, and export options."
              action={<button className="ghost-btn" onClick={downloadCsv} type="button">Download CSV</button>}
            >
              <div className="two-col">
                <div>
                  <h3>Predicted field distribution</h3>
                  <div className="bar-list">
                    {Object.keys(summaryByField).length ? (
                      Object.entries(summaryByField).map(([label, count]) => (
                        <div key={label} className="bar-row">
                          <span>{label}</span>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${Math.max(10, (count / history.length) * 100)}%` }} />
                          </div>
                          <strong>{count}</strong>
                        </div>
                      ))
                    ) : (
                      <p className="empty-note">No records yet.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3>Experience level mix</h3>
                  <div className="bar-list">
                    {Object.keys(summaryByExperience).length ? (
                      Object.entries(summaryByExperience).map(([label, count]) => (
                        <div key={label} className="bar-row">
                          <span>{label}</span>
                          <div className="bar-track">
                            <div className="bar-fill alt" style={{ width: `${Math.max(10, (count / history.length) * 100)}%` }} />
                          </div>
                          <strong>{count}</strong>
                        </div>
                      ))
                    ) : (
                      <p className="empty-note">No records yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Resume Table" subtitle="Latest saved analysis entries.">
              {history.length ? (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Field</th>
                        <th>ATS</th>
                        <th>Experience</th>
                        <th>File</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item._id}>
                          <td>{item.candidateName || item.resumeId?.candidateName || 'Unknown'}</td>
                          <td>{item.candidateEmail || item.resumeId?.candidateEmail || 'Not detected'}</td>
                          <td>{item.predictedField || 'NA'}</td>
                          <td>{item.atsScore ?? 0}</td>
                          <td>{item.experienceLevel || 'NA'}</td>
                          <td>{item.resumeId?.originalName || item.resumeId?.storedName || 'Resume.pdf'}</td>
                          <td>{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-preview">
                  <p>No uploaded resumes yet.</p>
                  <span>Upload a resume from the User tab to populate this table.</span>
                </div>
              )}
            </Section>
          </div>
        ) : null}
      </main>
    </div>
  );
}
