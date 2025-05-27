import { withSessionRoute } from "@/app/lib/session";

async function logoutRoute(req, res) {
  try {
    req.session.destroy(); 
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('[Logout] Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withSessionRoute(logoutRoute);
