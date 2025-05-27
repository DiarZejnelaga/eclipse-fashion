// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '@/app/lib/users';

export async function POST(request) {
  console.log('[App Router POST /api/auth/login] Hit!');

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      console.warn('[LOGIN DEBUG] No user found for email:', email);
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // ✅ Debug logs
    console.log('[LOGIN DEBUG] Found user:', {
      email: user.email,
      passwordHash: user.passwordHash,
    });
    console.log('[LOGIN DEBUG] Password entered:', password);

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    console.log('[LOGIN DEBUG] Password valid?', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // --- IRON-SESSION (App Router) - ACTUAL IMPLEMENTATION NEEDED HERE ---
    console.warn('IRON-SESSION TODO: Actual session saving logic for App Router needed in /api/auth/login/route.js');
    // --- END IRON-SESSION ---

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: 'Login successful! (Session not yet implemented)',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[App Router POST /api/auth/login] ERROR:', error.message, error.stack);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
