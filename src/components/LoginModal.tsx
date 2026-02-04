'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiFetch, setToken } from '@/lib/api';

type Mode = 'login' | 'signup';

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const rehydrate = useAuthStore.persist?.rehydrate;

  useEffect(() => {
    if (typeof rehydrate === 'function') rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
      setError('');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('open-login', onOpen as EventListener);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-login', onOpen as EventListener);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailTrim = email.trim();
    const passwordTrim = password.trim();
    if (!emailTrim || !passwordTrim) {
      setError(mode === 'signup' ? 'Email and password required' : 'Email and password required');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await apiFetch<{ token: string; user: Parameters<typeof setUser>[0] }>(
          '/auth/login',
          { method: 'POST', body: JSON.stringify({ email: emailTrim, password: passwordTrim }), skipAuth: true }
        );
        setToken(data.token);
        setUser(data.user);
      } else {
        const data = await apiFetch<{ token: string; user: Parameters<typeof setUser>[0] }>(
          '/auth/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              email: emailTrim,
              password: passwordTrim,
              name: name.trim(),
              phone: phone.trim() || undefined,
            }),
            skipAuth: true,
          }
        );
        setToken(data.token);
        setUser(data.user);
      }
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ isolation: 'isolate' }}>
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative ml-auto w-full max-w-[420px] h-full bg-white shadow-xl p-8 overflow-auto">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>

        <form onSubmit={handleSubmit} className="max-w-[320px] mx-auto mt-8">
          <h2 className="text-2xl font-extrabold mb-2">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? (
              <>or <button type="button" onClick={() => { setMode('signup'); setError(''); }} className="text-swiggy-orange bg-transparent border-0 cursor-pointer p-0 font-inherit hover:underline">create an account</button></>
            ) : (
              <>or <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-swiggy-orange bg-transparent border-0 cursor-pointer p-0 font-inherit hover:underline">login</button></>
            )}
          </p>

          {mode === 'signup' && (
            <>
              <label className="block text-xs text-gray-600 mb-2">Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-200 rounded px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-swiggy-orange"
                autoComplete="name"
              />
            </>
          )}

          <label className="block text-xs text-gray-600 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-200 rounded px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-swiggy-orange"
            autoComplete="email"
          />

          <label className="block text-xs text-gray-600 mb-2">Password</label>
          <input
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            type="password"
            placeholder="Enter password"
            className="w-full border border-gray-200 rounded px-3 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-swiggy-orange"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          {mode === 'signup' && (
            <>
              <label className="block text-xs text-gray-600 mb-2 mt-4">Phone (optional)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="10-digit phone"
                className="w-full border border-gray-200 rounded px-3 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-swiggy-orange"
              />
            </>
          )}

          {error && (
            <p className="text-xs text-red-600 mb-4" role="alert">{error}</p>
          )}
          {!error && <div className="mb-4" />}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-swiggy-orange text-white py-3 rounded font-semibold hover:brightness-95 transition cursor-pointer disabled:opacity-70"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>

          <p className="text-[11px] text-gray-500 mt-4">By continuing, I accept the <button type="button" onClick={(e) => e.preventDefault()} className="underline bg-transparent border-0 cursor-default p-0 font-inherit">Terms & Conditions</button> & <button type="button" onClick={(e) => e.preventDefault()} className="underline bg-transparent border-0 cursor-default p-0 font-inherit">Privacy Policy</button></p>
        </form>
      </div>
    </div>
  );
}
