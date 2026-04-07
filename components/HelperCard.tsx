import type { HelperWithProfile } from '@/app/actions/helpers';

const avatarEmojis = ['👩‍🏫', '👨‍🏫', '🧑‍🎨', '👩‍💻', '🧑‍🍳', '🤸', '🎵', '📚'];

function getAvatar(name: string): string {
  const idx = name.charCodeAt(0) % avatarEmojis.length;
  return avatarEmojis[idx];
}

export default function HelperCard({ helper }: { helper: HelperWithProfile }) {
  const profile = helper.profiles;

  return (
    <div className="helper-card">
      <div className="helper-card-avatar">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.full_name} />
        ) : (
          <span className="helper-card-emoji">{getAvatar(profile.full_name)}</span>
        )}
      </div>
      <div className="helper-card-body">
        <h3 className="helper-card-name">{profile.full_name}</h3>
        <p className="helper-card-location">{profile.city}{profile.district ? ` ${profile.district}` : ''}</p>

        {helper.categories.length > 0 && (
          <div className="helper-card-tags">
            {helper.categories.map((cat) => (
              <span key={cat} className="helper-card-tag">{cat}</span>
            ))}
          </div>
        )}

        {helper.tags.length > 0 && (
          <div className="helper-card-tags">
            {helper.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="helper-card-tag tag-sm">{tag}</span>
            ))}
            {helper.tags.length > 4 && (
              <span className="helper-card-tag tag-sm">+{helper.tags.length - 4}</span>
            )}
          </div>
        )}

        <div className="helper-card-footer">
          {helper.hourly_rate && (
            <span className="helper-card-rate">NT${helper.hourly_rate}/hr</span>
          )}
          {helper.experience_years && (
            <span className="helper-card-exp">{helper.experience_years} 年經驗</span>
          )}
        </div>
      </div>
    </div>
  );
}
