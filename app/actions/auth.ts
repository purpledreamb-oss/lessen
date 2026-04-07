'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { UserRole } from '@/lib/supabase/types';
import { validatePassword, validateEmail, validatePhone, sanitizeInput } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

export type AuthState = {
  error?: string;
  success?: boolean;
} | undefined;

function getClientIp(headersList: Headers): string {
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headersList.get('x-real-ip')
    || 'unknown';
}

// ===== SIGN UP =====
export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  // Rate limit: 5 signups per IP per hour
  const limit = rateLimit(`signup:${ip}`, { maxAttempts: 5, windowMs: 3600_000 });
  if (!limit.success) {
    return { error: '註冊嘗試次數過多，請稍後再試' };
  }

  const supabase = await createClient();

  const email = sanitizeInput(formData.get('email') as string, 254);
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const fullName = sanitizeInput(formData.get('fullName') as string, 50);
  const phone = sanitizeInput(formData.get('phone') as string, 15);
  const role = formData.get('role') as UserRole;
  const city = sanitizeInput(formData.get('city') as string, 10);
  const district = sanitizeInput((formData.get('district') as string) || '', 20);

  // Validation
  if (!email || !password || !fullName || !phone || !role || !city) {
    return { error: '請填寫所有必填欄位' };
  }
  if (!validateEmail(email)) {
    return { error: '請輸入有效的 Email 地址' };
  }
  if (!validatePhone(phone)) {
    return { error: '請輸入有效的手機號碼（09xx-xxx-xxx）' };
  }
  const pwResult = validatePassword(password);
  if (!pwResult.valid) {
    return { error: pwResult.message };
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
      notes: notes ? sanitizeInput(notes) : null,
    });

    if (parentError) {
      console.error('Parent profile error:', parentError);
    }
  }

  redirect('/verify-email');
}

// ===== SIGN IN =====
export async function signin(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const headersList = await headers();
  const email = sanitizeInput(formData.get('email') as string, 254);
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '請輸入 Email 和密碼' };
  }

  // Rate limit: 10 attempts per email per 15 minutes
  const limit = rateLimit(`signin:${email}`, { maxAttempts: 10, windowMs: 900_000 });
  if (!limit.success) {
    return { error: '登入嘗試次數過多，請 15 分鐘後再試' };
  }

  const supabase = await createClient();
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
