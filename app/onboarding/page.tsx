'use client';

import { useActionState, useState } from 'react';
import { createOAuthProfile, saveProfileDetails, type OnboardingState } from '@/app/actions/onboarding';
import { TAIWAN_CITIES } from '@/lib/taiwan-cities';
import Link from 'next/link';

const categoryOptions = ['家教', '陪玩', '管家'];
const tagSuggestions = [
  '國小數學', '國中數理', '英文', '自然科學', '高中物理', '程式入門',
  '美術創作', '手作', '繪本共讀', '鋼琴', '音樂律動',
  '創意遊戲', '戶外活動', '情緒引導',
  '輕整理', '採買', '煮飯',
  '上下學接送', '課後安親',
  '特教背景', '感統訓練', '社交技巧',
];
const dayOptions = ['一', '二', '三', '四', '五', '六', '日'];
const certOptions = ['教師證', '保母證', '護理師證照', '心理諮商', '特教證照', '急救證照'];
const needOptions = ['家教', '陪玩姊姊', '管家', '接送', '才藝老師', '特殊需求'];

export default function OnboardingPage() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<'parent' | 'helper' | ''>('');
  const [roleState, roleAction, rolePending] = useActionState<OnboardingState, FormData>(createOAuthProfile, undefined);
  const [detailState, detailAction, detailPending] = useActionState<OnboardingState, FormData>(saveProfileDetails, undefined);

  // Helper state
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  // Parent state
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [childInputs, setChildInputs] = useState(['']);

  const toggle = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  // If role was just set via OAuth profile creation, advance to details
  if (roleState?.success && step === 'role') {
    setStep('details');
  }

  // Step 1: Choose role (for OAuth users)
  if (step === 'role') {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <Link href="/" className="auth-logo">
            <span className="logo-icon">L</span>
            <span className="logo-text">Lessen</span>
          </Link>
          <h1>歡迎加入 Lessen！</h1>
          <p className="auth-subtitle">請選擇你的身份</p>

          <form action={roleAction}>
            <input type="hidden" name="role" value={role} />

            <div className="role-cards">
              <button type="button" className={`role-card ${role === 'parent' ? 'selected' : ''}`} onClick={() => setRole('parent')}>
                <div className="role-emoji">👨‍👩‍👧</div>
                <h3>我是家長</h3>
                <p>找到合適的幫手</p>
              </button>
              <button type="button" className={`role-card ${role === 'helper' ? 'selected' : ''}`} onClick={() => setRole('helper')}>
                <div className="role-emoji">🙋‍♀️</div>
                <h3>我是幫手</h3>
                <p>上架你的服務</p>
              </button>
            </div>

            {roleState?.error && <div className="form-error">{roleState.error}</div>}

            <button type="submit" className="form-submit" disabled={!role || rolePending}>
              {rolePending ? '處理中...' : '繼續'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Fill details
  const activeRole = role || 'parent';

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>完善你的資料</h1>
        <p className="auth-subtitle">
          {activeRole === 'helper'
            ? '填寫服務資料，讓家長更容易找到你'
            : '補充資料讓我們更了解你的需求（可稍後再填）'}
        </p>

        <form action={detailAction}>
          {/* 基本資料 */}
          <div className="form-section">
            <h2>基本資料</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">手機號碼</label>
                <input id="phone" name="phone" type="tel" placeholder="09xx-xxx-xxx" />
              </div>
              <div className="form-group">
                <label htmlFor="city">縣市 {activeRole === 'helper' ? '*' : ''}</label>
                <select id="city" name="city" required={activeRole === 'helper'}>
                  <option value="">選擇縣市</option>
                  {TAIWAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="district">鄉鎮區</label>
              <input id="district" name="district" type="text" placeholder="例：東區" />
            </div>
          </div>

          {/* Helper-specific fields */}
          {activeRole === 'helper' && (
            <>
              <div className="form-section">
                <h2>服務類別 *</h2>
                <p className="form-hint">至少選擇一項，即可自動通過審核</p>
                <div className="chip-group">
                  {categoryOptions.map((cat) => (
                    <label key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`}>
                      <input type="checkbox" name="categories" value={cat} checked={selectedCats.includes(cat)} onChange={() => toggle(selectedCats, setSelectedCats, cat)} hidden />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>專長標籤</h2>
                <div className="chip-group">
                  {tagSuggestions.map((tag) => (
                    <label key={tag} className={`chip chip-sm ${selectedTags.includes(tag) ? 'active' : ''}`}>
                      <input type="checkbox" name="tags" value={tag} checked={selectedTags.includes(tag)} onChange={() => toggle(selectedTags, setSelectedTags, tag)} hidden />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>經歷與收費</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experienceYears">相關經驗（年）</label>
                    <input id="experienceYears" name="experienceYears" type="number" min="0" placeholder="例：3" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hourlyRate">時薪（NT$）</label>
                    <input id="hourlyRate" name="hourlyRate" type="number" min="0" placeholder="例：400" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>持有證照</h2>
                <div className="chip-group">
                  {certOptions.map((cert) => (
                    <label key={cert} className={`chip ${selectedCerts.includes(cert) ? 'active' : ''}`}>
                      <input type="checkbox" name="certifications" value={cert} checked={selectedCerts.includes(cert)} onChange={() => toggle(selectedCerts, setSelectedCerts, cert)} hidden />
                      {cert}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>可服務時段</h2>
                <div className="chip-group">
                  {dayOptions.map((day) => (
                    <label key={day} className={`chip chip-day ${selectedDays.includes(day) ? 'active' : ''}`}>
                      <input type="checkbox" name="availableDays" value={day} checked={selectedDays.includes(day)} onChange={() => toggle(selectedDays, setSelectedDays, day)} hidden />
                      {day}
                    </label>
                  ))}
                </div>
                <div className="form-row" style={{ marginTop: 16 }}>
                  <div className="form-group">
                    <label htmlFor="availableTimeStart">開始時間</label>
                    <input id="availableTimeStart" name="availableTimeStart" type="time" defaultValue="09:00" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableTimeEnd">結束時間</label>
                    <input id="availableTimeEnd" name="availableTimeEnd" type="time" defaultValue="18:00" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>自我介紹</h2>
                <div className="form-group">
                  <label htmlFor="bio">介紹你自己</label>
                  <textarea id="bio" name="bio" rows={4} placeholder="例：我是師大畢業的，有五年教學經驗。最擅長用遊戲方式讓孩子愛上學習..." />
                </div>
              </div>
            </>
          )}

          {/* Parent-specific fields */}
          {activeRole === 'parent' && (
            <>
              <div className="form-section">
                <h2>孩子資訊</h2>
                {childInputs.map((val, i) => (
                  <div key={i} className="form-row" style={{ alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>孩子 {i + 1} 年齡</label>
                      <input name="childrenAges" type="text" placeholder="例：5歲" value={val} onChange={(e) => setChildInputs((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))} />
                    </div>
                    {childInputs.length > 1 && (
                      <button type="button" className="form-btn-icon" onClick={() => setChildInputs((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" className="form-btn-add" onClick={() => setChildInputs((prev) => [...prev, ''])}>+ 新增一位孩子</button>
              </div>

              <div className="form-section">
                <h2>需要什麼服務？</h2>
                <div className="chip-group">
                  {needOptions.map((need) => (
                    <label key={need} className={`chip ${selectedNeeds.includes(need) ? 'active' : ''}`}>
                      <input type="checkbox" name="needs" value={need} checked={selectedNeeds.includes(need)} onChange={() => toggle(selectedNeeds, setSelectedNeeds, need)} hidden />
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
                  <label htmlFor="notes">其他需求</label>
                  <textarea id="notes" name="notes" rows={3} placeholder="例：孩子有過敏體質、需要英文教學..." />
                </div>
              </div>
            </>
          )}

          {detailState?.error && <div className="form-error">{detailState.error}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            {activeRole === 'parent' && (
              <a href="/dashboard" className="form-submit" style={{ textAlign: 'center', textDecoration: 'none', background: 'var(--cream-warm)', color: 'var(--text-secondary)', flex: 1 }}>
                稍後再填
              </a>
            )}
            <button type="submit" className="form-submit" style={{ flex: 1 }} disabled={detailPending}>
              {detailPending ? '儲存中...' : '儲存資料'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
