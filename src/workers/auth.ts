import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload, UserRole } from '../types.js';

function getSecret(): Uint8Array {
  return new TextEncoder().encode((globalThis as any)?.JWT_SECRET ?? 'change-me-32chars-minimum-for-hs256!!');
}

export async function createToken(userId: string, email: string, role: UserRole): Promise<string> {
  return new SignJWT({ email, role } as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .setSubject(userId)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { sub: payload.sub as string, email: (payload as any)['email'] as string, role: (payload as any)['role'] as UserRole, iat: payload.iat ?? 0, exp: payload.exp ?? 0 };
  } catch { return null; }
}

export async function getCurrentUser(authHeader: string | undefined): Promise<JWTPayload> {
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized');
  const payload = await verifyToken(authHeader.slice(7).trim());
  if (!payload) throw new Error('Invalid or expired token');
  return payload;
}
