'use client';

import { useActionState } from 'react';
import { signin, type AuthState } from '@/app/actions/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';
  const [state, action, pending] = useActionState<AuthState, FormData>(signin, undefined);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>歡迎回來</h1>
        <p className="auth-subtitle">登入你的帳號</p>

        <form action={action}>
          <input type="hidden" name="redirect" value={redirectTo} />

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="至少 6 個字元"
              required
            />
          </div>

          {state?.error && <div className="form-error">{state.error}</div>}

          <button type="submit" className="form-submit" disabled={pending}>
            {pending ? '登入中...' : '登入'}
          </button>
        </form>

        <p className="auth-switch">
          還沒有帳號？<Link href="/register">立即註冊</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
