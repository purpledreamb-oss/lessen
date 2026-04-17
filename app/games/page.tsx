import Link from 'next/link';
import styles from './games.module.css';

export default function GamesHub() {
  return (
    <div className={styles.shell}>
      <h1 className={styles.hubTitle}>🎮 小遊戲大廳</h1>
      <p className={styles.hubSubtitle}>選一個開始玩吧！</p>

      <div className={styles.cardGrid}>
        <Link href="/games/muzhe" className={`${styles.gameCard} ${styles.cardMuzhe}`}>
          <span className={styles.cardAge}>8 歲</span>
          <span className={styles.cardBadge}>回合制 · 收集對戰</span>
          <div className={styles.cardName}>沐哲的冒險</div>
          <div className={styles.cardDesc}>組一支隊伍，打倒關卡 boss，收集更多角色！光、獸、古三種屬性相剋。</div>
          <div className={styles.cardEmojis}>⚡ 🦖 🦸</div>
        </Link>

        <Link href="/games/jiean" className={`${styles.gameCard} ${styles.cardJiean}`}>
          <span className={styles.cardAge}>5 歲</span>
          <span className={styles.cardBadge}>點擊 · 打怪</span>
          <div className={styles.cardName}>杰安打怪獸</div>
          <div className={styles.cardDesc}>點螢幕發射光線，打倒跑過來的怪獸！60 秒挑戰最高分。</div>
          <div className={styles.cardEmojis}>💥 👊 ⭐</div>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link href="/games/credits" style={{ color: '#9fb3d6', fontSize: '0.9rem', textDecoration: 'underline' }}>
          素材版權說明
        </Link>
      </div>
    </div>
  );
}
