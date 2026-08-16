import React from 'react';
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';
import { interviewApi } from '../services/api';

export default function InterviewCoach() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data } = await interviewApi.questions({});
        setQuestions(data.questions || []);
      } catch (error) {
        setQuestions([]);
      }
    }

    loadQuestions();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Interview Coach</p>
        <h1 className="mt-3 text-4xl font-bold">Practice smart interview answers</h1>
        <p className="mt-3 text-slate-400">Use the generated questions and chatbot to prepare confidently.</p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Generated Questions</h3>
          <ul className="mt-4 space-y-3">
            {questions.length ? questions.map((question, index) => (
              <li key={`${question}-${index}`} className="rounded-2xl bg-slate-900/60 px-4 py-3">
                {question}
              </li>
            )) : <li className="text-slate-500">Questions will appear after resume analysis.</li>}
          </ul>
        </section>
        <Chatbot context={questions.join('\n')} />
      </div>
    </main>
  );
}
