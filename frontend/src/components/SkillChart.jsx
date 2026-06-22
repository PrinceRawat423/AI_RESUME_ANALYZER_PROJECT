import React from 'react';

export default function SkillChart({ matchedSkills = [], missingSkills = [] }) {
  const matched = matchedSkills.length;
  const missing = missingSkills.length;
  const total = Math.max(matched + missing, 1);
  const matchedWidth = `${(matched / total) * 100}%`;
  const missingWidth = `${(missing / total) * 100}%`;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold">Skill Overview</h3>
      <p className="mt-1 text-sm text-slate-400">A simple view of matched and missing skills.</p>
      <div className="mt-6 space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Matched Skills</span>
            <span>{matched}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800">
            <div className="h-3 rounded-full bg-cyan-400" style={{ width: matchedWidth }} />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Missing Skills</span>
            <span>{missing}</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800">
            <div className="h-3 rounded-full bg-rose-400" style={{ width: missingWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}
