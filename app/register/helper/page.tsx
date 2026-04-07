'use client';

import { useActionState, useState } from 'react';
import { signup, type AuthState } from '@/app/actions/auth';
import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons';
import { getPasswordStrength } from '@/lib/validation';

export default function HelperRegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
  const [password, setPassword] = useState('');
  const pwStrength = password ? getPasswordStrength(password) : null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>幫手註冊</h1>
        <p className="auth-subtitle">先建立帳號，之後再填寫完整的服務資料</p>

        <OAuthButtons />

        <div className="auth-divider"><span>或用 Email 註冊</span></div>

        <form action={action}>
          <input type="hidden" name="role" value="helper" />

          <div className="form-group">
            <label htmlFor="fullName">姓名 *</label>
            <input id="fullName" name="fullName" type="text" placeholder="你的姓名" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" placeholder="your@email.com" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">密碼 *</label>
              <input id="password" name="password" type="password" placeholder="至少 8 字元，含大小寫英文及數字" required value={password} onChange={(e) => setPassword(e.target.value)} />
              {pwStrength && (
                <div className={`password-strength strength-${pwStrength}`}>
                  密碼強度：{pwStrength === 'weak' ? '弱' : pwStrength === 'medium' ? '中' : '強'}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">確認密碼 *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="再輸入一次密碼" required />
            </div>
          </div>

          {state?.error && <div className="form-error">{state.error}</div>}

          <button type="submit" className="form-submit" disabled={pending}>
            {pending ? '註冊中...' : '建立帳號'}
          </button>
          <p className="form-note">建立帳號後，填完服務資料即可自動通過審核開始接案。</p>
        </form>

        <p className="auth-switch">
          已經有帳號？<Link href="/login">登入</Link>
          　|　<Link href="/register">返回選擇身份</Link>
        </p>
      </div>
    </div>
  );
}
