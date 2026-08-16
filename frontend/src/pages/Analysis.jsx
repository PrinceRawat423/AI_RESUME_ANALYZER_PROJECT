import React from 'react';
import { useEffect, useState } from 'react';
import ATSScoreCard from '../components/ATSScoreCard';
import SkillChart from '../components/SkillChart';
import Suggestions from '../components/Suggestions';
import { resumeApi } from '../services/api';

export default function Analysis() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const { data } = await resumeApi.latest();
        setAnalysis(data.analysis);
      } catch (error) {
        setAnalysis(null);
      }
    }

    loadLatest();
  }, []);

  if (!analysis) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-bold">No analysis yet</h1>
          <p className="mt-3 text-slate-400">Upload a resume first to see ATS score and suggestions here.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Latest Analysis</h1>
      <p className="mt-3 text-slate-400">Resume text, ATS score, skills, and improvement tips.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ATSScoreCard
          score={analysis.atsScore}
          matchedSkills={analysis.matchedSkills}
          missingSkills={analysis.missingSkills}
        />
        <SkillChart matchedSkills={analysis.matchedSkills} missingSkills={analysis.missingSkills} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Suggestions suggestions={analysis.suggestions || []} />
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Suggested Interview Questions</h3>
          <ul className="mt-4 space-y-3">
            {(analysis.interviewQuestions || []).map((question, index) => (
              <li key={`${question}-${index}`} className="rounded-2xl bg-slate-900/60 px-4 py-3">
                {question}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
