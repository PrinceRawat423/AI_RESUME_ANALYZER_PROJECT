import React from 'react';
import { useState } from 'react';
import { interviewApi } from '../services/api';

export default function Chatbot({ context = '' }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask me anything about your interview preparation.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await interviewApi.chat({ question: userMessage, context });
      setMessages((prev) => [...prev, { role: 'assistant', text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I could not generate a reply right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-xl font-semibold">AI Interview Chatbot</h3>
      <div className="mt-4 max-h-96 space-y-3 overflow-auto rounded-2xl bg-slate-900/60 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'ml-auto bg-cyan-400 text-slate-950'
                : 'bg-white/10 text-slate-100'
            }`}
          >
            {message.text}
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400">Thinking...</div>}
      </div>
      <div className="mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-500"
        />
        <button
          onClick={sendMessage}
          className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Send
        </button>
      </div>
    </section>
  );
}
