import { NextRequest, NextResponse } from 'next/server';
import { auth } from '$/server/auth/auth';
import { db } from '$/server/db';
import { verifyTOTPToken } from '$/lib/utils/totp';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token || typeof token !== 'string' || token.length !== 6) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    // Get user's 2FA secret
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: '2FA not set up' }, { status: 400 });
    }

    // Verify the TOTP token
    const isValid = verifyTOTPToken(token, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Token verified successfully' 
    });

  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}