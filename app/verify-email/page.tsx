'use client';

import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>驗證你的 Email</h1>
        <p className="auth-subtitle" style={{ marginBottom: 24 }}>
          我們已經寄了一封驗證信到你的信箱。<br />
          請點擊信中的連結來完成帳號驗證。
        </p>

        <div style={{ background: 'var(--sage-light)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.7 }}>
          <p><strong>沒收到信？</strong></p>
          <ul style={{ paddingLeft: 20, margin: '8px 0 0' }}>
            <li>請檢查垃圾郵件資料夾</li>
            <li>確認你填寫的 Email 地址正確</li>
            <li>稍等幾分鐘後重試</li>
          </ul>
        </div>

        <p className="auth-switch">
          <Link href="/login">返回登入頁面</Link>
        </p>
      </div>
    </div>
  );
}
