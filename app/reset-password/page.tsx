'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { validatePassword, getPasswordStrength } from '@/lib/validation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const pwStrength = password ? getPasswordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const pwResult = validatePassword(password);
    if (!pwResult.valid) {
      setError(pwResult.message);
      return;
    }
    if (password !== confirmPassword) {
      setError('兩次密碼輸入不一致');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>重設密碼</h1>

        {success ? (
          <div style={{ background: 'var(--sage-light)', borderRadius: 12, padding: '20px 24px', marginTop: 24, fontSize: '0.95rem', lineHeight: 1.7 }}>
            <p><strong>密碼已成功重設！</strong></p>
            <p>你現在可以使用新密碼登入。</p>
            <Link href="/login" className="form-submit" style={{ display: 'block', textAlign: 'center', marginTop: 16, textDecoration: 'none' }}>
              前往登入
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">新密碼</label>
              <input
                id="password"
                type="password"
                placeholder="至少 8 字元，含大小寫英文及數字"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {pwStrength && (
                <div className={`password-strength strength-${pwStrength}`}>
                  密碼強度：{pwStrength === 'weak' ? '弱' : pwStrength === 'medium' ? '中' : '強'}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">確認新密碼</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="再輸入一次密碼"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? '更新中...' : '更新密碼'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
