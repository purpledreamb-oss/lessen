'use client';

import { useActionState, useState } from 'react';
import { signup, type AuthState } from '@/app/actions/auth';
import Link from 'next/link';

const needOptions = ['家教', '陪玩姊姊', '管家', '接送', '才藝老師', '特殊需求'];

export default function ParentRegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [childInputs, setChildInputs] = useState(['']);

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const addChild = () => setChildInputs((prev) => [...prev, '']);
  const removeChild = (i: number) => setChildInputs((prev) => prev.filter((_, idx) => idx !== i));
  const updateChild = (i: number, val: string) =>
    setChildInputs((prev) => prev.map((v, idx) => (idx === i ? val : v)));

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>家長註冊</h1>
        <p className="auth-subtitle">填寫基本資料，開始找到合適的幫手</p>

        <form action={action}>
          <input type="hidden" name="role" value="parent" />

          <div className="form-section">
            <h2>帳號資訊</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">姓名 *</label>
                <input id="fullName" name="fullName" type="text" placeholder="你的姓名" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">手機號碼 *</label>
                <input id="phone" name="phone" type="tel" placeholder="09xx-xxx-xxx" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">密碼 *</label>
                <input id="password" name="password" type="password" placeholder="至少 6 個字元" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">確認密碼 *</label>
                <input id="confirmPassword" name="confirmPassword" type="password" placeholder="再輸入一次密碼" required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>所在地區</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">縣市 *</label>
                <select id="city" name="city" required>
                  <option value="">選擇縣市</option>
                  <option value="新竹市">新竹市</option>
                  <option value="新竹縣">新竹縣</option>
                  <option value="台北市">台北市</option>
                  <option value="新北市">新北市</option>
                  <option value="桃園市">桃園市</option>
                  <option value="台中市">台中市</option>
                  <option value="高雄市">高雄市</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="district">鄉鎮區</label>
                <input id="district" name="district" type="text" placeholder="例：東區" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>孩子資訊</h2>
            {childInputs.map((val, i) => (
              <div key={i} className="form-row" style={{ alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>孩子 {i + 1} 年齡</label>
                  <input
                    name="childrenAges"
                    type="text"
                    placeholder="例：5歲"
                    value={val}
                    onChange={(e) => updateChild(i, e.target.value)}
                  />
                </div>
                {childInputs.length > 1 && (
                  <button type="button" className="form-btn-icon" onClick={() => removeChild(i)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" className="form-btn-add" onClick={addChild}>+ 新增一位孩子</button>
          </div>

          <div className="form-section">
            <h2>需要什麼服務？</h2>
            <div className="chip-group">
              {needOptions.map((need) => (
                <label key={need} className={`chip ${selectedNeeds.includes(need) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    name="needs"
                    value={need}
                    checked={selectedNeeds.includes(need)}
                    onChange={() => toggleNeed(need)}
                    hidden
                  />
                  {need}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>其他備註</h2>
            <div className="form-group">
              <label htmlFor="preferredTime">偏好服務時段</label>
              <input id="preferredTime" name="preferredTime" type="text" placeholder="例：平日下午 2-6 點" />
            </div>
            <div className="form-group">
              <label htmlFor="notes">其他需求或注意事項</label>
              <textarea id="notes" name="notes" rows={3} placeholder="例：孩子有過敏體質、需要英文教學..." />
            </div>
          </div>

          {state?.error && <div className="form-error">{state.error}</div>}

          <button type="submit" className="form-submit" disabled={pending}>
            {pending ? '註冊中...' : '完成註冊'}
          </button>
        </form>

        <p className="auth-switch">
          已經有帳號？<Link href="/login">登入</Link>
          　|
          <Link href="/register">返回選擇身份</Link>
        </p>
      </div>
    </div>
  );
}
