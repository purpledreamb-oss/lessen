'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/validation';
import type { AuthState } from './auth';

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headersList.get('x-real-ip')
    || 'unknown';

  const limit = rateLimit(`reset:${ip}`, { maxAttempts: 3, windowMs: 3600_000 });
  if (!limit.success) {
    return { error: '請求次數過多，請稍後再試' };
  }

  const email = sanitizeInput(formData.get('email') as string, 254);
  if (!email) {
    return { error: '請輸入 Email' };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  // Always return success to prevent email enumeration
  return { success: true };
}
