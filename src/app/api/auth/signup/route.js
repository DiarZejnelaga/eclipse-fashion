// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { createUser } from '@/app/lib/users'; // Make sure path is correct
import { sendWelcomeEmail } from '@/app/lib/nodemailer';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // NO existing user check here, createUser just creates a new user every time
    const createdUser = await createUser({
      email,
      password,
      name: name || email.split('@')[0],
    });

   // Send welcome email (async, no await)
sendWelcomeEmail(createdUser.email, createdUser.name)
  .then((emailRes) => {
    if (emailRes.success) {
      console.log(`[Signup] Welcome email sent to ${createdUser.email}`);
    } else {
      console.error(`[Signup] Failed to send welcome email to ${createdUser.email}`);
    }
  })
  .catch((error) => {
    console.error(`[Signup] Error sending welcome email:`, error);
  });


    return NextResponse.json(
      { user: createdUser, message: 'Signup successful! A welcome email has been sent.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Signup] Error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred during signup.' },
      { status: 500 }
    );
  }
}
