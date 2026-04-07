'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { HelperWithProfile } from '@/app/actions/helpers';
import HelperCard from './HelperCard';
import TaiwanMap from './TaiwanMap';
import { TAIWAN_CITIES } from '@/lib/taiwan-cities';

interface HelperListProps {
  helpers: HelperWithProfile[];
  helperCounts: Record<string, number>;
}

const categoryOptions = ['家教', '陪玩', '管家'];

export default function HelperList({ helpers, helperCounts }: HelperListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city');
  const selectedCategory = searchParams.get('category');
  const minRate = searchParams.get('minRate');

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  }

  function resetFilters() {
    router.push('/browse');
  }

  // Client-side min rate filtering
  const filtered = minRate
    ? helpers.filter((h) => h.hourly_rate && h.hourly_rate >= parseInt(minRate))
    : helpers;

  const hasFilters = selectedCity || selectedCategory || minRate;

  return (
    <div>
      {/* Pure-tutor style filter bar */}
      <div className="filter-bar">
        <select
          value={selectedCity || ''}
          onChange={(e) => updateFilters('city', e.target.value || null)}
          className="filter-select"
        >
          <option value="">全部地區</option>
          {TAIWAN_CITIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedCategory || ''}
          onChange={(e) => updateFilters('category', e.target.value || null)}
          className="filter-select"
        >
          <option value="">選擇類別</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="最低時薪"
          value={minRate || ''}
          onChange={(e) => updateFilters('minRate', e.target.value || null)}
          className="filter-input"
          min="0"
        />

        {hasFilters && (
          <button onClick={resetFilters} className="filter-reset">重置篩選</button>
        )}
      </div>

      <div className="browse-layout">
        <aside className="browse-sidebar">
          <TaiwanMap
            selectedCity={selectedCity}
            helperCounts={helperCounts}
            onCitySelect={(city) => updateFilters('city', city)}
          />
        </aside>

        <main className="browse-main">
          <div className="browse-header">
            <h2>
              {selectedCity || '全台灣'}的幫手
              <span className="browse-count">（{filtered.length} 位）</span>
            </h2>
          </div>

          {filtered.length > 0 ? (
            <div className="helper-grid">
              {filtered.map((helper) => (
                <HelperCard key={helper.id} helper={helper} />
              ))}
            </div>
          ) : (
            <div className="browse-empty">
              <p>此地區目前沒有幫手</p>
              <p>成為第一位幫手吧！</p>
              <a href="/register/helper" className="form-submit" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none' }}>
                註冊成為幫手
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
