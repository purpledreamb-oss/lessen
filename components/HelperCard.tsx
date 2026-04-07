import Link from 'next/link';
import type { HelperWithProfile } from '@/app/actions/helpers';

export default function HelperCard({ helper }: { helper: HelperWithProfile }) {
  const profile = helper.profiles;

  return (
    <div className="tutor-card">
      <div className="tutor-card-top">
        <div className="tutor-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} />
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>

        <div className="tutor-card-info">
          <h3 className="tutor-name">{profile.full_name}</h3>
          {profile.bio && (
            <p className="tutor-bio-preview">{profile.bio.slice(0, 60)}{profile.bio.length > 60 ? '...' : ''}</p>
          )}
        </div>

        {helper.hourly_rate && (
          <div className="tutor-price">
            <span className="tutor-price-amount">${helper.hourly_rate}</span>
            <span className="tutor-price-unit">/hr</span>
          </div>
        )}
      </div>

      {/* Service categories with pricing */}
      {helper.categories.length > 0 && (
        <div className="tutor-services">
          {helper.categories.map((cat) => (
            <div key={cat} className="tutor-service-row">
              <span className="tutor-service-name">{cat}</span>
              {helper.tags.length > 0 && (
                <span className="tutor-service-subjects">
                  {helper.tags.slice(0, 3).join(' / ')}
                </span>
              )}
              {helper.hourly_rate && (
                <span className="tutor-service-price">${helper.hourly_rate}/hr</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="tutor-card-bottom">
        <span className="tutor-location">📍 {profile.city}{profile.district ? ` ${profile.district}` : ''}</span>
        {helper.experience_years && (
          <span className="tutor-exp">{helper.experience_years} 年經驗</span>
        )}
      </div>

      {profile.bio && (
        <p className="tutor-card-bio">{profile.bio.slice(0, 100)}{profile.bio.length > 100 ? '...' : ''}</p>
      )}

      <Link href={`/helper/${helper.user_id}`} className="tutor-card-btn">
        更多資訊 / 聯絡
      </Link>
    </div>
  );
}
