// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
// Adjust path if your lib folder is elsewhere relative to src/app/api/auth/forgot-password/
import { findUserByEmail, setUserResetToken } from '@/app/lib/users';
import { sendPasswordResetEmail } from '@/app/lib/nodemailer';// <<< IMPORT THIS

export async function POST(request) {
  console.log('[App Router POST /api/auth/forgot-password] Hit!');
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      console.log('[FORGOT-PASSWORD API] Invalid email format provided.');
      return NextResponse.json({ message: 'Valid email is required.' }, { status: 400 });
    }

    console.log('[FORGOT-PASSWORD API] Attempting to find user by email:', email);
    const user = await findUserByEmail(email);

    if (user) {
      console.log('[FORGOT-PASSWORD API] User found:', user.email); // Log found user's email for confirmation
      const token = await setUserResetToken(user.email); // Use user.email for consistency

      if (token) {
        // Construct the reset link (ensure NEXT_PUBLIC_BASE_URL is set in your .env.local)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        // This link should point to your frontend page responsible for handling the reset
        const resetLink = `${baseUrl}/reset-password?token=${token}`;

        console.log(`[FORGOT-PASSWORD API] Generated reset link for ${user.email}: ${resetLink}`);
        // The token itself is also passed to sendPasswordResetEmail for potential logging within that function
        // console.log(`[FORGOT-PASSWORD API] Token (for testing manually): ${token}`); // You can uncomment this if needed for direct testing

        // --- SEND THE EMAIL ---
        try {
          // Pass the user's actual email, the generated link, and the token itself
          await sendPasswordResetEmail(user.email, resetLink, token);
          console.log(`[FORGOT-PASSWORD API] Password reset email initiation process completed for ${user.email}.`);
        } catch (emailError) {
          console.error("[FORGOT-PASSWORD API] FAILED TO SEND EMAIL (but continuing with generic response):", emailError.message);
          // Do not reveal email sending failure to the client for security.
          // The error is already logged by nodemailer.js and here.
          // The generic success message will still be sent below.
        }
        // --- END SEND THE EMAIL ---
      } else {
        console.warn('[FORGOT-PASSWORD API] Failed to set reset token for user (setUserResetToken returned null):', email);
        // This might happen if there's an issue within setUserResetToken not throwing an error but failing.
      }
    } else {
      console.log('[FORGOT-PASSWORD API] User not found with email:', email);
      // Still proceed to generic message to prevent email enumeration
    }

    // IMPORTANT: Always return a generic success message to prevent email enumeration attacks.
    // Do not tell the user whether the email was found or if the email was actually sent.
    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 } // Use 200 OK for this generic response
    );

  } catch (error) { // Catch errors from request.json(), findUserByEmail, setUserResetToken etc.
    console.error('[App Router POST /api/auth/forgot-password] --- CAUGHT ERROR ---');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack); // Good for debugging
    // Return a generic error message for other issues too.
    return NextResponse.json({ message: 'An error occurred while processing your request. Please try again.' }, { status: 500 });
  }
}