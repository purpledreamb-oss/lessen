"use client";
import { useState, useEffect } from "react";

const T = {
  zh: {
    brand: "Lessen", brandSub: "餘白",
    nav: { services: "服務項目", how: "如何使用", helpers: "幫手清單", join: "成為幫手", book: "立即預約" },
    hero: {
      badge: "從新竹出發，持續擴展中",
      title1: "把擔子", title2: "輕輕放下",
      desc: "為辛苦育兒的家長媒合值得信任的家教、陪玩姊姊與管家服務。讓你有時間，好好做自己。",
      cta1: "我要預約幫手", cta2: "成為幫手",
      stat1: ["50+", "在地幫手"], stat2: ["98%", "好評率"], stat3: ["30min", "平均媒合時間"],
      floatLabel: "剛剛媒合成功", floatMain: "🎉 找到家教老師", floatSub: "新竹東區 · 10分鐘前",
    },
    services: {
      label: "SERVICES", title: "三種服務，一個入口",
      items: [
        { icon: "👩‍🏫", title: "家教陪讀", desc: "專業課業輔導，讓孩子在家就能好好學習", color: "#8B7355" },
        { icon: "🏠", title: "居家管家", desc: "接送、採買、日常協助，讓你專心上班", color: "#6B7A8B" },
        { icon: "🎮", title: "陪玩姊姊", desc: "有愛心有耐心，特殊需求兒童友善", color: "#7A8B6F" },
      ],
      cta: "立即預約 →"
    },
    steps: {
      label: "HOW IT WORKS", title1: "三分鐘", title2: "找到幫手",
      desc: "不需要一個個詢問，不需要等回覆。填寫需求後，我們幫你找到附近有空的幫手。",
      items: [
        { num: "01", title: "選擇服務", desc: "告訴我們你需要什麼幫助" },
        { num: "02", title: "填寫需求", desc: "時間、地點、特殊需求都可以說" },
        { num: "03", title: "媒合幫手", desc: "我們為你找到附近合適的人選" },
      ]
    },
    cta: {
      label: "開始使用", title1: "今天就讓自己", title2: "輕一點",
      desc: "加入 LINE 官方帳號，三分鐘完成預約。",
      btn: "加入 LINE 立即預約"
    },
    joinSection: {
      label: "JOIN US", title1: "想成為", title2: "Lessen 幫手？",
      desc: "彈性時間、在地接案。不論你是家教老師、喜歡陪伴孩子，或擅長居家整理，都歡迎加入。",
      btn: "我要應徵",
      perks: [
        { icon: "🕐", title: "彈性時間", desc: "自己排班，接你能接的案" },
        { icon: "📍", title: "在地服務", desc: "從新竹出發，未來持續擴展到更多城市" },
        { icon: "💰", title: "透明收費", desc: "自訂收費，平台不亂抽成" },
      ]
    },
    footer: "從新竹出發",
    // Helpers page
    helpersPage: {
      title: "幫手清單", subtitle: "每位幫手都經過身份驗證與審核",
      filterAll: "全部", filter1: "家教陪讀", filter2: "居家管家", filter3: "陪玩姊姊",
      ratingLabel: "評價", reviewLabel: "則", bookBtn: "預約",
      badge: "認證幫手",
      helpers: [
        { name: "林佳慧", service: "家教陪讀", area: "新竹東區", rating: 4.9, reviews: 23, rate: "NT$400/hr", tags: ["國小數學", "英文", "自然"], bio: "師範大學畢業，教學經驗5年，擅長讓孩子用遊戲方式學習。喜歡觀察每個孩子的學習節奏，設計適合他們的教學方式。", verified: true, schedule: { "一": ["15:00", "16:00", "17:00"], "三": ["15:00", "16:00", "17:00"], "五": ["15:00", "16:00"], "六": ["09:00", "10:00", "11:00"] }, edu: "師範大學教育系畢業", exp: "5年家教經驗", line: "@lessen" },
        { name: "陳雅婷", service: "陪玩姊姊", area: "新竹北區", rating: 5.0, reviews: 18, rate: "NT$350/hr", tags: ["特殊需求友善", "創意遊戲", "情緒引導"], bio: "特教系畢業，有亞斯伯格症陪伴經驗，耐心溫柔。相信每個孩子都有自己的方式認識世界。", verified: true, schedule: { "二": ["14:00", "15:00", "16:00"], "四": ["14:00", "15:00"], "六": ["10:00", "11:00", "14:00", "15:00"], "日": ["10:00", "11:00"] }, edu: "特殊教育系畢業", exp: "3年特教陪伴經驗", line: "@lessen" },
        { name: "王淑芬", service: "居家管家", area: "竹北市", rating: 4.8, reviews: 31, rate: "NT$300/hr", tags: ["接送", "採買", "輕整理"], bio: "有3年家庭管家經驗，細心負責，彈性配合家庭需求。把每個家庭都當成自己的家在照顧。", verified: true, schedule: { "一": ["08:00", "09:00", "10:00"], "二": ["08:00", "09:00"], "三": ["08:00", "09:00", "10:00"], "四": ["08:00", "09:00"], "五": ["08:00", "09:00", "10:00"] }, edu: "家政相關背景", exp: "3年管家經驗", line: "@lessen" },
        { name: "張美玲", service: "家教陪讀", area: "竹北市", rating: 4.7, reviews: 15, rate: "NT$450/hr", tags: ["國中數學", "理化", "升學輔導"], bio: "清大理工畢業，擅長理科，讓孩子真正理解而非死背。相信打好基礎比刷題更重要。", verified: true, schedule: { "二": ["17:00", "18:00"], "四": ["17:00", "18:00"], "六": ["09:00", "10:00", "11:00", "14:00"] }, edu: "清華大學理工系畢業", exp: "2年升學輔導", line: "@lessen" },
        { name: "吳心怡", service: "陪玩姊姊", area: "新竹東區", rating: 4.9, reviews: 27, rate: "NT$320/hr", tags: ["0-6歲", "感統遊戲", "親子活動"], bio: "幼教系畢業，專長嬰幼兒發展，喜歡帶孩子探索世界。陪伴是最好的禮物。", verified: true, schedule: { "一": ["09:00", "10:00", "14:00", "15:00"], "三": ["09:00", "10:00"], "五": ["14:00", "15:00", "16:00"], "日": ["10:00", "11:00", "14:00"] }, edu: "幼兒教育系畢業", exp: "4年幼兒陪伴", line: "@lessen" },
        { name: "劉雅萍", service: "居家管家", area: "新竹香山", rating: 4.6, reviews: 12, rate: "NT$280/hr", tags: ["料理", "接送", "家事協助"], bio: "有烹飪專長，可幫忙準備簡單餐食，細心照顧家庭日常。", verified: false, schedule: { "一": ["10:00", "11:00"], "三": ["10:00", "11:00"], "五": ["10:00", "11:00", "14:00"] }, edu: "餐飲相關背景", exp: "1年居家服務", line: "@lessen" },
      ]
    },
    // Book page
    bookPage: {
      title: "預約幫手", subtitle: "填寫需求，我們幫你找到最合適的人",
      step1: "選擇服務", step2: "填寫需求", step3: "確認預約",
      serviceLabel: "需要什麼服務？",
      dateLabel: "預約日期", timeLabel: "預約時間",
      areaLabel: "服務地址", areaPlaceholder: "新竹市...",
      noteLabel: "特殊需求說明", notePlaceholder: "例如：孩子有特殊需求、需要幾個小時...",
      nameLabel: "您的姓名", namePlaceholder: "王小明",
      phoneLabel: "聯絡電話", phonePlaceholder: "0912-345-678",
      submitBtn: "送出預約需求",
      successTitle: "預約需求已送出！🎉",
      successDesc: "我們會在30分鐘內透過LINE通知您媒合結果。",
      lineBtn: "加入LINE接收通知",
    },
    // Join page
    joinPage: {
      title: "成為幫手", subtitle: "加入 Lessen 餘白，用你的專長幫助更多家庭",
      perks: [
        { icon: "💰", title: "穩定收入", desc: "彈性接案，時薪自訂" },
        { icon: "🕐", title: "自由時間", desc: "自己安排班表" },
        { icon: "🌱", title: "在地連結", desc: "服務你熟悉的社區" },
      ],
      serviceLabel: "提供的服務（可複選）",
      nameLabel: "姓名", namePlaceholder: "王小明",
      phoneLabel: "聯絡電話", phonePlaceholder: "0912-345-678",
      areaLabel: "服務地區", areaPlaceholder: "新竹市東區",
      rateLabel: "期望時薪", ratePlaceholder: "NT$350",
      bioLabel: "自我介紹", bioPlaceholder: "請簡單介紹你的背景和專長...",
      idLabel: "身分證字號（審核用，不公開）", idPlaceholder: "A123456789",
      eduLabel: "最高學歷或相關證書說明", eduPlaceholder: "例如：師範大學畢業、特教系...",
      noteLabel: "其他補充", notePlaceholder: "可用時段、特殊專長...",
      submitBtn: "送出應徵申請",
      successTitle: "申請已送出！🌿",
      successDesc: "我們會在2個工作天內審核您的資料（身分證、自拍、學歷），通過後會透過LINE通知您。",
    }
  },
  en: {
    brand: "Lessen", brandSub: "Space",
    nav: { services: "Services", how: "How It Works", helpers: "Find Help", join: "Become a Helper", book: "Book Now" },
    hero: {
      badge: "Starting from Hsinchu, expanding soon",
      title1: "Put down", title2: "the weight",
      desc: "Matching trusted tutors, playmates, and home helpers for parents who need a moment to breathe.",
      cta1: "Find a Helper", cta2: "Become a Helper",
      stat1: ["50+", "Local Helpers"], stat2: ["98%", "Satisfaction"], stat3: ["30min", "Avg. Match Time"],
      floatLabel: "Just matched", floatMain: "🎉 Found a tutor", floatSub: "Hsinchu East · 10 min ago",
    },
    services: {
      label: "SERVICES", title: "Three services, one platform",
      items: [
        { icon: "👩‍🏫", title: "Tutoring", desc: "Professional academic support at home", color: "#8B7355" },
        { icon: "🏠", title: "Home Helper", desc: "Errands, pickup, daily household assistance", color: "#6B7A8B" },
        { icon: "🎮", title: "Playmate", desc: "Caring and patient, special needs friendly", color: "#7A8B6F" },
      ],
      cta: "Book now →"
    },
    steps: {
      label: "HOW IT WORKS", title1: "Find help", title2: "in 3 minutes",
      desc: "No need to ask around or wait. Fill in your needs and we'll find an available helper nearby.",
      items: [
        { num: "01", title: "Choose a service", desc: "Tell us what kind of help you need" },
        { num: "02", title: "Fill in details", desc: "Time, location, and any special requests" },
        { num: "03", title: "Get matched", desc: "We find the right helper near you" },
      ]
    },
    cta: {
      label: "GET STARTED", title1: "Give yourself", title2: "a little space",
      desc: "Add our LINE account and book in under 3 minutes.",
      btn: "Book via LINE"
    },
    joinSection: {
      label: "JOIN US", title1: "Want to be a", title2: "Lessen Helper?",
      desc: "Flexible hours, local work. Whether you're a tutor, love working with kids, or excel at home organization — we'd love to have you.",
      btn: "Apply Now",
      perks: [
        { icon: "🕐", title: "Flexible Hours", desc: "Set your own schedule" },
        { icon: "📍", title: "Local Work", desc: "Serve your own community" },
        { icon: "💰", title: "Set Your Rate", desc: "You decide your hourly rate" },
      ]
    },
    footer: "Starting from Hsinchu",
    helpersPage: {
      title: "Find a Helper", subtitle: "Every helper is verified and reviewed",
      filterAll: "All", filter1: "Tutoring", filter2: "Home Helper", filter3: "Playmate",
      ratingLabel: "Rating", reviewLabel: "reviews", bookBtn: "Book",
      badge: "Verified",
      helpers: [
        { name: "Chia-Hui Lin", service: "Tutoring", area: "Hsinchu East", rating: 4.9, reviews: 23, rate: "NT$400/hr", tags: ["Math", "English", "Science"], bio: "Education graduate, 5 years teaching experience, specializes in game-based learning.", verified: true },
        { name: "Ya-Ting Chen", service: "Playmate", area: "Hsinchu North", rating: 5.0, reviews: 18, rate: "NT$350/hr", tags: ["Special Needs", "Creative Play", "Emotional Support"], bio: "Special Education graduate, experienced with children on the autism spectrum.", verified: true },
        { name: "Shu-Fen Wang", service: "Home Helper", area: "Zhubei", rating: 4.8, reviews: 31, rate: "NT$300/hr", tags: ["Pickup", "Errands", "Light Cleaning"], bio: "3 years as a family assistant, reliable and flexible.", verified: true },
        { name: "Mei-Ling Chang", service: "Tutoring", area: "Zhubei", rating: 4.7, reviews: 15, rate: "NT$450/hr", tags: ["Junior High Math", "Science", "Exam Prep"], bio: "NTHU engineering graduate, helps students truly understand rather than memorize.", verified: true },
        { name: "Hsin-Yi Wu", service: "Playmate", area: "Hsinchu East", rating: 4.9, reviews: 27, rate: "NT$320/hr", tags: ["Ages 0-6", "Sensory Play", "Parent-Child"], bio: "Early Childhood Education degree, loves helping little ones explore the world.", verified: true },
        { name: "Ya-Ping Liu", service: "Home Helper", area: "Hsinchu Xiangshan", rating: 4.6, reviews: 12, rate: "NT$280/hr", tags: ["Cooking", "Pickup", "Housework"], bio: "Cooking specialist, can prepare simple meals and assist with daily household tasks.", verified: false },
      ]
    },
    bookPage: {
      title: "Book a Helper", subtitle: "Tell us what you need and we'll find the right match",
      step1: "Service", step2: "Details", step3: "Confirm",
      serviceLabel: "What service do you need?",
      dateLabel: "Date", timeLabel: "Time",
      areaLabel: "Service Address", areaPlaceholder: "Hsinchu City...",
      noteLabel: "Special Requests", notePlaceholder: "e.g., child has special needs, hours needed...",
      nameLabel: "Your Name", namePlaceholder: "Jane Wang",
      phoneLabel: "Phone", phonePlaceholder: "0912-345-678",
      submitBtn: "Submit Request",
      successTitle: "Request Submitted! 🎉",
      successDesc: "We'll notify you via LINE within 30 minutes with your match.",
      lineBtn: "Add LINE to Receive Updates",
    },
    joinPage: {
      title: "Become a Helper", subtitle: "Join Lessen and use your skills to support local families",
      perks: [
        { icon: "💰", title: "Earn Income", desc: "Set your own rate, flexible bookings" },
        { icon: "🕐", title: "Your Schedule", desc: "Work when you want" },
        { icon: "🌱", title: "Local Impact", desc: "Serve your own community" },
      ],
      serviceLabel: "Services you offer (select all that apply)",
      nameLabel: "Full Name", namePlaceholder: "Jane Wang",
      phoneLabel: "Phone", phonePlaceholder: "0912-345-678",
      areaLabel: "Service Area", areaPlaceholder: "Hsinchu East District",
      rateLabel: "Desired Hourly Rate", ratePlaceholder: "NT$350",
      bioLabel: "About You", bioPlaceholder: "Tell us about your background and skills...",
      idLabel: "ID Number (for verification, not public)", idPlaceholder: "A123456789",
      eduLabel: "Education or Relevant Credentials", eduPlaceholder: "e.g., Education degree, Special Education...",
      noteLabel: "Additional Notes", notePlaceholder: "Availability, special skills...",
      submitBtn: "Submit Application",
      successTitle: "Application Submitted! 🌿",
      successDesc: "We'll review your info within 2 business days and notify you via LINE.",
    }
  }
};

const COLORS = {
  bg: "#FAF8F5", bgAlt: "#F5F2EE", dark: "#2C2825",
  mid: "#6B6158", light: "#8B7B6B", border: "#EDE9E4",
  accent: "#C8BEB4", white: "#FFFFFF"
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FAF8F5; }
  .btn-primary { background: #2C2825; color: #FAF8F5; border: none; padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
  .btn-primary:hover { background: #4A3F35; transform: translateY(-1px); }
  .btn-secondary { background: transparent; color: #2C2825; border: 1px solid #C8BEB4; padding: 13px 32px; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; border-radius: 2px; }
  .btn-secondary:hover { border-color: #2C2825; }
  .btn-line { display: inline-flex; align-items: center; gap: 8px; background: #06C755; color: white; padding: 14px 28px; border-radius: 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
  .btn-line:hover { background: #05B34C; transform: translateY(-1px); }
  .nav-link { color: #8B7B6B; background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.06em; cursor: pointer; transition: color 0.2s; padding: 0; }
  .nav-link:hover, .nav-link.active { color: #2C2825; }
  .service-card { background: white; border: 1px solid #EDE9E4; border-radius: 4px; padding: 28px 24px; cursor: pointer; transition: all 0.25s; }
  .service-card:hover { border-color: #C8BEB4; transform: translateY(-3px); box-shadow: 0 8px 30px rgba(44,40,37,0.08); }
  .helper-card { background: white; border: 1px solid #EDE9E4; border-radius: 6px; padding: 24px; transition: all 0.2s; }
  .helper-card:hover { border-color: #C8BEB4; box-shadow: 0 4px 20px rgba(44,40,37,0.06); }
  .filter-btn { background: transparent; border: 1px solid #EDE9E4; border-radius: 20px; padding: 7px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; color: #6B6158; }
  .filter-btn:hover, .filter-btn.active { background: #2C2825; color: white; border-color: #2C2825; }
  .form-input { width: 100%; border: 1px solid #EDE9E4; border-radius: 4px; padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #2C2825; background: white; outline: none; transition: border 0.2s; }
  .form-input:focus { border-color: #8B7B6B; }
  .form-label { font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 0.06em; color: #8B7B6B; margin-bottom: 6px; display: block; }
  .tag { display: inline-block; background: #F5F2EE; border-radius: 12px; padding: 3px 10px; font-size: 11px; font-family: 'DM Sans', sans-serif; color: #6B6158; margin: 2px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #C8BEB4; flex-shrink: 0; margin-top: 6px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.5s ease forwards; }
  .checkbox-service { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid #EDE9E4; border-radius: 4px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #2C2825; }
  .checkbox-service.selected { border-color: #2C2825; background: #F5F2EE; }
`;

export default function LessenApp() {
  const [lang, setLang] = useState("zh");
  const [page, setPage] = useState("home");
  const [filter, setFilter] = useState("all");
  const [bookStep, setBookStep] = useState(1);
  const [bookDone, setBookDone] = useState(false);
  const [joinDone, setJoinDone] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const t = T[lang as keyof typeof T];

  const navigate = (p) => { setPage(p); window.scrollTo(0,0); };

  const toggleService = (s) => {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const serviceColors = { "家教陪讀": "#8B7355", "Tutoring": "#8B7355", "居家管家": "#6B7A8B", "Home Helper": "#6B7A8B", "陪玩姊姊": "#7A8B6F", "Playmate": "#7A8B6F" };
  const serviceMap = lang === "zh" ? ["家教陪讀", "居家管家", "陪玩姊姊"] : ["Tutoring", "Home Helper", "Playmate"];
  const filterMap = lang === "zh"
    ? { all: "全部", "家教陪讀": t.helpersPage.filter1, "居家管家": t.helpersPage.filter2, "陪玩姊姊": t.helpersPage.filter3 }
    : { all: "All", "Tutoring": t.helpersPage.filter1, "Home Helper": t.helpersPage.filter2, "Playmate": t.helpersPage.filter3 };

  const filteredHelpers = filter === "all"
    ? t.helpersPage.helpers
    : t.helpersPage.helpers.filter(h => h.service === filter);

  const Nav = () => (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, background: "rgba(250,248,245,0.93)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
      <button onClick={() => navigate("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 18, fontStyle: "italic", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", color: COLORS.dark }}>{t.brand}</span>
        <span style={{ width: 1, height: 14, background: COLORS.accent }} />
        <span style={{ fontSize: 11, color: COLORS.light, letterSpacing: "0.2em", fontFamily: "'DM Sans', sans-serif" }}>{t.brandSub}</span>
      </button>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {(lang === "zh" ? ["家教", "陪玩姊姊", "管家"] : ["Tutor", "Playmate", "Helper"]).map((s, i) => (
          <span key={i} style={{ fontSize: 11, color: COLORS.light, background: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "3px 10px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}>{s}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <button className="nav-link" onClick={() => navigate("helpers")}>{t.nav.helpers}</button>
        <button className="nav-link" onClick={() => navigate("join")}>{t.nav.join}</button>
        <button className="nav-link" onClick={() => navigate("book")}>{t.nav.book}</button>
        <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} style={{ background: "#F0EDE8", border: "none", borderRadius: 12, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: COLORS.mid, letterSpacing: "0.04em" }}>
          {lang === "zh" ? "EN" : "中文"}
        </button>
      </div>
    </nav>
  );

  const Footer = () => (
    <div>
      {/* 免責聲明 */}
      <div style={{ background: "#F5F2EE", borderTop: `1px solid ${COLORS.border}`, padding: "24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
            {lang === "zh" ? "免責聲明" : "DISCLAIMER"}
          </div>
          <p style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.9, fontWeight: 300 }}>
            {lang === "zh"
              ? "Lessen 餘白為媒合平台，僅提供家長與服務提供者之間的媒合服務，不對服務提供者的行為、服務品質或任何因使用本平台所產生的損失負責。所有服務提供者均為獨立個人，非本平台員工。家長在預約前請自行評估並了解服務內容。使用本平台即代表您同意本平台之服務條款與免責聲明。"
              : "Lessen is a matching platform that connects parents with independent service providers. We are not responsible for the actions, service quality, or any losses arising from the use of this platform. All helpers are independent individuals and not employees of Lessen. Parents are advised to assess service details before booking. By using this platform, you agree to our terms of service and disclaimer."}
          </p>
        </div>
      </div>
      {/* Footer */}
      <footer style={{ padding: "24px 40px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: COLORS.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontStyle: "italic", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif" }}>{t.brand}</span>
          <span style={{ width: 1, height: 12, background: COLORS.accent }} />
          <span style={{ fontSize: 11, color: COLORS.light, letterSpacing: "0.2em", fontFamily: "'DM Sans', sans-serif" }}>{t.brandSub}</span>
        </div>
        <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif" }}>© 2026 Lessen · {t.footer}</div>
      </footer>
    </div>
  );

  // HELPER CAROUSEL (for homepage)
  const HelperCarousel = () => {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const helpers = t.helpersPage.helpers;
    const visible = 3;
    const maxIndex = helpers.length - visible;

    const prev = () => setCarouselIndex(i => Math.max(0, i - 1));
    const next = () => setCarouselIndex(i => i >= maxIndex ? 0 : i + 1);
    const visibleHelpers = helpers.slice(carouselIndex, carouselIndex + visible);

    // Auto scroll every 3 seconds
    useEffect(() => {
      const timer = setInterval(() => {
        setCarouselIndex(i => i >= maxIndex ? 0 : i + 1);
      }, 3000);
      return () => clearInterval(timer);
    }, [maxIndex]);

    return (
      <section style={{ padding: "80px 40px", background: COLORS.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
                {lang === "zh" ? "認識我們的幫手" : "MEET OUR HELPERS"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={prev} disabled={carouselIndex === 0} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${COLORS.border}`, background: carouselIndex === 0 ? COLORS.bgAlt : "white", cursor: carouselIndex === 0 ? "not-allowed" : "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: carouselIndex === 0 ? COLORS.accent : COLORS.dark }}>←</button>
              <span style={{ fontSize: 12, color: COLORS.light, fontFamily: "'DM Sans', sans-serif" }}>{carouselIndex + 1} / {maxIndex + 1}</span>
              <button onClick={next} disabled={carouselIndex >= maxIndex} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${COLORS.border}`, background: carouselIndex >= maxIndex ? COLORS.bgAlt : "white", cursor: carouselIndex >= maxIndex ? "not-allowed" : "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: carouselIndex >= maxIndex ? COLORS.accent : COLORS.dark }}>→</button>
              <button onClick={() => navigate("helpers")} style={{ marginLeft: 8, background: "none", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.light, cursor: "pointer", letterSpacing: "0.06em" }}>
                {lang === "zh" ? "查看全部 →" : "View all →"}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, transition: "all 0.3s" }}>
            {visibleHelpers.map((h, i) => {
              const globalIdx = t.helpersPage.helpers.indexOf(h);
              return (
                <div key={globalIdx} className="helper-card fade-in" style={{ cursor: "pointer" }}
                  onClick={() => { setSelectedHelper(globalIdx); navigate("helpers"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: (serviceColors[h.service] || "#8B7B6B") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                        {h.service.includes("家教") || h.service === "Tutoring" ? "👩‍🏫" : h.service.includes("管家") || h.service === "Home Helper" ? "🏠" : "🎮"}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", color: COLORS.dark }}>{h.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>📍 {h.area}</div>
                      </div>
                    </div>
                    {h.verified && <span style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 10, padding: "3px 8px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>✓</span>}
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 12, fontWeight: 300, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{h.bio}</p>
                  <div style={{ marginBottom: 12 }}>{h.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>⭐ {h.rating}</span>
                      <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{h.rate}</div>
                    </div>
                    <span style={{ fontSize: 12, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em" }}>{lang === "zh" ? "查看詳情 →" : "View →"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} onClick={() => setCarouselIndex(i)} style={{ width: i === carouselIndex ? 20 : 6, height: 6, borderRadius: 3, border: "none", background: i === carouselIndex ? COLORS.dark : COLORS.border, cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // HOME PAGE
  const HomePage = () => (
    <div>
      {/* Helper Carousel - moved to top */}
      <HelperCarousel />

      {/* Hero */}
      <section style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 40, paddingRight: 40, maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div className="fade-in">
          <div style={{ display: "inline-block", background: "#F0EDE8", padding: "5px 14px", borderRadius: 20, fontSize: 11, letterSpacing: "0.1em", color: COLORS.light, marginBottom: 28, fontFamily: "'DM Sans', sans-serif" }}>
            📍 {t.hero.badge}
          </div>
          <h1 style={{ fontSize: "clamp(38px, 5vw, 60px)", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 20, color: COLORS.dark }}>
            {t.hero.title1}<br /><em style={{ fontStyle: "italic", color: COLORS.light }}>{t.hero.title2}</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.9, color: COLORS.mid, marginBottom: 36, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, maxWidth: 420 }}>{t.hero.desc}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate("book")}>{t.hero.cta1}</button>
            <button className="btn-secondary" onClick={() => navigate("join")}>{t.hero.cta2}</button>
          </div>
          <div style={{ marginTop: 44, display: "flex", gap: 36 }}>
            {[t.hero.stat1, t.hero.stat2, t.hero.stat3].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontSize: 26, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", color: COLORS.dark }}>{num}</div>
                <div style={{ fontSize: 11, color: COLORS.light, marginTop: 3, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", aspectRatio: "4/5", background: "linear-gradient(145deg, #F0EDE8 0%, #E8E2D9 50%, #DDD5C8 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 40, right: 40, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
            <div style={{ position: "absolute", bottom: 60, left: 30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{ fontSize: 72, marginBottom: 12 }}>🌿</div>
              <div style={{ fontSize: 18, fontStyle: "italic", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", color: "#5C5248" }}>
                {lang === "zh" ? "為自己留一點餘白" : "A little space for yourself"}
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: -16, left: -16, background: "white", borderRadius: 8, padding: "14px 18px", boxShadow: "0 8px 32px rgba(44,40,37,0.12)", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 10, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", marginBottom: 3 }}>{t.hero.floatLabel}</div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{t.hero.floatMain}</div>
            <div style={{ fontSize: 10, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{t.hero.floatSub}</div>
          </div>
        </div>
      </section>

      {/* CTA dark */}
      <section style={{ background: COLORS.dark, padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>{t.cta.label}</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", color: "#FAF8F5", letterSpacing: "-0.01em", marginBottom: 20 }}>
            {t.cta.title1}<br /><em style={{ fontStyle: "italic", color: COLORS.accent }}>{t.cta.title2}</em>
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 40 }}>{t.cta.desc}</p>
          <button className="btn-line">{t.cta.btn}</button>
        </div>
      </section>
    </div>
  );

  // HELPERS PAGE
  const HelpersPage = () => {
    const filters = lang === "zh"
      ? ["all", "家教陪讀", "居家管家", "陪玩姊姊"]
      : ["all", "Tutoring", "Home Helper", "Playmate"];

    const days = lang === "zh" ? ["一", "二", "三", "四", "五", "六", "日"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayMap = { "一": "Mon", "二": "Tue", "三": "Wed", "四": "Thu", "五": "Fri", "六": "Sat", "日": "Sun" };

    // Helper Profile View
    if (selectedHelper !== null) {
      const h = t.helpersPage.helpers[selectedHelper];
      const scheduleKeys = Object.keys(h.schedule);
      return (
        <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 40px" }}>
            <button onClick={() => setSelectedHelper(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.light, marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
              ← {lang === "zh" ? "回幫手清單" : "Back to list"}
            </button>

            {/* Profile header */}
            <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 32, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: (serviceColors[h.service] || "#8B7B6B") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                  {h.service.includes("家教") || h.service === "Tutoring" ? "👩‍🏫" : h.service.includes("管家") || h.service === "Home Helper" ? "🏠" : "🎮"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", color: COLORS.dark }}>{h.name}</h2>
                    {h.verified && <span style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 11, padding: "3px 10px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>✓ {t.helpersPage.badge}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>📍 {h.area} · {h.service}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>⭐ {h.rating}</span>
                    <span style={{ fontSize: 12, color: COLORS.light, fontFamily: "'DM Sans', sans-serif" }}>({h.reviews} {t.helpersPage.reviewLabel})</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", marginLeft: 8 }}>{h.rate}</span>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => navigate("book")} style={{ flexShrink: 0 }}>{t.helpersPage.bookBtn}</button>
              </div>

              <p style={{ fontSize: 14, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.9, marginBottom: 16, fontWeight: 300 }}>{h.bio}</p>

              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>{lang === "zh" ? "學歷" : "EDUCATION"}</div>
                  <div style={{ fontSize: 13, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>{h.edu}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em", marginBottom: 4 }}>{lang === "zh" ? "經驗" : "EXPERIENCE"}</div>
                  <div style={{ fontSize: 13, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>{h.exp}</div>
                </div>
              </div>

              <div>{h.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
            </div>

            {/* Schedule */}
            <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 32, marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
                {lang === "zh" ? "可用時段" : "AVAILABILITY"}
              </div>
              {scheduleKeys.length === 0 ? (
                <div style={{ fontSize: 13, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif" }}>
                  {lang === "zh" ? "請透過 LINE 詢問可用時段" : "Please contact via LINE for availability"}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {scheduleKeys.map(day => (
                    <div key={day} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 32, fontSize: 12, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", color: COLORS.dark, flexShrink: 0 }}>
                        {lang === "zh" ? `週${day}` : dayMap[day]}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {h.schedule[day].map(time => (
                          <span key={time} style={{ background: "#F0FAF4", border: "1px solid #A8D5B5", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: "#2E7D32" }}>{time}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact via LINE */}
            <div style={{ background: COLORS.dark, borderRadius: 8, padding: 28, textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#FAF8F5", fontFamily: "'DM Sans', sans-serif", marginBottom: 16, fontWeight: 300 }}>
                {lang === "zh" ? "想預約或有問題？透過 LINE 聯絡我們" : "Want to book or have questions? Contact us via LINE"}
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-line">{lang === "zh" ? "透過 LINE 預約" : "Book via LINE"}</button>
                <button className="btn-primary" onClick={() => navigate("book")} style={{ background: "transparent", border: "1px solid #8B7B6B" }}>{t.helpersPage.bookBtn}</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", marginBottom: 10, color: COLORS.dark }}>{t.helpersPage.title}</h1>
            <p style={{ fontSize: 14, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{t.helpersPage.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
            {filters.map(f => (
              <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? t.helpersPage.filterAll : filterMap[f]}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filteredHelpers.map((h, i) => (
              <div key={i} className="helper-card fade-in" style={{ cursor: "pointer" }} onClick={() => setSelectedHelper(t.helpersPage.helpers.indexOf(h))}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: (serviceColors[h.service] || "#8B7B6B") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {h.service.includes("家教") || h.service === "Tutoring" ? "👩‍🏫" : h.service.includes("管家") || h.service === "Home Helper" ? "🏠" : "🎮"}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", color: COLORS.dark }}>{h.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>📍 {h.area}</div>
                    </div>
                  </div>
                  {h.verified && (
                    <span style={{ background: "#E8F5E9", color: "#2E7D32", fontSize: 10, padding: "3px 8px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap" }}>✓ {t.helpersPage.badge}</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, marginBottom: 12, fontWeight: 300 }}>{h.bio}</p>
                <div style={{ marginBottom: 14 }}>{h.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>⭐ {h.rating}</span>
                    <span style={{ fontSize: 11, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginLeft: 4 }}>({h.reviews} {t.helpersPage.reviewLabel})</span>
                    <div style={{ fontSize: 12, color: COLORS.light, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{h.rate}</div>
                  </div>
                  <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 12 }} onClick={e => { e.stopPropagation(); navigate("book"); }}>{t.helpersPage.bookBtn}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // BOOK PAGE
  const BookPage = () => {
    if (bookDone) return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", marginBottom: 16, color: COLORS.dark }}>{t.bookPage.successTitle}</h2>
          <p style={{ fontSize: 14, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8, marginBottom: 32 }}>{t.bookPage.successDesc}</p>
          <button className="btn-line">{t.bookPage.lineBtn}</button>
          <div style={{ marginTop: 20 }}>
            <button className="nav-link" onClick={() => { setBookDone(false); setBookStep(1); navigate("home"); }}>← {lang === "zh" ? "回首頁" : "Back to home"}</button>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", marginBottom: 10, color: COLORS.dark }}>{t.bookPage.title}</h1>
            <p style={{ fontSize: 13, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{t.bookPage.subtitle}</p>
          </div>
          {/* Steps indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, gap: 0 }}>
            {[t.bookPage.step1, t.bookPage.step2, t.bookPage.step3].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: bookStep > i ? COLORS.dark : bookStep === i+1 ? COLORS.dark : COLORS.border, color: bookStep >= i+1 ? "white" : COLORS.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.3s" }}>{i+1}</div>
                  <div style={{ fontSize: 10, color: bookStep === i+1 ? COLORS.dark : COLORS.light, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{s}</div>
                </div>
                {i < 2 && <div style={{ width: 60, height: 1, background: bookStep > i+1 ? COLORS.dark : COLORS.border, margin: "0 8px", marginBottom: 18, transition: "all 0.3s" }} />}
              </div>
            ))}
          </div>

          <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 32 }}>
            {bookStep === 1 && (
              <div className="fade-in">
                <label className="form-label">{t.bookPage.serviceLabel}</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {serviceMap.map(s => (
                    <div key={s} className={`checkbox-service ${selectedServices.includes(s) ? "selected" : ""}`} onClick={() => toggleService(s)}>
                      <div style={{ width: 18, height: 18, border: `1.5px solid ${selectedServices.includes(s) ? COLORS.dark : COLORS.border}`, borderRadius: 3, background: selectedServices.includes(s) ? COLORS.dark : "white", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                        {selectedServices.includes(s) && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
                      </div>
                      {s}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: "100%" }} onClick={() => setBookStep(2)} disabled={selectedServices.length === 0} style={{ width: "100%", background: selectedServices.length === 0 ? COLORS.border : COLORS.dark, color: selectedServices.length === 0 ? COLORS.light : "white", border: "none", padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: "0.1em", cursor: selectedServices.length === 0 ? "not-allowed" : "pointer", borderRadius: 2, transition: "all 0.2s" }}>
                  {lang === "zh" ? "下一步 →" : "Next →"}
                </button>
              </div>
            )}
            {bookStep === 2 && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label">{t.bookPage.dateLabel}</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">{t.bookPage.timeLabel}</label>
                    <input type="time" className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t.bookPage.areaLabel}</label>
                  <input type="text" className="form-input" placeholder={t.bookPage.areaPlaceholder} />
                </div>
                <div>
                  <label className="form-label">{t.bookPage.noteLabel}</label>
                  <textarea className="form-input" placeholder={t.bookPage.notePlaceholder} rows={3} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setBookStep(1)} className="btn-secondary" style={{ flex: 1 }}>← {lang === "zh" ? "上一步" : "Back"}</button>
                  <button onClick={() => setBookStep(3)} className="btn-primary" style={{ flex: 2 }}>{lang === "zh" ? "下一步 →" : "Next →"}</button>
                </div>
              </div>
            )}
            {bookStep === 3 && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label">{t.bookPage.nameLabel}</label>
                    <input type="text" className="form-input" placeholder={t.bookPage.namePlaceholder} />
                  </div>
                  <div>
                    <label className="form-label">{t.bookPage.phoneLabel}</label>
                    <input type="tel" className="form-input" placeholder={t.bookPage.phonePlaceholder} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setBookStep(2)} className="btn-secondary" style={{ flex: 1 }}>← {lang === "zh" ? "上一步" : "Back"}</button>
                  <button onClick={() => setBookDone(true)} className="btn-primary" style={{ flex: 2 }}>{t.bookPage.submitBtn}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // JOIN PAGE
  const JoinPage = () => {
    if (joinDone) return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🌿</div>
          <h2 style={{ fontSize: 28, fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", marginBottom: 16, color: COLORS.dark }}>{t.joinPage.successTitle}</h2>
          <p style={{ fontSize: 14, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8, marginBottom: 32 }}>{t.joinPage.successDesc}</p>
          <button className="nav-link" onClick={() => { setJoinDone(false); navigate("home"); }}>← {lang === "zh" ? "回首頁" : "Back to home"}</button>
        </div>
      </div>
    );

    return (
      <div style={{ paddingTop: 80, minHeight: "100vh", background: COLORS.bg }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "-0.01em", marginBottom: 10, color: COLORS.dark }}>{t.joinPage.title}</h1>
            <p style={{ fontSize: 13, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{t.joinPage.subtitle}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 40 }}>
            {t.joinPage.perks.map((p, i) => (
              <div key={i} style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", marginBottom: 4, color: COLORS.dark }}>{p.title}</div>
                <div style={{ fontSize: 11, color: COLORS.mid, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "white", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="form-label">{t.joinPage.serviceLabel}</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                {serviceMap.map(s => (
                  <div key={s} className={`checkbox-service ${selectedServices.includes(s) ? "selected" : ""}`} onClick={() => toggleService(s)} style={{ fontSize: 13 }}>
                    <div style={{ width: 16, height: 16, border: `1.5px solid ${selectedServices.includes(s) ? COLORS.dark : COLORS.border}`, borderRadius: 3, background: selectedServices.includes(s) ? COLORS.dark : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedServices.includes(s) && <span style={{ color: "white", fontSize: 9 }}>✓</span>}
                    </div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">{t.joinPage.nameLabel}</label>
                <input type="text" className="form-input" placeholder={t.joinPage.namePlaceholder} />
              </div>
              <div>
                <label className="form-label">{t.joinPage.phoneLabel}</label>
                <input type="tel" className="form-input" placeholder={t.joinPage.phonePlaceholder} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">{t.joinPage.areaLabel}</label>
                <input type="text" className="form-input" placeholder={t.joinPage.areaPlaceholder} />
              </div>
              <div>
                <label className="form-label">{t.joinPage.rateLabel}</label>
                <input type="text" className="form-input" placeholder={t.joinPage.ratePlaceholder} />
              </div>
            </div>
            <div>
              <label className="form-label">{t.joinPage.bioLabel}</label>
              <textarea className="form-input" placeholder={t.joinPage.bioPlaceholder} rows={3} style={{ resize: "vertical" }} />
            </div>
            <div>
              <label className="form-label">{t.joinPage.idLabel}</label>
              <input type="text" className="form-input" placeholder={t.joinPage.idPlaceholder} />
            </div>
            <div>
              <label className="form-label">{t.joinPage.eduLabel}</label>
              <input type="text" className="form-input" placeholder={t.joinPage.eduPlaceholder} />
            </div>
            <div>
              <label className="form-label">{t.joinPage.noteLabel}</label>
              <textarea className="form-input" placeholder={t.joinPage.notePlaceholder} rows={2} style={{ resize: "vertical" }} />
            </div>
            {/* 免費加入說明 */}
            <div style={{ background: "#FFF8E8", border: "1px solid #FFD166", borderRadius: 6, padding: "14px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>🎁</span>
              <div style={{ fontSize: 12, color: "#8B6914", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, fontWeight: 300 }}>
                {lang === "zh"
                  ? "目前免費加入，未來將推出月費方案。早期加入的幫手享有優惠價格，現在就是最好的時機。"
                  : "Currently free to join. A monthly plan will be introduced in the future. Early helpers will enjoy preferential pricing — now is the best time."}
              </div>
            </div>
            <div style={{ background: "#F0FAF4", border: "1px solid #A8D5B5", borderRadius: 6, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>💬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", color: "#2E7D32", marginBottom: 4 }}>
                  {lang === "zh" ? "送出後請加入 LINE 完成審核" : "Add LINE after submitting to complete verification"}
                </div>
                <div style={{ fontSize: 12, color: "#4CAF50", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, fontWeight: 300 }}>
                  {lang === "zh"
                    ? "我們會請您透過 LINE 傳送：身分證正反面、本人自拍、學歷或相關經驗說明。審核通過後即可開始接案。"
                    : "We'll ask you to send via LINE: ID card (front & back), selfie, and education or experience details. Once approved, you can start taking cases."}
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "16px" }} onClick={() => setJoinDone(true)}>{t.joinPage.submitBtn}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'DM Sans', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      <style>{styles}</style>
      <Nav />
      {page === "home" && <HomePage />}
      {page === "helpers" && <HelpersPage />}
      {page === "book" && <BookPage />}
      {page === "join" && <JoinPage />}
      <Footer />
    </div>
  );
}
