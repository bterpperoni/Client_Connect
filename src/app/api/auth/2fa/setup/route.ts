import { NextRequest, NextResponse } from 'next/server';
import { auth } from '$/server/auth/auth';
import { db } from '$/server/db';
import { generateTOTPSecret, generateQRCodeDataURL } from '$/lib/utils/totp';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has 2FA enabled
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 });
    }

    // Generate TOTP secret
    const { secret, otpauth_url } = generateTOTPSecret(user.email || session.user.email || '');
    
    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(otpauth_url);

    // Store the secret in the database (but don't enable 2FA yet)
    await db.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret }
    });

    return NextResponse.json({
      secret: secret,
      qrCode: qrCodeDataURL,
      otpauth_url: otpauth_url
    });

  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}