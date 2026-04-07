import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function HelperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch helper profile with base profile
  const { data: helper } = await supabase
    .from('helper_profiles')
    .select('*, profiles!inner(*)')
    .eq('user_id', id)
    .eq('status', 'approved')
    .single();

  if (!helper) notFound();

  const profile = (helper as any).profiles;

  return (
    <div className="detail-page">
      <nav className="browse-nav">
        <Link href="/" className="auth-logo">
          <span className="logo-icon">L</span>
          <span className="logo-text">Lessen</span>
        </Link>
        <div className="browse-nav-links">
          <Link href="/">首頁</Link>
          <Link href="/browse">瀏覽幫手</Link>
          <Link href="/login">登入</Link>
        </div>
      </nav>

      <div className="detail-content">
        <Link href="/browse" className="detail-back">← 回列表</Link>

        {/* Hero card */}
        <div className="detail-hero">
          <div className="detail-avatar">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} />
            ) : (
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <div className="detail-hero-info">
            <h1>{profile.full_name}</h1>
            <div className="detail-badges">
              {helper.categories?.map((cat: string) => (
                <span key={cat} className="detail-badge">{cat}</span>
              ))}
            </div>
          </div>
          {helper.hourly_rate && (
            <div className="detail-hero-price">
              <span className="detail-price-amount">${helper.hourly_rate}</span>
              <span className="detail-price-unit">/hr</span>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="detail-section">
          <h2>聯絡資訊</h2>
          <div className="detail-contact-grid">
            <div className="detail-contact-card">
              <div className="detail-contact-icon" style={{ background: '#06C755' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zM24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
              </div>
              <div>
                <span className="detail-contact-label">Line ID</span>
                <span className="detail-contact-value">未提供</span>
              </div>
            </div>
            <div className="detail-contact-card">
              <div className="detail-contact-icon" style={{ background: 'var(--sage)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div>
                <span className="detail-contact-label">Email</span>
                <span className="detail-contact-value">{profile.email}</span>
              </div>
            </div>
          </div>
          <p className="detail-contact-note">請主動聯繫幫手，並告知是在「Lessen」看到的資訊</p>
        </div>

        {/* Service categories */}
        {helper.categories?.length > 0 && (
          <div className="detail-section">
            <h2>服務項目</h2>
            <div className="detail-services-grid">
              {helper.categories.map((cat: string) => (
                <div key={cat} className="detail-service-item">
                  <span className="detail-service-cat">{cat}</span>
                  {helper.hourly_rate && (
                    <span className="detail-service-price">${helper.hourly_rate}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags / specialties */}
        {helper.tags?.length > 0 && (
          <div className="detail-section">
            <h2>專長標籤</h2>
            <div className="detail-tags">
              {helper.tags.map((tag: string) => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="detail-section">
          <h2>服務地點</h2>
          <span className="detail-location-badge">{profile.city}{profile.district ? ` ${profile.district}` : ''}</span>
        </div>

        {/* Bio / introduction */}
        {profile.bio && (
          <div className="detail-section">
            <h2>自我介紹</h2>
            <div className="detail-bio">{profile.bio}</div>
          </div>
        )}

        {/* Experience & certifications */}
        <div className="detail-section">
          <h2>經歷資訊</h2>
          <div className="detail-info-grid">
            {helper.experience_years && (
              <div className="detail-info-item">
                <span className="detail-info-label">相關經驗</span>
                <span className="detail-info-value">{helper.experience_years} 年</span>
              </div>
            )}
            {helper.certifications?.length > 0 && (
              <div className="detail-info-item">
                <span className="detail-info-label">持有證照</span>
                <span className="detail-info-value">{helper.certifications.join('、')}</span>
              </div>
            )}
            {helper.available_days?.length > 0 && (
              <div className="detail-info-item">
                <span className="detail-info-label">可服務日</span>
                <span className="detail-info-value">週{helper.available_days.join('、')}</span>
              </div>
            )}
            {helper.available_time_start && helper.available_time_end && (
              <div className="detail-info-item">
                <span className="detail-info-label">可服務時段</span>
                <span className="detail-info-value">{helper.available_time_start} - {helper.available_time_end}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
