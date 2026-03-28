import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signout } from '@/app/actions/auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  let roleProfile = null;
  if (profile?.role === 'helper') {
    const { data } = await supabase
      .from('helper_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    roleProfile = data;
  } else if (profile?.role === 'parent') {
    const { data } = await supabase
      .from('parent_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    roleProfile = data;
  }

  return (
    <div className="dashboard-page">
      <header className="dash-header">
        <div className="header-inner">
          <Link href="/" className="header-logo">
            <span className="logo-icon">L</span>
            <span className="logo-text">Lessen</span>
          </Link>
          <div className="dash-header-right">
            <span className="dash-user-name">{profile?.full_name || user.email}</span>
            <form action={signout}>
              <button type="submit" className="dash-logout-btn">登出</button>
            </form>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-container">
          <h1>歡迎回來，{profile?.full_name}！</h1>

          <div className="dash-card">
            <h2>個人資料</h2>
            <div className="dash-info-grid">
              <div className="dash-info-item">
                <span className="dash-info-label">姓名</span>
                <span className="dash-info-value">{profile?.full_name}</span>
              </div>
              <div className="dash-info-item">
                <span className="dash-info-label">Email</span>
                <span className="dash-info-value">{profile?.email}</span>
              </div>
              <div className="dash-info-item">
                <span className="dash-info-label">電話</span>
                <span className="dash-info-value">{profile?.phone}</span>
              </div>
              <div className="dash-info-item">
                <span className="dash-info-label">身份</span>
                <span className="dash-info-value">
                  {profile?.role === 'helper' ? '幫手' : '家長'}
                </span>
              </div>
              <div className="dash-info-item">
                <span className="dash-info-label">地區</span>
                <span className="dash-info-value">{profile?.city} {profile?.district}</span>
              </div>
            </div>
          </div>

          {profile?.role === 'helper' && roleProfile && (
            <div className="dash-card">
              <h2>幫手資料</h2>
              <div className="dash-info-grid">
                <div className="dash-info-item">
                  <span className="dash-info-label">審核狀態</span>
                  <span className={`dash-status dash-status-${roleProfile.status}`}>
                    {roleProfile.status === 'pending' ? '審核中' :
                     roleProfile.status === 'approved' ? '已通過' : '未通過'}
                  </span>
                </div>
                <div className="dash-info-item">
                  <span className="dash-info-label">時薪</span>
                  <span className="dash-info-value">
                    {roleProfile.hourly_rate ? `NT$${roleProfile.hourly_rate}/hr` : '未設定'}
                  </span>
                </div>
                <div className="dash-info-item">
                  <span className="dash-info-label">經驗</span>
                  <span className="dash-info-value">
                    {roleProfile.experience_years ? `${roleProfile.experience_years} 年` : '未設定'}
                  </span>
                </div>
              </div>
              {roleProfile.categories?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <span className="dash-info-label">服務類別</span>
                  <div className="dash-tags">
                    {roleProfile.categories.map((c: string) => (
                      <span key={c} className="dash-tag">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {roleProfile.tags?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <span className="dash-info-label">專長標籤</span>
                  <div className="dash-tags">
                    {roleProfile.tags.map((t: string) => (
                      <span key={t} className="dash-tag">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {profile?.role === 'parent' && roleProfile && (
            <div className="dash-card">
              <h2>家長資料</h2>
              <div className="dash-info-grid">
                {roleProfile.children_ages?.length > 0 && (
                  <div className="dash-info-item">
                    <span className="dash-info-label">孩子年齡</span>
                    <span className="dash-info-value">{roleProfile.children_ages.join('、')}</span>
                  </div>
                )}
                {roleProfile.preferred_time && (
                  <div className="dash-info-item">
                    <span className="dash-info-label">偏好時段</span>
                    <span className="dash-info-value">{roleProfile.preferred_time}</span>
                  </div>
                )}
              </div>
              {roleProfile.needs?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <span className="dash-info-label">需要的服務</span>
                  <div className="dash-tags">
                    {roleProfile.needs.map((n: string) => (
                      <span key={n} className="dash-tag">{n}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
