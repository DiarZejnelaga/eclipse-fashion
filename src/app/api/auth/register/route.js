// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
// Adjust this import path carefully based on where users.js is relative to this file
// If users.js is in src/lib/users.js:
import { createUser, findUserByEmail } from '@/app/lib/users';

export async function POST(request) { // No type annotation for 'request'
  console.log('[App Router POST /api/auth/register] Hit!');
  try {
    const body = await request.json();
    console.log('[App Router POST /api/auth/register] Body:', body);
    const { email, password, name } = body;

    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      console.log('[App Router POST /api/auth/register] Validation fail: Invalid email format.');
      return NextResponse.json({ message: 'Valid email is required.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      console.log('[App Router POST /api/auth/register] Validation fail: Password too short.');
      return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    console.log('[App Router POST /api/auth/register] Checking for existing user with email:', email);
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.log('[App Router POST /api/auth/register] User already exists:', email);
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    console.log('[App Router POST /api/auth/register] Attempting to create new user for email:', email);
    const newUser = await createUser({ email, password, name }); // Ensure createUser is adapted if needed

    console.log('[App Router POST /api/auth/register] User creation successful for:', newUser.email);
    return NextResponse.json({ message: 'Registration successful! Please log in.', userId: newUser.id }, { status: 201 });

  } catch (error) { // No 'any' type for error in JS, but you can check error.message etc.
    console.error('[App Router POST /api/auth/register] --- CAUGHT ERROR ---');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);

    // Handle specific known errors thrown from createUser or other steps
    if (error.message === 'User already exists') { // This specific message from createUser
      return NextResponse.json({ message: 'An account with this email already exists (caught from createUser).' }, { status: 409 }); // Or 400 if preferred for this specific check
    }
    if (error.message.includes('Password is required') || error.message.includes('A valid email is required')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    // For other unexpected errors
    return NextResponse.json({ message: 'An internal server error occurred. Please try again later.' }, { status: 500 });
  }
}