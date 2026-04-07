'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from '@/app/actions/password';
import type { AuthState } from '@/app/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(requestPasswordReset, undefined);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>忘記密碼</h1>
        <p className="auth-subtitle">輸入你的 Email，我們會寄送重設密碼的連結</p>

        {state?.success ? (
          <div style={{ background: 'var(--sage-light)', borderRadius: 12, padding: '20px 24px', marginTop: 24, fontSize: '0.95rem', lineHeight: 1.7 }}>
            <p><strong>已發送重設信！</strong></p>
            <p>如果此 Email 已註冊，你將會收到一封密碼重設信件。請檢查你的信箱（包括垃圾郵件資料夾）。</p>
          </div>
        ) : (
          <form action={action}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>

            {state?.error && <div className="form-error">{state.error}</div>}

            <button type="submit" className="form-submit" disabled={pending}>
              {pending ? '發送中...' : '發送重設連結'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          <Link href="/login">返回登入</Link>
        </p>
      </div>
    </div>
  );
}
