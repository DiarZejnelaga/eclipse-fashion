
import { withIronSessionApiRoute } from 'next-iron-session';
import { sessionOptions } from '@/app/lib/session'; 

async function logoutRoute(req, res) {
  try {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('[Logout] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
  }
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);