import React from 'react';
import { useState } from 'react';
import { resumeApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a PDF file first.');

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    try {
      const uploadResponse = await resumeApi.upload(formData);
      const resumeId = uploadResponse.data.resume._id;
      await resumeApi.analyze({ resumeId, jobDescription });
      setMessage('Resume uploaded and analyzed successfully.');
      navigate('/analysis');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Resume Upload</p>
        <h1 className="mt-3 text-4xl font-bold">Upload your PDF resume</h1>
        <p className="mt-3 text-slate-400">
          The backend extracts text from the PDF, calculates ATS score, and generates suggestions.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full rounded-2xl border border-dashed border-white/20 bg-slate-900 px-4 py-4"
          />
          <textarea
            rows="5"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Optional job description to improve ATS score relevance..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
          />
          {message && <p className="text-sm text-cyan-300">{message}</p>}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60"
          >
            {loading ? 'Uploading...' : 'Upload and Analyze'}
          </button>
        </div>
      </section>
    </main>
  );
}
