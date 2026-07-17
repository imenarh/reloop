'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [showPw, setShowPw] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    // Front-end only for now — swap this for a real auth request once the backend is ready.
    console.log('Login submitted (no backend wired up yet):', { email });
  }

  return (


<div className="auth-page">

  {/* LEFT: brand panel */}
  <div className="auth-visual">
    <Link href="/" className="logo"><span className="dot"></span>ReLoop</Link>

    
  </div>

  {/* RIGHT: login form */}
  <div className="auth-form-side">
    <div className="auth-box">
      <div className="eyebrow">Welcome back</div>
      <h1>Log in to ReLoop</h1>
      <p className="auth-sub">Pick up where you left off — sell, buy, or give something a second life.</p>

      {error && <div className="form-error" style={{ display: "block" }}>{error}</div>}

      <div className="oauth-row">
        <button type="button" className="btn-oauth">
          <svg className="oauth-icon" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-4.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2 1.5-4.6 2.4-7.5 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 40.6 16.3 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.4C41.3 36 44 30.6 44 24c0-1.4-.1-2.7-.4-3.5z"/></svg>
          Continue with Google
        </button>
        <button type="button" className="btn-oauth">
          <svg className="oauth-icon" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>
          Continue with Facebook
        </button>
      </div>

      <div className="divider">or log in with email</div>

      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="you@example.com" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <input type={showPw ? "text" : "password"} id="password" name="password" placeholder="Enter your password" required />
            <button type="button" className="toggle-pw" onClick={() => setShowPw(!showPw)}>{showPw ? "Hide" : "Show"}</button>
          </div>
        </div>

        <div className="form-row-between">
          <label className="remember-me">
            <input type="checkbox" name="remember" />
            Remember me
          </label>
          <a href="#" className="link-ochre">Forgot password?</a>
        </div>

        <button type="submit" className="btn btn-teal btn-block">Log in →</button>
      </form>

      <div className="auth-switch">
        New to ReLoop? <a href="#" className="link-ochre">Create an account</a>
      </div>
    </div>
  </div>

</div>




  );
}