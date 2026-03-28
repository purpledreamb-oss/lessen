'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const cardCount = 4;

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Count-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const count = parseInt(el.dataset.count || '0');
            if (!count) return;
            let current = 0;
            const step = Math.ceil(count / 40);
            const timer = setInterval(() => {
              current += step;
              if (current >= count) {
                current = count;
                clearInterval(timer);
              }
              el.textContent = current + '+';
            }, 30);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.stat-number[data-count]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToCard = useCallback((index: number) => {
    const track = carouselRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('.helper-card');
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft - 4,
        behavior: 'smooth',
      });
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % cardCount;
        scrollToCard(next);
        return next;
      });
    }, 4500);
  }, [scrollToCard]);

  // Carousel auto-play
  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => {
          const next = Math.max(0, prev - 1);
          scrollToCard(next);
          return next;
        });
        startAutoPlay();
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => {
          const next = Math.min(prev + 1, cardCount - 1);
          scrollToCard(next);
          return next;
        });
        startAutoPlay();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [scrollToCard, startAutoPlay]);

  // Scroll-based dot sync
  useEffect(() => {
    const track = carouselRef.current;
    if (!track) return;
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = track.scrollLeft;
        const cards = track.querySelectorAll('.helper-card');
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const el = card as HTMLElement;
          const dist = Math.abs(el.offsetLeft - track.offsetLeft - scrollLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        setCurrentIndex(closest);
      }, 80);
    };
    track.addEventListener('scroll', handleScroll);
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  function goToSlide(index: number) {
    const clamped = Math.max(0, Math.min(index, cardCount - 1));
    setCurrentIndex(clamped);
    scrollToCard(clamped);
    startAutoPlay();
  }

  const helpers = [
    {
      emoji: '👩‍🏫',
      name: '林佳慧',
      location: '新竹東區',
      bio: '師大畢業、五年教學經驗。最擅長把數學變成遊戲，讓孩子笑著笑著就學會了。她說：「每個孩子都有自己的節奏，我只是陪他走。」',
      tags: ['國小數學', '英文', '自然科學'],
      rating: '4.9',
      price: 'NT$400/hr',
    },
    {
      emoji: '🎮',
      name: '陳雅婷',
      location: '新竹北區',
      bio: '特教系出身，曾陪伴亞斯伯格症的孩子三年。溫柔又有耐心，總能用創意遊戲打開孩子的心。她相信：「每個孩子都有自己認識世界的方式。」',
      tags: ['特殊需求友善', '創意遊戲', '情緒引導'],
      rating: '5.0',
      price: 'NT$350/hr',
    },
    {
      emoji: '🏠',
      name: '王淑芬',
      location: '竹北市',
      bio: '三年管家經驗，從接送到採買都能安心託付。做事細心、個性隨和，很多家庭都把她當自家人。她常說：「幫忙不是工作，是一起生活。」',
      tags: ['接送', '採買', '輕整理'],
      rating: '4.8',
      price: 'NT$300/hr',
    },
    {
      emoji: '🎨',
      name: '張雨萱',
      location: '新竹市區',
      bio: '美術系畢業，帶過幼兒園美術課兩年。用畫筆和故事帶孩子探索世界，連最坐不住的小朋友都能專注一整個下午。',
      tags: ['美術創作', '手作', '繪本共讀'],
      rating: '4.9',
      price: 'NT$380/hr',
    },
  ];

  return (
    <>
      {/* NAV */}
      <nav className={navScrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <div className="nav-logo">Lessen</div>
          <div className="nav-links">
            <a href="#helpers">家教</a>
            <a href="#helpers">陪玩姊姊</a>
            <a href="#helpers">管家</a>
            <a href="#how">服務流程</a>
            <a href="#cta" className="nav-cta">立即預約</a>
          </div>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker">
        <span className="ticker-dot" />
        <span className="ticker-text">🎉 剛剛有一位新竹東區的媽媽成功找到家教老師</span>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge reveal">
            <span className="dot" />
            📍 從新竹出發，持續擴展中
          </div>
          <h1 className="reveal reveal-delay-1">
            你已經<em>夠努力了</em>
            <br />
            剩下的，交給我們
          </h1>
          <p className="hero-subtitle reveal reveal-delay-2">
            育兒不必事事親力親為。Lessen 為你媒合通過審核的家教、陪玩姊姊與管家，
            <br />
            讓你安心喘口氣，把時間還給自己。
          </p>
          <div className="hero-actions reveal reveal-delay-3">
            <a href="#cta" className="btn-primary">預約幫手 →</a>
            <a href="#how" className="btn-secondary">了解服務流程</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat-item reveal">
          <div className="stat-number" data-count="50">0+</div>
          <div className="stat-label">在地幫手</div>
        </div>
        <div className="stat-item reveal reveal-delay-1">
          <div className="stat-number">98%</div>
          <div className="stat-label">家長好評率</div>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <div className="stat-number">
            30<span style={{ fontSize: '1.2rem' }}>min</span>
          </div>
          <div className="stat-label">平均媒合時間</div>
        </div>
      </div>

      {/* HELPERS CAROUSEL */}
      <section className="helpers-section" id="helpers">
        <div className="section-header reveal">
          <div>
            <h2>認識我們的幫手</h2>
            <p>每一位都經過面試審核，真心喜歡孩子</p>
          </div>
          <a href="#" className="view-all">查看全部 →</a>
        </div>
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            ref={carouselRef}
            onMouseEnter={() => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); }}
            onMouseLeave={() => startAutoPlay()}
          >
            {helpers.map((helper, i) => (
              <div
                key={i}
                className={`helper-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
              >
                <div className="card-emoji">{helper.emoji}</div>
                <div className="card-header">
                  <span className="card-name">{helper.name}</span>
                  <span className="card-verified">✓ 已審核</span>
                </div>
                <div className="card-location">📍 {helper.location}</div>
                <div className="card-bio">{helper.bio}</div>
                <div className="card-tags">
                  {helper.tags.map((tag) => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="card-rating">⭐ {helper.rating}</span>
                  <span className="card-price">{helper.price}</span>
                </div>
                <a href="#" className="card-action">查看詳情</a>
              </div>
            ))}
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => goToSlide(currentIndex - 1)} aria-label="上一位">←</button>
            <div className="carousel-dots">
              {helpers.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`幫手 ${i + 1}`}
                />
              ))}
            </div>
            <button className="carousel-btn" onClick={() => goToSlide(currentIndex + 1)} aria-label="下一位">→</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <h2 className="reveal">三步驟，輕鬆找到好幫手</h2>
        <div className="how-steps">
          <div className="how-step reveal">
            <div className="step-number">1</div>
            <h3>加入 LINE 告訴我們需求</h3>
            <p>孩子年齡、需要的服務類型、偏好時段——簡單說就好，我們來幫你安排。</p>
          </div>
          <div className="how-step reveal reveal-delay-1">
            <div className="step-number">2</div>
            <h3>收到推薦幫手</h3>
            <p>30 分鐘內為你推薦合適人選，附上完整介紹，你覺得 OK 再往下走。</p>
          </div>
          <div className="how-step reveal reveal-delay-2">
            <div className="step-number">3</div>
            <h3>安心開始服務</h3>
            <p>確認後直接安排第一次服務。不滿意？隨時跟我們說，免費重新媒合。</p>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust-section">
        <div className="trust-inner reveal from-scale">
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌿</div>
          <p className="trust-quote">
            「自從用了 Lessen，每週三下午我終於可以好好去上一堂瑜伽課。小孩跟佳慧老師玩得比跟我還開心，我也不再覺得喘不過氣了。」
          </p>
          <p className="trust-author">—— 新竹東區 · 兩個孩子的媽媽</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <h2 className="reveal">今天就讓自己<em>輕一點</em></h2>
        <p className="cta-subtitle reveal reveal-delay-1">加入 LINE 官方帳號，三分鐘完成預約。</p>
        <div className="cta-actions reveal reveal-delay-2">
          <a href="#" className="btn-primary">加入 LINE 立即預約</a>
          <a href="#" className="btn-secondary">成為幫手</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Lessen</div>
        <p className="footer-disclaimer">
          Lessen 為媒合平台，僅提供家長與服務提供者之間的媒合服務，不對服務提供者的行為、服務品質或任何因使用本平台所產生的損失負責。所有服務提供者均為獨立個人，非本平台員工。家長在預約前請自行評估並了解服務內容。使用本平台即代表您同意本平台之服務條款與免責聲明。
        </p>
        <p className="footer-copy">© 2026 Lessen · 從新竹出發</p>
      </footer>
    </>
  );
}
