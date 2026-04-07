'use client';

import Link from 'next/link';
import OAuthButtons from '@/components/OAuthButtons';

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>加入 Lessen</h1>
        <p className="auth-subtitle">快速登入或選擇身份開始註冊</p>

        <OAuthButtons />

        <div className="auth-divider"><span>或選擇身份註冊</span></div>

        <div className="role-cards">
          <Link href="/register/parent" className="role-card">
            <div className="role-emoji">👨‍👩‍👧</div>
            <h3>我是家長</h3>
            <p>找到合適的家教、陪玩姊姊或管家。</p>
            <span className="role-arrow">開始註冊 →</span>
          </Link>

          <Link href="/register/helper" className="role-card">
            <div className="role-emoji">🙋‍♀️</div>
            <h3>我是幫手</h3>
            <p>上架你的服務，接觸更多家庭。</p>
            <span className="role-arrow">開始註冊 →</span>
          </Link>
        </div>

        <p className="auth-switch">
          已經有帳號？<Link href="/login">登入</Link>
        </p>
      </div>
    </div>
  );
}
