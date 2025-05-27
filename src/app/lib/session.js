// src/lib/session.js
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, // Ensure this is in .env.local
  cookieName: "eclipse-app-session", // Or your preferred cookie name
  // secure: true should be used in production (HTTPS) but can be false for localhost development
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Helps prevent CSRF, 'strict' is also an option
    httpOnly: true, // Recommended for security
    maxAge: undefined, // Session cookie (expires when browser closes), or set a duration in seconds
  },
};

// Helper to wrap API routes with session
export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Helper to wrap SSR pages with session (if needed for pre-rendering user data)
export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}

