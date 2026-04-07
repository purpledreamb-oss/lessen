'use server';

import { createClient } from '@/lib/supabase/server';
import type { Profile, HelperProfile } from '@/lib/supabase/types';

export type HelperWithProfile = HelperProfile & {
  profiles: Profile;
};

export async function getApprovedHelpers(city?: string, category?: string): Promise<HelperWithProfile[]> {
  const supabase = await createClient();
  let query = supabase
    .from('helper_profiles')
    .select('*, profiles!inner(*)')
    .eq('status', 'approved');

  if (city) {
    query = query.eq('profiles.city', city);
  }
  if (category) {
    query = query.contains('categories', [category]);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching helpers:', error);
    return [];
  }

  return (data || []) as unknown as HelperWithProfile[];
}

export async function getHelperCountsByCity(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('helper_profiles')
    .select('profiles!inner(city)')
    .eq('status', 'approved');

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  for (const row of data as unknown as { profiles: { city: string } }[]) {
    const city = row.profiles.city;
    counts[city] = (counts[city] || 0) + 1;
  }
  return counts;
}
