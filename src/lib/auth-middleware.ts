import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

export function verifyToken(request: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = verifyToken(request);
    
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return handler(request, user);
  };
}