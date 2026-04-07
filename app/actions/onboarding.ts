'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { sanitizeInput } from '@/lib/validation';
import type { UserRole } from '@/lib/supabase/types';

export type OnboardingState = {
  error?: string;
  success?: boolean;
} | undefined;

// For OAuth users who need to create a profile
export async function createOAuthProfile(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '請先登入' };

  const role = formData.get('role') as UserRole;
  if (!role) return { error: '請選擇身份' };

  const fullName = sanitizeInput(
    (formData.get('fullName') as string) || user.user_metadata?.full_name || '',
    50
  );

  // Create profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email || '',
    full_name: fullName,
    phone: '',
    role,
    city: '',
    district: '',
    bio: null,
    avatar_url: user.user_metadata?.avatar_url || null,
  });

  if (profileError) {
    console.error('OAuth profile error:', profileError);
    return { error: '建立個人資料失敗' };
  }

  // Create role-specific profile
  if (role === 'helper') {
    await supabase.from('helper_profiles').upsert({
      user_id: user.id,
      categories: [],
      tags: [],
      status: 'approved',
    }, { onConflict: 'user_id' });
  } else {
    await supabase.from('parent_profiles').upsert({
      user_id: user.id,
      children_ages: [],
      needs: [],
    }, { onConflict: 'user_id' });
  }

  return { success: true };
}

// Save profile details (step 2 of onboarding)
export async function saveProfileDetails(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '請先登入' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) return { error: '找不到個人資料' };

  const phone = sanitizeInput((formData.get('phone') as string) || '', 15);
  const city = sanitizeInput((formData.get('city') as string) || '', 10);
  const district = sanitizeInput((formData.get('district') as string) || '', 20);

  // Update base profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ phone, city, district })
    .eq('id', user.id);

  if (updateError) return { error: '更新失敗' };

  if (profile.role === 'helper') {
    const categories = formData.getAll('categories') as string[];
    const tags = formData.getAll('tags') as string[];
    const hourlyRate = formData.get('hourlyRate') as string;
    const experienceYears = formData.get('experienceYears') as string;
    const certifications = formData.getAll('certifications') as string[];
    const availableDays = formData.getAll('availableDays') as string[];
    const availableTimeStart = formData.get('availableTimeStart') as string;
    const availableTimeEnd = formData.get('availableTimeEnd') as string;
    const bio = sanitizeInput((formData.get('bio') as string) || '', 1000);

    // Auto-approval: always approved
    const status = 'approved';

    await supabase
      .from('helper_profiles')
      .update({
        categories,
        tags,
        hourly_rate: hourlyRate ? parseInt(hourlyRate) : null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        certifications,
        available_days: availableDays,
        available_time_start: availableTimeStart || null,
        available_time_end: availableTimeEnd || null,
        status,
      })
      .eq('user_id', user.id);

    // Update bio in profiles
    if (bio) {
      await supabase.from('profiles').update({ bio }).eq('id', user.id);
    }
  } else if (profile.role === 'parent') {
    const childrenAges = formData.getAll('childrenAges') as string[];
    const needs = formData.getAll('needs') as string[];
    const preferredTime = formData.get('preferredTime') as string;
    const notes = sanitizeInput((formData.get('notes') as string) || '', 500);

    await supabase
      .from('parent_profiles')
      .update({
        children_ages: childrenAges.filter(Boolean),
        needs,
        preferred_time: preferredTime || null,
        notes: notes || null,
      })
      .eq('user_id', user.id);
  }

  redirect('/dashboard');
}
