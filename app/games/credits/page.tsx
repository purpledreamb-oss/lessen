import Link from 'next/link';
import styles from '../games.module.css';

export default function Credits() {
  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link href="/games" className={styles.backBtn}>← 大廳</Link>
      </div>
      <h1 className={styles.hubTitle}>素材版權說明</h1>
      <div style={{ maxWidth: 680, margin: '0 auto', lineHeight: 1.8 }}>
        <h2 className={styles.sectionTitle}>🎨 圖片素材</h2>
        <div className={styles.leaderBoard}>
          <p><strong>寶可夢 (Pokémon)</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#9fb3d6' }}>
            皮卡丘、噴火龍、水箭龜、伊布、耿鬼、快龍等圖像版權屬於任天堂 / Game Freak / Creatures Inc.。此遊戲僅供家庭內部娛樂，不公開散布或商業使用。
          </p>
          <p style={{ fontSize: '0.85rem', color: '#9fb3d6', marginTop: 4 }}>
            Sprites from <a href="https://github.com/PokeAPI/sprites" style={{ color: '#4dabf7' }}>PokeAPI/sprites</a>
          </p>
        </div>

        <div className={styles.leaderBoard}>
          <p><strong>恐龍與戰士圖示</strong></p>
          <p style={{ fontSize: '0.9rem', color: '#9fb3d6' }}>
            恐龍與戰士造型取自 <a href="https://game-icons.net" style={{ color: '#4dabf7' }}>game-icons.net</a>，作者包含 Delapouite、Lorc 等，採 CC BY 3.0 授權。
          </p>
          <p style={{ fontSize: '0.85rem', color: '#9fb3d6', marginTop: 4 }}>
            Icons by Delapouite &amp; Lorc under CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)
          </p>
        </div>

        <h2 className={styles.sectionTitle}>⚠️ 使用範圍聲明</h2>
        <div className={styles.leaderBoard}>
          <p style={{ fontSize: '0.9rem' }}>
            本遊戲為家庭內部娛樂用途設計，不公開散布、不商業使用。寶可夢、奧特曼等相關名稱與形象版權均歸原權利人所有。若要對外公開，建議將角色替換為完全原創造型與名稱。
          </p>
        </div>

        <h2 className={styles.sectionTitle}>💾 資料儲存</h2>
        <div className={styles.leaderBoard}>
          <p style={{ fontSize: '0.9rem' }}>
            目前存檔與排行榜皆儲存在瀏覽器本機（localStorage）。換瀏覽器或清除資料會清除紀錄。日後可升級為雲端排行榜。
          </p>
        </div>
      </div>
    </div>
  );
}
