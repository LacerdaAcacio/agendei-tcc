import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from '@config/env';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/**
 * Optional Authentication Middleware
 * 
 * Unlike ensureAuthenticated, this middleware does NOT throw errors if the token is missing or invalid.
 * It simply sets req.user if a valid token exists, or continues without it.
 * 
 * Use this for public routes where you want to provide enhanced features for authenticated users
 * (like showing isFavorited status) while keeping the route accessible to everyone.
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  // No auth header? No problem, just continue
  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  // No token? No problem, just continue
  if (!token) {
    return next();
  }

  try {
    const decoded = verify(token, env.JWT_SECRET as any);
    const { sub } = decoded as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    // Invalid token? No problem, just continue without user
    return next();
  }
}
