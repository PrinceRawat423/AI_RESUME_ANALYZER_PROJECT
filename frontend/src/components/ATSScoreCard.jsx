import React from 'react';

export default function ATSScoreCard({ score = 0, matchedSkills = [], missingSkills = [] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">ATS Score</p>
          <h3 className="mt-2 text-3xl font-bold">{score}/100</h3>
        </div>
        <div className="h-24 w-24 rounded-full border-8 border-slate-800 border-t-cyan-400" />
      </div>
      <div className="mt-4 h-3 rounded-full bg-slate-800">
        <div className="h-3 rounded-full bg-cyan-400" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-400">Matched Skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {matchedSkills.length ? matchedSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                {skill}
              </span>
            )) : <span className="text-slate-500">No skills detected</span>}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-400">Missing Skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingSkills.length ? missingSkills.map((skill) => (
              <span key={skill} className="rounded-full bg-rose-500/15 px-3 py-1 text-sm text-rose-300">
                {skill}
              </span>
            )) : <span className="text-slate-500">None</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
