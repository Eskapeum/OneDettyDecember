/**
 * Authentication Helper Functions
 * Sprint 1 - Real Supabase Auth Integration
 */

import { NextRequest } from 'next/server'
import { getSession, getUser } from './supabase'
import { prisma } from './prisma'
import { UnauthorizedError, ForbiddenError } from './api-errors'

export interface AuthUser {
  id: string
  email: string
  role: 'TRAVELER' | 'VENDOR' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  emailVerified: boolean
}

/**
 * Get current authenticated user from Supabase session
 */
export async function getCurrentUser(): Promise<AuthUser> {
  // Get session from Supabase
  const session = await getSession()

  if (!session) {
    throw new UnauthorizedError('Authentication required')
  }

  // Get user from Supabase
  const authUser = await getUser()

  if (!authUser) {
    throw new UnauthorizedError('User not found')
  }

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
    },
  })

  if (!user) {
    throw new UnauthorizedError('User account not found')
  }

  // Check if account is active
  if (user.status === 'SUSPENDED') {
    throw new ForbiddenError('Your account has been suspended')
  }

  if (user.status === 'DELETED') {
    throw new ForbiddenError('Your account has been deleted')
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
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
    throw new ForbiddenError('Insufficient permissions')
  }
}

/**
 * Require email verification
 */
export function requireEmailVerified(user: AuthUser): void {
  if (!user.emailVerified) {
    throw new ForbiddenError('Email verification required')
  }
}

/**
 * Check if user is a vendor
 */
export async function requireVendor(userId: string): Promise<void> {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: { status: true },
  })

  if (!vendor) {
    throw new ForbiddenError('Vendor account required')
  }

  if (vendor.status !== 'APPROVED') {
    throw new ForbiddenError('Vendor account not approved')
  }
}
