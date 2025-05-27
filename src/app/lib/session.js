
import { getIronSession } from 'iron-session'; 

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error('SECRET_COOKIE_PASSWORD environment variable is not set.');
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'eclipse-app-session', 
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
  },
};
export async function getAppRouterSession() { 
    const { cookies } = await import('next/headers');
    return await getIronSession(cookies(), sessionOptions);
}