import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'swastik_group_lucknow_secret_key_2026';

export interface AdminPayload {
  email: string;
}

export function generateToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch (err) {
    return null;
  }
}

// Extends express Request type inline or provides helper
export interface AuthenticatedRequest extends Request {
  admin?: AdminPayload;
}

export function protectAdminRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(411).json({ error: 'Authorization header is required (Bearer token).' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Auth session expired or token is invalid. Please login again.' });
    }

    // Verify admin exists
    const adminExists = db.admins.getByEmail(decoded.email);
    if (!adminExists) {
      return res.status(403).json({ error: 'Administrator profile does not exist or has been removed.' });
    }

    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Internal system authorization validation failure.' });
  }
}
