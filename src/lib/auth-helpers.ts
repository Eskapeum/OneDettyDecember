/**
 * Authentication Helper Functions
 * Sprint 0 - Day 1
 * NOTE: This is a stub implementation. Full auth will be completed by Neziah.
 */

import { NextRequest } from 'next/server'
import { UnauthorizedError } from './api-errors'

export interface AuthUser {
  id: string
  email: string
  role: 'TRAVELER' | 'VENDOR' | 'ADMIN'
}

/**
 * Get current authenticated user from request
 * TODO: Replace with Supabase Auth after Neziah completes auth flow
 */
export async function getCurrentUser(request: NextRequest): Promise<AuthUser> {
  // Stub implementation - check for test user ID in headers
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    throw new UnauthorizedError('Authentication required')
  }

  // TODO: Replace with actual Supabase session validation
  return {
    id: userId,
    email: 'test@example.com', // Placeholder
    role: 'TRAVELER',
  }
}

/**
 * Check if user has required role
 */
export function requireRole(
  user: AuthUser,
  allowedRoles: AuthUser['role'][]
): void {
  if (!allowedRoles.includes(user.role)) {
    throw new UnauthorizedError('Insufficient permissions')
  }
}
