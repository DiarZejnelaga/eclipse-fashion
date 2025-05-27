import { NextResponse } from 'next/server';
import { findUserByEmail, setUserResetToken } from '@/app/lib/users';
import { getTransporter } from '@/app/lib/nodemailer';

export async function POST(request) {
  console.log('[API] POST /api/auth/request-password-reset - START');

  try {
    const { email } = await request.json();
    console.log('[API] Email received:', email);

    if (!email) {
      console.log('[API] Email is required - returning 400');
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    console.log('[API] User found:', user ? user.id : 'No user found');

    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    const token = await setUserResetToken(email);
    console.log('[API] Reset token:', token);

    if (!token) {
      return NextResponse.json({ message: 'Could not generate reset token.' }, { status: 500 });
    }

    const transporter = await getTransporter();
    if (!transporter) {
      return NextResponse.json({ message: 'Email service not available.' }, { status: 500 });
    }
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const resetUrl = `${baseUrl}/change-password?token=${token}`;
console.log('[API] Reset URL:', resetUrl);


    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Support" <noreply@example.com>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the link below to choose a new one:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('[API] Email sent to:', email);

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('[API] request-password-reset error:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
