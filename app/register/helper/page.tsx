'use client';

import { useActionState, useState } from 'react';
import { signup, type AuthState } from '@/app/actions/auth';
import Link from 'next/link';

const categoryOptions = ['學科家教', '才藝老師', '陪玩姊姊', '家事管家', '接送服務', '特殊需求'];
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

export default function HelperRegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, undefined);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

  const toggle = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <h1>幫手註冊</h1>
        <p className="auth-subtitle">填寫你的專業資料，讓家長更認識你</p>

        <form action={action}>
          <input type="hidden" name="role" value="helper" />

          {/* 帳號資訊 */}
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

          {/* 所在地區 */}
          <div className="form-section">
            <h2>服務地區</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">縣市 *</label>
                <select id="city" name="city" required>
                  <option value="">選擇縣市</option>
                  <option value="台北市">台北市</option>
                  <option value="新北市">新北市</option>
                  <option value="桃園市">桃園市</option>
                  <option value="新竹市">新竹市</option>
                  <option value="新竹縣">新竹縣</option>
                  <option value="苗栗縣">苗栗縣</option>
                  <option value="台中市">台中市</option>
                  <option value="彰化縣">彰化縣</option>
                  <option value="南投縣">南投縣</option>
                  <option value="雲林縣">雲林縣</option>
                  <option value="嘉義市">嘉義市</option>
                  <option value="嘉義縣">嘉義縣</option>
                  <option value="台南市">台南市</option>
                  <option value="高雄市">高雄市</option>
                  <option value="屏東縣">屏東縣</option>
                  <option value="基隆市">基隆市</option>
                  <option value="宜蘭縣">宜蘭縣</option>
                  <option value="花蓮縣">花蓮縣</option>
                  <option value="台東縣">台東縣</option>
                  <option value="澎湖縣">澎湖縣</option>
                  <option value="金門縣">金門縣</option>
                  <option value="連江縣">連江縣</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="district">鄉鎮區</label>
                <input id="district" name="district" type="text" placeholder="例：東區" />
              </div>
            </div>
          </div>

          {/* 服務類別 */}
          <div className="form-section">
            <h2>服務類別 *</h2>
            <div className="chip-group">
              {categoryOptions.map((cat) => (
                <label key={cat} className={`chip ${selectedCats.includes(cat) ? 'active' : ''}`}>
                  <input
                    type="checkbox" name="categories" value={cat}
                    checked={selectedCats.includes(cat)}
                    onChange={() => toggle(selectedCats, setSelectedCats, cat)}
                    hidden
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* 專長標籤 */}
          <div className="form-section">
            <h2>專長標籤</h2>
            <p className="form-hint">選擇你擅長的項目，家長搜尋時會更容易找到你</p>
            <div className="chip-group">
              {tagSuggestions.map((tag) => (
                <label key={tag} className={`chip chip-sm ${selectedTags.includes(tag) ? 'active' : ''}`}>
                  <input
                    type="checkbox" name="tags" value={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggle(selectedTags, setSelectedTags, tag)}
                    hidden
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* 經歷與收費 */}
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

          {/* 證照 */}
          <div className="form-section">
            <h2>持有證照</h2>
            <div className="chip-group">
              {certOptions.map((cert) => (
                <label key={cert} className={`chip ${selectedCerts.includes(cert) ? 'active' : ''}`}>
                  <input
                    type="checkbox" name="certifications" value={cert}
                    checked={selectedCerts.includes(cert)}
                    onChange={() => toggle(selectedCerts, setSelectedCerts, cert)}
                    hidden
                  />
                  {cert}
                </label>
              ))}
            </div>
          </div>

          {/* 可服務時段 */}
          <div className="form-section">
            <h2>可服務時段</h2>
            <p className="form-hint">選擇你可以服務的日子</p>
            <div className="chip-group">
              {dayOptions.map((day) => (
                <label key={day} className={`chip chip-day ${selectedDays.includes(day) ? 'active' : ''}`}>
                  <input
                    type="checkbox" name="availableDays" value={day}
                    checked={selectedDays.includes(day)}
                    onChange={() => toggle(selectedDays, setSelectedDays, day)}
                    hidden
                  />
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

          {/* 自我介紹 */}
          <div className="form-section">
            <h2>自我介紹</h2>
            <div className="form-group">
              <label htmlFor="bio">介紹你自己</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="例：我是師大畢業的，有五年教學經驗。最擅長用遊戲方式讓孩子愛上學習..."
              />
            </div>
          </div>

          {state?.error && <div className="form-error">{state.error}</div>}

          <button type="submit" className="form-submit" disabled={pending}>
            {pending ? '註冊中...' : '完成註冊，送出審核'}
          </button>
          <p className="form-note">送出後我們會進行審核，通過後即可開始接案。</p>
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
