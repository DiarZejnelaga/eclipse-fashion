// src/app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { findUserByResetToken, updateUserPassword } from '@/app/lib/users';

export async function POST(request) {
  console.log('[reset-password] API hit');
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const user = await findUserByResetToken(token);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset token.' },
        { status: 400 }
      );
    }

    const success = await updateUserPassword(user.id, newPassword);

    if (success) {
      return NextResponse.json({
        message: 'Password has been reset successfully. You can now log in.',
      });
    } else {
      console.error('[reset-password] updateUserPassword returned false for user:', user.id);
      return NextResponse.json(
        { message: 'Failed to update password due to an unexpected issue.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[reset-password] ERROR:', error.message, error.stack);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
