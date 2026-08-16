import React from 'react';
import { useEffect, useState } from 'react';
import ATSScoreCard from '../components/ATSScoreCard';
import SkillChart from '../components/SkillChart';
import Suggestions from '../components/Suggestions';
import { resumeApi } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const latest = await resumeApi.latest();
        setAnalysis(latest.data.analysis);
      } catch (error) {
        setAnalysis(null);
      }

      try {
        const historyResponse = await resumeApi.history();
        setHistory(historyResponse.data.history || []);
      } catch (error) {
        setHistory([]);
      }
    }

    loadData();
  }, []);

  return (
    <main style={{ margin: '0 auto', maxWidth: 1280, padding: '40px 24px', color: '#e2e8f0' }}>
      <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, background: 'rgba(255,255,255,0.05)', padding: 32 }}>
        <p style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#67e8f9' }}>Dashboard</p>
        <h1 style={{ marginTop: 12, fontSize: 44, lineHeight: 1.1, fontWeight: 800 }}>Resume analyzer and interview coach.</h1>
        <p style={{ marginTop: 12, maxWidth: 720, color: '#94a3b8' }}>
          Upload a resume, analyze it, see ATS score, learn missing skills, and practice interview questions.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
          <Link to="/upload" style={{ borderRadius: 999, background: '#22d3ee', color: '#020617', padding: '12px 20px', fontWeight: 700 }}>
            Upload Resume
          </Link>
          <Link to="/analysis" style={{ borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', fontWeight: 700 }}>
            View Analysis
          </Link>
          <Link to="/coach" style={{ borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', fontWeight: 700 }}>
            Interview Coach
          </Link>
        </div>
      </section>

      <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: 32 }}>
        <ATSScoreCard
          score={analysis?.atsScore || 0}
          matchedSkills={analysis?.matchedSkills || []}
          missingSkills={analysis?.missingSkills || []}
        />
        <SkillChart
          matchedSkills={analysis?.matchedSkills || []}
          missingSkills={analysis?.missingSkills || []}
        />
      </div>

      <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: 32 }}>
        <Suggestions suggestions={analysis?.suggestions || []} />
        <section style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, background: 'rgba(255,255,255,0.05)', padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>Analysis History</h3>
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            {history.length ? history.map((item) => (
              <div key={item._id} style={{ borderRadius: 16, background: 'rgba(15,23,42,0.7)', padding: 16 }}>
                <p style={{ fontWeight: 600 }}>ATS Score: {item.atsScore}</p>
                <p style={{ fontSize: 14, color: '#cbd5e1' }}>
                  Resume: {item.resumeId?.originalName || 'Uploaded resume'}
                </p>
                <p style={{ fontSize: 14, color: '#94a3b8' }}>
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            )) : (
              <p style={{ color: '#64748b' }}>No history yet. Upload and analyze a resume first.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
