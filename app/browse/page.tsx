import { Suspense } from 'react';
import { getApprovedHelpers, getHelperCountsByCity } from '@/app/actions/helpers';
import HelperList from '@/components/HelperList';
import Link from 'next/link';

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [helpers, helperCounts] = await Promise.all([
    getApprovedHelpers(params.city, params.category),
    getHelperCountsByCity(),
  ]);

  return (
    <div className="browse-page">
      <nav className="browse-nav">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <div className="browse-nav-links">
          <Link href="/">首頁</Link>
          <Link href="/browse" className="active">瀏覽幫手</Link>
          <Link href="/login">登入</Link>
        </div>
      </nav>

      <div className="browse-content">
        <h1 className="browse-title">尋找你的幫手</h1>
        <p className="browse-subtitle">點選地圖上的縣市，或使用篩選器尋找合適的幫手</p>

        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40 }}>載入中...</div>}>
          <HelperList helpers={helpers} helperCounts={helperCounts} />
        </Suspense>
      </div>
    </div>
  );
}
