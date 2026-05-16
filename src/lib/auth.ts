// lib/auth.ts
// Re-export all MySQL auth functions

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Client-side functions
export { 
  useAuth,
  getCurrentUserClient,
  signOut,
  login,
  register,
  authClient
} from './auth-client';

// Server-side functions
export { 
  validateToken,
  getMySQLConnection,
  auth
} from './auth-server';

// Types
export type { User } from './auth-client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Get current user from Bearer token or session
export async function getCurrentUser(request: NextRequest) {
  try {
    // Try Bearer token first
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return { id: decoded.id, email: decoded.email };
      } catch (e) {
        // Token invalid, fall through
      }
    }

    // Try session cookie
    const { auth } = await import('./auth-server');
    const session = await auth.api.getSession();
    if (session?.user) {
      return session.user;
    }

    return null;
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

