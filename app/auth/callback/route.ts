import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a profile (OAuth users might not)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, city, role')
          .eq('id', user.id)
          .single();

        if (!profile) {
          // New OAuth user — needs onboarding
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }

        // Existing user with incomplete profile
        if (!profile.city) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL('/login?error=verification', request.url));
}
