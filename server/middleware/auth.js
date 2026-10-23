import { auth, isInitialized } from '../config/firebaseAdmin.js';

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or malformed Authorization header with Bearer token'
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // Support demo/development preview token
  if (token.startsWith('demo-user-') || token === 'guest-demo-token' || !isInitialized) {
    req.user = {
      uid: token.startsWith('demo-user-') ? token : 'demo-user-101',
      email: 'user@ayurveda.local',
      name: 'Ayurveda Explorer'
    };
    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Verification Failed:', error.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token'
    });
  }
}
