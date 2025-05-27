import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/app/lib/session';

export async function GET(request) {
  console.log('[App Router GET /api/auth/me] Hit!');
  try {
    const session = await getIronSession(request, sessionOptions);

    if (!session.user) {
      return NextResponse.json(
        { user: null, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('[App Router GET /api/auth/me] ERROR:', error.message, error.stack);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
