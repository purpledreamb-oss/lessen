'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  // Scroll detection for nav
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const helpers = [
    {
      emoji: '👩‍🏫', name: '林佳慧', location: '台北市', badge: '人氣幫手',
      tags: ['國小數學', '英文', '自然科學'],
      bio: '師大畢業、五年教學經驗。最擅長把數學變成遊戲，讓孩子笑著笑著就學會了。',
      rating: '4.9', price: 'NT$400/hr',
    },
    {
      emoji: '🎮', name: '陳雅婷', location: '新北市', badge: '好評幫手',
      tags: ['特殊需求友善', '創意遊戲', '情緒引導'],
      bio: '特教系出身，曾陪伴亞斯伯格症的孩子三年。溫柔又有耐心，總能用創意遊戲打開孩子的心。',
      rating: '5.0', price: 'NT$350/hr',
    },
    {
      emoji: '🏠', name: '王淑芬', location: '桃園市', badge: '新進幫手',
      tags: ['接送', '採買', '輕整理'],
      bio: '三年管家經驗，從接送到採買都能安心託付。做事細心、個性隨和，很多家庭都把她當自家人。',
      rating: '4.8', price: 'NT$300/hr',
    },
    {
      emoji: '🎨', name: '張雨萱', location: '台中市', badge: '好評幫手',
      tags: ['美術創作', '手作', '繪本共讀'],
      bio: '美術系畢業，帶過幼兒園美術課兩年。用畫筆和故事帶孩子探索世界。',
      rating: '4.9', price: 'NT$380/hr',
    },
    {
      emoji: '📐', name: '李宗翰', location: '新竹市', badge: '人氣幫手',
      tags: ['國中數理', '高中物理', '程式入門'],
      bio: '清大理工背景，擅長用生活實例解釋抽象概念。帶過超過 30 位國中生，段考平均進步 15 分。',
      rating: '4.9', price: 'NT$500/hr',
    },
    {
      emoji: '🎹', name: '蔡宜珊', location: '高雄市', badge: '好評幫手',
      tags: ['鋼琴啟蒙', '音樂律動', '樂理基礎'],
      bio: '音樂系畢業，鋼琴教學四年。用遊戲化方式讓孩子愛上練琴，不再把學音樂當苦差事。',
      rating: '5.0', price: 'NT$450/hr',
    },
    {
      emoji: '🚗', name: '陳美玲', location: '台南市', badge: '新進幫手',
      tags: ['上下學接送', '課後安親', '週末活動'],
      bio: '兩個孩子的媽，最懂家長需要什麼。細心負責，時間觀念極佳，接送從不遲到。',
      rating: '4.7', price: 'NT$280/hr',
    },
    {
      emoji: '🧩', name: '許心怡', location: '新北市', badge: '新進幫手',
      tags: ['感統訓練', '社交技巧', '遊戲治療'],
      bio: '職能治療師背景，專精兒童感覺統合訓練。善於觀察孩子需求，用遊戲引導成長。',
      rating: '4.9', price: 'NT$420/hr',
    },
  ];


  const whyReasons = [
    { icon: '🪪', title: '核對證件', desc: '建議家長在服務前請對方提供身分證件，自行確認身份。' },
    { icon: '🤝', title: '試做幾次再決定', desc: '不確定合不合適？先試做幾次，滿意再長期合作。' },
    { icon: '💬', title: '直接聯繫', desc: '媒合成功後，雙方透過 LINE 或 Email 直接溝通，彈性又方便。' },
    { icon: '💰', title: '免費使用', desc: '家長完全免費，不收任何平台費或服務費。' },
  ];

  return (
    <>
      {/* NAV */}
      <header className={`site-header ${navScrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <a href="/" className="header-logo">
            <span className="logo-icon">L</span>
            <span className="logo-text">Lessen <span style={{ fontSize: '0.6em', color: 'var(--text-secondary)', fontWeight: 400 }}>輕一點</span></span>
          </a>
          <nav className="header-nav">
            <a href="/browse" className="nav-link">瀏覽幫手</a>
            <a href="/register/helper" className="nav-link">幫手入口</a>
            <a href="/login" className="nav-link">登入</a>
            <a href="/register" className="nav-cta-btn">免費註冊</a>
          </nav>
        </div>
      </header>

      <main>
        {/* NOTICE */}
        <section className="notice-section notice-top">
          <div className="notice-inner">
            <span className="notice-icon">🚧</span>
            <span>服務尚未開放 — 本平台仍在建置測試中，感謝您的耐心等候。</span>
          </div>
        </section>

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge reveal">
              ✨ 免費使用 · 開放註冊
            </div>
            <h1 className="reveal reveal-delay-1">
              你附近的<br />
              <em>家教·陪玩·管家</em>
            </h1>
            <p className="hero-subtitle reveal reveal-delay-2">
              資歷、評價、專長一目了然。找到最適合你的幫手，直接預約。<br />
              不用到處問、不怕踩雷。
            </p>
            <div className="hero-actions reveal reveal-delay-3">
              <a href="#cta" className="btn-primary">立即預約 <span className="btn-arrow">→</span></a>
              <a href="#cta-helper" className="btn-ghost">我想成為幫手</a>
            </div>
          </div>
          <div className="hero-glow" />
        </section>

        {/* HELPERS */}
        <section className="helpers-section" id="helpers">
          <div className="carousel-track">
            {helpers.map((helper, i) => (
              <a key={i} className="helper-card" href="/browse">
                <div className="card-top">
                  <div className="card-avatar">{helper.emoji}</div>
                  <div className="card-info">
                    <span className="card-name">{helper.name}</span>
                    <span className="card-badge">{helper.badge}</span>
                  </div>
                </div>
                <div className="card-tags">
                  {helper.tags.map((tag) => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
                <div className="card-location">📍 {helper.location}</div>
              </a>
            ))}
          </div>

          <div className="section-center" style={{ marginTop: '32px' }}>
            <h2 className="reveal">快速瀏覽幫手</h2>
            <p className="section-desc reveal reveal-delay-1">
              點選卡片查看更多幫手資訊
            </p>
            <a href="/browse" className="btn-outline reveal" style={{ marginTop: '20px' }}>查看所有幫手 <span className="btn-arrow">→</span></a>
          </div>
        </section>

        {/* WHY LESSEN - DARK SECTION */}
        <section className="why-section" id="why">
          <div className="why-inner">
            <div className="why-header">
              <h2 className="reveal">為什麼需要 Lessen？</h2>
              <p className="reveal reveal-delay-1">
                傳統找家教、找陪玩、找管家，不是靠朋友介紹就是碰運氣。<br />
                Lessen 為雙方創造一個透明、高效的媒合環境。
              </p>
            </div>
            <div className="platform-notice reveal reveal-delay-2">
              <p>Lessen 為媒合平台，協助家長與幫手建立聯繫。服務內容、品質及雙方權益由使用者自行約定，平台不介入服務過程，亦不對服務結果負責。</p>
            </div>
            <div className="why-grid">
              {whyReasons.map((r, i) => (
                <div key={i} className={`why-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}>
                  <div className="why-icon">{r.icon}</div>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon logo-icon-sm">L</span>
            <span className="footer-logo-text">Lessen</span>
          </div>
          <p className="footer-disclaimer">Lessen 為媒合平台，僅協助家長與服務提供者建立聯繫，不對服務內容、品質或任何因使用本平台所產生的損失負責。所有服務提供者均為獨立個人，非本平台員工。使用本平台即代表您同意以上條款。</p>
          <p className="footer-copy">© 2026 Lessen. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}