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

const categoryOptions = ['學科家教', '才藝老師', '陪玩姊姊', '家事管家', '接送服務', '特殊需求'];

export default function HelperList({ helpers, helperCounts }: HelperListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get('city');
  const selectedCategory = searchParams.get('category');

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/browse?${params.toString()}`);
  }

  return (
    <div className="browse-layout">
      <aside className="browse-sidebar">
        <TaiwanMap
          selectedCity={selectedCity}
          helperCounts={helperCounts}
          onCitySelect={(city) => updateFilters('city', city)}
        />

        <div className="browse-filters">
          <div className="form-group">
            <label htmlFor="filter-city">縣市</label>
            <select
              id="filter-city"
              value={selectedCity || ''}
              onChange={(e) => updateFilters('city', e.target.value || null)}
            >
              <option value="">全部地區</option>
              {TAIWAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="filter-category">服務類別</label>
            <select
              id="filter-category"
              value={selectedCategory || ''}
              onChange={(e) => updateFilters('category', e.target.value || null)}
            >
              <option value="">全部類別</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </aside>

      <main className="browse-main">
        <div className="browse-header">
          <h2>
            {selectedCity || '全台灣'}的幫手
            <span className="browse-count">（{helpers.length} 位）</span>
          </h2>
        </div>

        {helpers.length > 0 ? (
          <div className="helper-grid">
            {helpers.map((helper) => (
              <HelperCard key={helper.id} helper={helper} />
            ))}
          </div>
        ) : (
          <div className="browse-empty">
            <p>😔 此地區目前沒有幫手</p>
            <p>成為第一位幫手吧！</p>
            <a href="/register/helper" className="form-submit" style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none' }}>
              註冊成為幫手
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
