
import { getIronSession } from "iron-session";

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, 
  cookieName: "eclipse-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
};

export async function getSession(req, res) {
  return await getIronSession(req, res, sessionOptions);
}
