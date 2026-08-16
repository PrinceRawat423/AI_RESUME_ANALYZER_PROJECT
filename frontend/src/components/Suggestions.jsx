import React from 'react';

export default function Suggestions({ suggestions = [] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold">Improvement Suggestions</h3>
      <ul className="mt-4 space-y-3">
        {suggestions.length ? suggestions.map((item, index) => (
          <li key={`${item}-${index}`} className="rounded-2xl bg-slate-900/60 px-4 py-3 text-slate-200">
            {item}
          </li>
        )) : (
          <li className="text-slate-500">Run analysis to see suggestions here.</li>
        )}
      </ul>
    </section>
  );
}
