import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await authApi.register(form);
      login(data);
      setAuthToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Get started</p>
          <h1 className="mt-4 text-4xl font-bold">Create your account in one minute.</h1>
          <p className="mt-4 text-slate-400">
            The app keeps history of uploaded resumes and generated analysis so you can compare improvements over time.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <h2 className="text-2xl font-semibold">Register</h2>
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
            />
            {message && <p className="text-sm text-rose-300">{message}</p>}
            <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">
              Create Account
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-cyan-300">Login here</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
