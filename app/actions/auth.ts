'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { UserRole } from '@/lib/supabase/types';
import { validatePassword, validateEmail, sanitizeInput } from '@/lib/validation';
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

// ===== SIGN UP (simplified — only email, password, name, role) =====
export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const headersList = await headers();
  const ip = getClientIp(headersList);

  const limit = rateLimit(`signup:${ip}`, { maxAttempts: 5, windowMs: 3600_000 });
  if (!limit.success) {
    return { error: '註冊嘗試次數過多，請稍後再試' };
  }

  const supabase = await createClient();

  const email = sanitizeInput(formData.get('email') as string, 254);
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const fullName = sanitizeInput(formData.get('fullName') as string, 50);
  const role = formData.get('role') as UserRole;

  // Validation
  if (!email || !password || !fullName || !role) {
    return { error: '請填寫所有必填欄位' };
  }
  if (!validateEmail(email)) {
    return { error: '請輸入有效的 Email 地址' };
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

  // Create minimal profile using admin client (bypasses RLS since user may not have confirmed email yet)
  const adminClient = createAdminClient();

  const { error: profileError } = await adminClient.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    phone: '',
    role,
    city: '',
    district: '',
    bio: null,
    avatar_url: null,
  });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    return { error: '個人資料建立失敗，請稍後再試' };
  }

  // Create empty role-specific profile
  if (role === 'helper') {
    await adminClient.from('helper_profiles').insert({
      user_id: authData.user.id,
      categories: [],
      tags: [],
      hourly_rate: null,
      experience_years: null,
      certifications: [],
      portfolio_urls: [],
      available_days: [],
      available_time_start: null,
      available_time_end: null,
      status: 'approved',
    });
  } else if (role === 'parent') {
    await adminClient.from('parent_profiles').insert({
      user_id: authData.user.id,
      children_ages: [],
      needs: [],
      preferred_time: null,
      notes: null,
    });
  }

  redirect('/verify-email');
}

// ===== SIGN IN =====
export async function signin(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = sanitizeInput(formData.get('email') as string, 254);
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '請輸入 Email 和密碼' };
  }

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
