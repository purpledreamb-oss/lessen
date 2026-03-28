'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/supabase/types';

export type AuthState = {
  error?: string;
  success?: boolean;
} | undefined;

// ===== SIGN UP =====
export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as UserRole;
  const city = formData.get('city') as string;
  const district = formData.get('district') as string;

  // Validation
  if (!email || !password || !fullName || !phone || !role || !city) {
    return { error: '請填寫所有必填欄位' };
  }
  if (password.length < 6) {
    return { error: '密碼至少需要 6 個字元' };
  }
  if (password !== confirmPassword) {
    return { error: '兩次密碼輸入不一致' };
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: '此 Email 已被註冊' };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: '註冊失敗，請稍後再試' };
  }

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    phone,
    role,
    city,
    district: district || '',
    bio: null,
    avatar_url: null,
  });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    return { error: '個人資料建立失敗，請稍後再試' };
  }

  // Create role-specific profile
  if (role === 'helper') {
    const categories = formData.getAll('categories') as string[];
    const tags = formData.getAll('tags') as string[];
    const hourlyRate = formData.get('hourlyRate') as string;
    const experienceYears = formData.get('experienceYears') as string;
    const certifications = formData.getAll('certifications') as string[];
    const availableDays = formData.getAll('availableDays') as string[];
    const availableTimeStart = formData.get('availableTimeStart') as string;
    const availableTimeEnd = formData.get('availableTimeEnd') as string;

    const { error: helperError } = await supabase.from('helper_profiles').insert({
      user_id: authData.user.id,
      categories: categories.length > 0 ? categories : [],
      tags: tags.length > 0 ? tags : [],
      hourly_rate: hourlyRate ? parseInt(hourlyRate) : null,
      experience_years: experienceYears ? parseInt(experienceYears) : null,
      certifications: certifications.length > 0 ? certifications : [],
      portfolio_urls: [],
      available_days: availableDays.length > 0 ? availableDays : [],
      available_time_start: availableTimeStart || null,
      available_time_end: availableTimeEnd || null,
      status: 'pending',
    });

    if (helperError) {
      console.error('Helper profile error:', helperError);
    }
  } else if (role === 'parent') {
    const childrenAges = formData.getAll('childrenAges') as string[];
    const needs = formData.getAll('needs') as string[];
    const preferredTime = formData.get('preferredTime') as string;
    const notes = formData.get('notes') as string;

    const { error: parentError } = await supabase.from('parent_profiles').insert({
      user_id: authData.user.id,
      children_ages: childrenAges.length > 0 ? childrenAges : [],
      needs: needs.length > 0 ? needs : [],
      preferred_time: preferredTime || null,
      notes: notes || null,
    });

    if (parentError) {
      console.error('Parent profile error:', parentError);
    }
  }

  redirect('/dashboard');
}

// ===== SIGN IN =====
export async function signin(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '請輸入 Email 和密碼' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes('Invalid login')) {
      return { error: 'Email 或密碼錯誤' };
    }
    return { error: error.message };
  }

  const redirectTo = formData.get('redirect') as string;
  redirect(redirectTo || '/dashboard');
}

// ===== SIGN OUT =====
export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
