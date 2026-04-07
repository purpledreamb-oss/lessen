import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=line_denied', request.url));
  }

  const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!channelId || !channelSecret || !serviceRoleKey) {
    return NextResponse.redirect(new URL('/login?error=line_not_configured', request.url));
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/line/callback`;

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=line_token', request.url));
    }

    // Get LINE profile
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const lineProfile = await profileRes.json();

    // Decode ID token for email (if available)
    let email = '';
    if (tokenData.id_token) {
      const payload = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString());
      email = payload.email || '';
    }

    // Use service role to manage users
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    // Check if user exists by LINE ID in metadata
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.user_metadata?.line_user_id === lineProfile.userId
    );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user
      const userEmail = email || `line_${lineProfile.userId}@lessen.app`;
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          full_name: lineProfile.displayName,
          avatar_url: lineProfile.pictureUrl,
          line_user_id: lineProfile.userId,
          provider: 'line',
        },
      });

      if (createError || !newUser.user) {
        return NextResponse.redirect(new URL('/login?error=line_create', request.url));
      }
      userId = newUser.user.id;
    }

    // Generate a magic link to sign the user in
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: existingUser?.email || email || `line_${lineProfile.userId}@lessen.app`,
    });

    if (linkError || !linkData) {
      return NextResponse.redirect(new URL('/login?error=line_session', request.url));
    }

    // Extract the token from the link and redirect through auth callback
    const linkUrl = new URL(linkData.properties.action_link);
    const token = linkUrl.searchParams.get('token');
    const type = linkUrl.searchParams.get('type');

    // Redirect to Supabase's verify endpoint to establish the session
    const verifyUrl = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`, request.url);
    verifyUrl.searchParams.set('token', token!);
    verifyUrl.searchParams.set('type', type!);
    verifyUrl.searchParams.set('redirect_to', `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`);

    return NextResponse.redirect(verifyUrl.toString());
  } catch (err) {
    console.error('LINE login error:', err);
    return NextResponse.redirect(new URL('/login?error=line_error', request.url));
  }
}
