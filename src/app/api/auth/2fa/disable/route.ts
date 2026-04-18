import { NextRequest, NextResponse } from 'next/server';
import { auth } from '$/server/auth/auth';
import { db } from '$/server/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Disable 2FA for the user
    await db.user.update({
      where: { id: session.user.id },
      data: { 
        twoFactorEnabled: false,
        twoFactorSecret: null // Also remove the secret for security
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: '2FA disabled successfully' 
    });

  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}