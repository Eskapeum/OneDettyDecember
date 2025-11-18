# OneDettyDecember - Development Roadmap & User Stories

**Version:** 1.0  
**Last Updated:** November 8, 2025  
**Document Owner:** Engineering Team

---

## Table of Contents

1. [Overview](#overview)
2. [Development Phases](#development-phases)
3. [Story Point Estimation Guide](#story-point-estimation)
4. [Epic 1: User Registration & Authentication](#epic-1)
5. [Epic 2: Package Discovery & Search](#epic-2)
6. [Epic 3: Package Details & Booking](#epic-3)
7. [Epic 4: Payment Integration](#epic-4)
8. [Epic 5: User Profile & Account Management](#epic-5)
9. [Epic 6: Reviews & Ratings](#epic-6)
10. [Epic 7: Admin Dashboard](#epic-7)
11. [Epic 8: Vendor Management](#epic-8)
12. [Epic 9: Email Notifications](#epic-9)
13. [Epic 10: Analytics & Reporting](#epic-10)
14. [Technical Debt & Infrastructure](#technical-debt)
15. [Sprint Planning](#sprint-planning)

---

## Overview {#overview}

This document outlines the complete development roadmap for OneDettyDecember, a tour booking platform focused on Nigerian cultural experiences. The platform connects travelers with curated tour packages, experiences, and vendors.

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Shadcn/ui components
- React Query for data fetching
- Zustand for state management

**Backend:**
- Next.js API Routes
- Supabase (PostgreSQL + Auth + Storage)
- Prisma ORM
- Node.js

**Payment:**
- Stripe (International)
- Paystack (Nigerian market)

**Email:**
- SendGrid / Resend

**Infrastructure:**
- Vercel (Hosting)
- Cloudflare (CDN)
- GitHub Actions (CI/CD)

---

## Development Phases {#development-phases}

### Phase 1: MVP (Months 1-3)
**Goal:** Launch with core booking functionality
- User authentication
- Package browsing and search
- Booking flow
- Payment integration (Stripe)
- Basic admin dashboard

### Phase 2: Enhancement (Months 4-6)
**Goal:** Improve user experience and add key features
- User profiles and preferences
- Reviews and ratings
- Wishlist functionality
- Advanced search and filters
- Email notifications
- Paystack integration

### Phase 3: Scale (Months 7-12)
**Goal:** Scale platform and add advanced features
- Vendor portal
- Advanced analytics
- Mobile app (React Native)
- Loyalty program
- Multi-language support
- Advanced admin tools

---

## Story Point Estimation Guide {#story-point-estimation}

- **1 point:** <2 hours (simple bug fix, minor UI change)
- **2 points:** 2-4 hours (small feature, simple component)
- **3 points:** 4-8 hours (medium component, simple API endpoint)
- **5 points:** 1-2 days (complex component, API with business logic)
- **8 points:** 2-3 days (complex feature, multiple components)
- **13 points:** 3-5 days (large feature, multiple endpoints, complex logic)
- **21 points:** 1-2 weeks (epic-level feature, should be broken down)

---

## EPIC 1: User Registration & Authentication {#epic-1}

**Priority:** P0 (Critical)  
**Total Estimate:** 48 points  
**Target Sprint:** Sprint 1-2

### Story 1.1: User Registration

**As a** potential traveler  
**I want to** create an account on the platform  
**So that** I can save my preferences, view bookings, and access personalized recommendations

**Acceptance Criteria:**
- [ ] User can register with email and password
- [ ] User can register with Google OAuth
- [ ] User can register with Facebook OAuth
- [ ] Email verification required before full access
- [ ] Password must meet security requirements (8+ chars, 1 uppercase, 1 number, 1 special char)
- [ ] User profile is automatically created upon registration
- [ ] Welcome email sent upon successful registration
- [ ] Form validation shows clear error messages
- [ ] Duplicate email addresses are rejected
- [ ] Registration process is mobile-responsive

---

#### Ticket DDT-101: Setup Database Schema for Users

**Priority:** P0  
**Estimate:** 5 points  
**Assignee:** Backend Dev  
**Sprint:** 1

**Description:**
Create the core user database schema and relationships.

**Technical Tasks:**
- [ ] Create users table with Prisma schema
- [ ] Create user_profiles table (one-to-one with users)
- [ ] Create email_verifications table
- [ ] Create password_reset_tokens table
- [ ] Add database indexes for performance
- [ ] Run migrations
- [ ] Seed test data

**Database Schema:**

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  password          String?   // Null for OAuth users
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  profile           UserProfile?
  bookings          Booking[]
  reviews           Review[]
  wishlist          Wishlist[]
  
  @@index([email])
}

model UserProfile {
  id              String    @id @default(cuid())
  userId          String    @unique
  firstName       String?
  lastName        String?
  phone           String?
  dateOfBirth     DateTime?
  profileImage    String?
  nationality     String?
  passportNumber  String?
  bio             String?
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model EmailVerification {
  id          String    @id @default(cuid())
  email       String
  token       String    @unique
  expires     DateTime
  createdAt   DateTime  @default(now())
  
  @@index([email, token])
}

model PasswordResetToken {
  id          String    @id @default(cuid())
  email       String
  token       String    @unique
  expires     DateTime
  createdAt   DateTime  @default(now())
  
  @@index([email, token])
}
```

**Acceptance Criteria:**
- [ ] All tables created successfully
- [ ] Relationships properly configured
- [ ] Indexes added for frequently queried fields
- [ ] Database migrations run without errors
- [ ] Can create, read, update, delete users via Prisma

**Dependencies:** None

---

#### Ticket DDT-102: Implement User Registration API

**Priority:** P0  
**Estimate:** 8 points  
**Assignee:** Backend Dev  
**Sprint:** 1

**Description:**
Create API endpoint for email/password registration with validation and email verification.

**Technical Tasks:**
- [ ] Create POST /api/auth/register endpoint
- [ ] Implement password hashing with bcrypt (10 rounds)
- [ ] Add email validation (regex + DNS check)
- [ ] Add password strength validation
- [ ] Generate email verification token (UUID v4)
- [ ] Store verification token in database (24hr expiry)
- [ ] Send verification email via SendGrid
- [ ] Add rate limiting (5 attempts per IP per hour)
- [ ] Implement CSRF protection
- [ ] Write comprehensive unit tests (80%+ coverage)
- [ ] Write API documentation (OpenAPI/Swagger)
- [ ] Add logging for security events

**API Endpoint:**

```typescript
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "agreeToTerms": true
}

Success Response (201 Created):
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "userId": "clx1234567890"
}

Error Response (400 Bad Request):
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid email address",
  "fields": {
    "email": "Please provide a valid email address"
  }
}

Error Response (409 Conflict):
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "An account with this email already exists"
}

Error Response (429 Too Many Requests):
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many registration attempts. Please try again later."
}
```

**Validation Rules:**
- Email: Valid format, max 255 chars
- Password: Min 8 chars, max 128 chars, must contain uppercase, lowercase, number, special char
- First Name: Required, 2-50 chars
- Last Name: Required, 2-50 chars
- agreeToTerms: Must be true

**Security Considerations:**
- Hash passwords before storing (never store plaintext)
- Rate limit registration attempts to prevent abuse
- Use HTTPS only
- Implement CSRF tokens
- Log failed registration attempts
- Check for disposable email addresses

**Testing:**
- [ ] Test valid registration
- [ ] Test duplicate email rejection
- [ ] Test invalid email formats
- [ ] Test weak passwords rejection
- [ ] Test SQL injection attempts
- [ ] Test rate limiting
- [ ] Test email sending

**Acceptance Criteria:**
- [ ] Users can successfully register with valid data
- [ ] Duplicate emails are rejected with appropriate error
- [ ] Passwords are hashed before storage
- [ ] Verification email sent successfully
- [ ] Rate limiting prevents spam registrations
- [ ] All tests passing

**Dependencies:** DDT-101

---

#### Ticket DDT-103: Implement OAuth 2.0 (Google & Facebook)

**Priority:** P0  
**Estimate:** 8 points  
**Assignee:** Backend Dev  
**Sprint:** 1

**Description:**
Implement OAuth authentication flow for Google and Facebook sign-in.

**Technical Tasks:**
- [ ] Set up Google OAuth 2.0 credentials (Google Cloud Console)
- [ ] Set up Facebook OAuth credentials (Facebook Developers)
- [ ] Install and configure NextAuth.js
- [ ] Create OAuth callback handlers
- [ ] Implement token exchange and validation
- [ ] Create or link user accounts from OAuth data
- [ ] Handle OAuth errors gracefully
- [ ] Store OAuth tokens securely
- [ ] Implement OAuth token refresh
- [ ] Add OAuth buttons to frontend
- [ ] Test OAuth flow end-to-end
- [ ] Write documentation

**OAuth Providers Configuration:**

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create or update user in database
      const existingUser = await db.user.findUnique({
        where: { email: user.email }
      });
      
      if (!existingUser) {
        await db.user.create({
          data: {
            email: user.email,
            emailVerified: new Date(), // OAuth users are auto-verified
            profile: {
              create: {
                firstName: profile.given_name,
                lastName: profile.family_name,
                profileImage: user.image,
              }
            }
          }
        });
      }
      
      return true;
    },
  },
};
```

**Environment Variables:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

**Testing:**
- [ ] Test Google OAuth flow
- [ ] Test Facebook OAuth flow
- [ ] Test account creation for new OAuth users
- [ ] Test account linking for existing email
- [ ] Test OAuth error handling
- [ ] Test token refresh

**Acceptance Criteria:**
- [ ] Users can sign in with Google
- [ ] Users can sign in with Facebook
- [ ] New users are created automatically
- [ ] Existing users are logged in correctly
- [ ] OAuth errors show user-friendly messages
- [ ] Profile data populated from OAuth providers

**Dependencies:** DDT-101

---

#### Ticket DDT-104: Email Verification System

**Priority:** P0  
**Estimate:** 5 points  
**Assignee:** Backend Dev  
**Sprint:** 1

**Description:**
Implement email verification flow with token generation and validation.

**Technical Tasks:**
- [ ] Create verification token generator (crypto.randomUUID)
- [ ] Implement GET /api/auth/verify-email endpoint
- [ ] Create POST /api/auth/resend-verification endpoint
- [ ] Design verification email template (HTML)
- [ ] Add token expiration check (24 hours)
- [ ] Update user emailVerified status
- [ ] Delete token after successful verification
- [ ] Handle expired tokens
- [ ] Add frontend success/error pages
- [ ] Write unit tests

**API Endpoints:**

```typescript
GET /api/auth/verify-email?token=abc123

Success Response (200 OK):
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}

Error Response (400 Bad Request):
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Invalid or expired verification token"
}

---

POST /api/auth/resend-verification
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Success Response (200 OK):
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}

Error Response (404 Not Found):
{
  "success": false,
  "error": "USER_NOT_FOUND",
  "message": "No account found with this email"
}

Error Response (400 Bad Request):
{
  "success": false,
  "error": "ALREADY_VERIFIED",
  "message": "This email is already verified"
}
```

**Email Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
    <img src="{{LOGO_URL}}" alt="OneDettyDecember" style="max-width: 200px;">
  </div>
  
  <div style="padding: 40px 20px;">
    <h1 style="color: #333;">Verify Your Email Address</h1>
    
    <p>Hi {{FIRST_NAME}},</p>
    
    <p>Thanks for signing up for OneDettyDecember! To complete your registration, please verify your email address by clicking the button below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{VERIFICATION_URL}}" style="background-color: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="color: #666; word-break: break-all;">{{VERIFICATION_URL}}</p>
    
    <p><strong>This link will expire in 24 hours.</strong></p>
    
    <p>If you didn't create an account, you can safely ignore this email.</p>
    
    <p>Best regards,<br>The OneDettyDecember Team</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>&copy; 2025 OneDettyDecember. All rights reserved.</p>
    <p>Follow us on @onedettydecember</p>
    <p>Lagos, Nigeria</p>
  </div>
</body>
</html>
```

**Testing:**
- [ ] Test verification with valid token
- [ ] Test verification with expired token
- [ ] Test verification with invalid token
- [ ] Test resend verification email
- [ ] Test multiple verification attempts
- [ ] Test email already verified scenario

**Acceptance Criteria:**
- [ ] Verification emails sent successfully
- [ ] Valid tokens verify email and update user status
- [ ] Expired tokens show appropriate error
- [ ] Users can resend verification email
- [ ] Verified users cannot reverify
- [ ] Frontend shows success/error states

**Dependencies:** DDT-102

---

### Story 1.2: User Login & Session Management

**As a** registered user  
**I want to** log in securely to my account  
**So that** I can access my bookings and personal information

**Acceptance Criteria:**
- [ ] User can log in with email and password
- [ ] User can log in with Google
- [ ] User can log in with Facebook
- [ ] Session persists across browser refreshes
- [ ] User can log out
- [ ] Failed login attempts are tracked and limited
- [ ] "Remember me" option available
- [ ] Login redirects to intended page after authentication
- [ ] Users cannot log in without email verification
- [ ] Mobile-responsive login form

---

#### Ticket DDT-105: Implement Login API

**Priority:** P0  
**Estimate:** 5 points  
**Assignee:** Backend Dev  
**Sprint:** 2

**Description:**
Create secure login endpoint with password verification and JWT token generation.

**Technical Tasks:**
- [ ] Create POST /api/auth/login endpoint
- [ ] Verify password hash using bcrypt.compare()
- [ ] Check email verification status
- [ ] Generate JWT access token (15 min expiry)
- [ ] Generate JWT refresh token (7 day expiry)
- [ ] Store refresh token in httpOnly cookie
- [ ] Implement rate limiting (10 attempts per IP per hour)
- [ ] Log failed login attempts
- [ ] Implement account lockout after 5 failed attempts
- [ ] Write unit tests
- [ ] Add security logging

**API Endpoint:**

```typescript
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}

Success Response (200 OK):
{
  "success": true,
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImage": "https://..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}

Set-Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

Error Response (401 Unauthorized):
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}

Error Response (403 Forbidden):
{
  "success": false,
  "error": "EMAIL_NOT_VERIFIED",
  "message": "Please verify your email before logging in",
  "canResend": true
}

Error Response (423 Locked):
{
  "success": false,
  "error": "ACCOUNT_LOCKED",
  "message": "Account locked due to multiple failed login attempts. Please try again in 30 minutes."
}

Error Response (429 Too Many Requests):
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many login attempts. Please try again later."
}
```

**JWT Token Payload:**

```typescript
// Access Token (15 min)
{
  "userId": "clx1234567890",
  "email": "user@example.com",
  "role": "user",
  "iat": 1699564800,
  "exp": 1699565700
}

// Refresh Token (7 days)
{
  "userId": "clx1234567890",
  "tokenId": "refresh_abc123",
  "iat": 1699564800,
  "exp": 1700169600
}
```

**Security Features:**
- Password verification with timing-safe comparison
- Rate limiting per IP address
- Account lockout after failed attempts
- Secure JWT token generation
- HttpOnly cookies for refresh tokens
- CSRF protection
- Audit logging

**Testing:**
- [ ] Test successful login
- [ ] Test invalid email
- [ ] Test invalid password
- [ ] Test unverified email
- [ ] Test rate limiting
- [ ] Test account lockout
- [ ] Test "remember me" functionality

**Acceptance Criteria:**
- [ ] Users can log in with valid credentials
- [ ] Invalid credentials rejected
- [ ] Unverified emails cannot log in
- [ ] Rate limiting prevents brute force
- [ ] JWT tokens generated correctly
- [ ] Refresh token stored in httpOnly cookie
- [ ] Failed attempts logged

**Dependencies:** DDT-102, DDT-104

---

#### Ticket DDT-106: Implement Token Refresh Mechanism

**Priority:** P0  
**Estimate:** 3 points  
**Assignee:** Backend Dev  
**Sprint:** 2

**Description:**
Create token refresh endpoint to issue new access tokens without requiring login.

**Technical Tasks:**
- [ ] Create POST /api/auth/refresh endpoint
- [ ] Validate refresh token from cookie
- [ ] Check token expiry
- [ ] Verify token signature
- [ ] Check token blacklist
- [ ] Issue new access token
- [ ] Rotate refresh token (optional)
- [ ] Add middleware to auto-refresh on 401
- [ ] Write unit tests

**API Endpoint:**

```typescript
POST /api/auth/refresh
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200 OK):
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}

Error Response (401 Unauthorized):
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Invalid or expired refresh token. Please log in again."
}
```

**Frontend Middleware:**

```typescript
// lib/axios-interceptor.ts
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await axios.post('/api/auth/refresh');
        
        // Update access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Testing:**
- [ ] Test token refresh with valid token
- [ ] Test token refresh with expired token
- [ ] Test token refresh with invalid token
- [ ] Test automatic token refresh on 401
- [ ] Test refresh token rotation

**Acceptance Criteria:**
- [ ] Valid refresh tokens issue new access tokens
- [ ] Expired refresh tokens return 401
- [ ] Invalid tokens rejected
- [ ] Frontend automatically refreshes tokens
- [ ] Users stay logged in seamlessly

**Dependencies:** DDT-105

---

#### Ticket DDT-107: Implement Logout Functionality

**Priority:** P1  
**Estimate:** 2 points  
**Assignee:** Backend Dev  
**Sprint:** 2

**Description:**
Create logout endpoint to invalidate user session and tokens.

**Technical Tasks:**
- [ ] Create POST /api/auth/logout endpoint
- [ ] Add refresh token to blacklist
- [ ] Clear httpOnly cookie
- [ ] Clear access token from client
- [ ] Add logout button to frontend
- [ ] Clear user state in frontend
- [ ] Redirect to home page
- [ ] Write unit tests

**API Endpoint:**

```typescript
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}

Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

**Token Blacklist:**

```prisma
model TokenBlacklist {
  id          String    @id @default(cuid())
  token       String    @unique
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  
  @@index([token])
  @@index([expiresAt])
}
```

**Frontend Implementation:**

```typescript
// hooks/useLogout.ts
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useLogout() {
  const router = useRouter();
  const { setUser } = useAuth();
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear user state
      setUser(null);
      localStorage.removeItem('accessToken');
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return { logout };
}
```

**Testing:**
- [ ] Test logout clears tokens
- [ ] Test logout clears cookies
- [ ] Test logout redirects user
- [ ] Test logout clears frontend state
- [ ] Test token blacklist prevents reuse

**Acceptance Criteria:**
- [ ] Users can successfully log out
- [ ] Tokens invalidated on logout
- [ ] Cookies cleared
- [ ] User redirected to home page
- [ ] Cannot use invalidated tokens

**Dependencies:** DDT-105

---

#### Ticket DDT-108: Build Login/Register UI

**Priority:** P0  
**Estimate:** 13 points  
**Assignee:** Frontend Dev  
**Sprint:** 2

**Description:**
Create responsive login and registration forms with OAuth integration.

**Technical Tasks:**
- [ ] Create LoginPage component
- [ ] Create RegisterPage component
- [ ] Build login form with validation
- [ ] Build registration form with validation
- [ ] Add OAuth buttons (Google, Facebook)
- [ ] Implement form state management (React Hook Form)
- [ ] Add client-side validation (Zod)
- [ ] Show loading states
- [ ] Handle error messages
- [ ] Add "Remember me" checkbox
- [ ] Add "Forgot password" link
- [ ] Implement password visibility toggle
- [ ] Add password strength indicator
- [ ] Mobile-responsive design
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Write component tests

**Component Structure:**

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <LoginForm />
        
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-orange-600 hover:text-orange-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    // Call login API
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox id="remember" {...register('rememberMe')} />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
            Remember me
          </label>
        </div>
        
        <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
          Forgot password?
        </Link>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => signIn('google')}>
          <GoogleIcon className="w-5 h-5 mr-2" />
          Google
        </Button>
        <Button variant="outline" onClick={() => signIn('facebook')}>
          <FacebookIcon className="w-5 h-5 mr-2" />
          Facebook
        </Button>
      </div>
    </form>
  );
}
```

**Design Specifications:**
- **Colors:** Orange primary (#FF6B35), Gray secondary
- **Spacing:** Consistent 1.5rem between form elements
- **Buttons:** Full width, 48px height, rounded corners
- **Inputs:** Border on default, orange border on focus
- **Error messages:** Red text below inputs
- **Loading state:** Disable form, show spinner on button

**Accessibility:**
- [ ] All inputs have labels
- [ ] Error messages announced by screen readers
- [ ] Keyboard navigation works correctly
- [ ] Focus states visible
- [ ] ARIA labels for icon buttons

**Testing:**
- [ ] Test form validation
- [ ] Test successful submission
- [ ] Test error handling
- [ ] Test OAuth buttons
- [ ] Test mobile responsiveness
- [ ] Test accessibility with screen reader

**Acceptance Criteria:**
- [ ] Forms render correctly on all devices
- [ ] Validation works as expected
- [ ] OAuth buttons trigger sign-in flow
- [ ] Error messages displayed clearly
- [ ] Loading states shown during submission
- [ ] Meets WCAG 2.1 AA standards

**Dependencies:** DDT-102, DDT-103, DDT-105

---

### Story 1.3: Password Reset

**As a** user who forgot their password  
**I want to** reset my password securely  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] User can request password reset via email
- [ ] Reset email sent with secure token
- [ ] Token expires after 1 hour
- [ ] User can set new password
- [ ] Old password invalidated
- [ ] Confirmation email sent after reset
- [ ] Cannot reuse old password
- [ ] Rate limiting on reset requests

---

#### Ticket DDT-109: Implement Forgot Password Flow

**Priority:** P1  
**Estimate:** 8 points  
**Assignee:** Backend Dev  
**Sprint:** 2

**Description:**
Create password reset request and confirmation flow.

**Technical Tasks:**
- [ ] Create POST /api/auth/forgot-password endpoint
- [ ] Generate secure reset token
- [ ] Store token with 1hr expiry
- [ ] Send password reset email
- [ ] Create POST /api/auth/reset-password endpoint
- [ ] Validate reset token
- [ ] Update password hash
- [ ] Invalidate reset token
- [ ] Send confirmation email
- [ ] Add rate limiting (3 requests per email per hour)
- [ ] Write unit tests

**API Endpoints:**

```typescript
POST /api/auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Success Response (200 OK):
{
  "success": true,
  "message": "If an account exists with this email, you will receive a password reset link."
}

---

POST /api/auth/reset-password
Content-Type: application/json

Request Body:
{
  "token": "abc123...",
  "password": "NewSecurePass123!"
}

Success Response (200 OK):
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}

Error Response (400 Bad Request):
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Invalid or expired reset token"
}
```

**Reset Email Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
    <img src="{{LOGO_URL}}" alt="OneDettyDecember" style="max-width: 200px;">
  </div>
  
  <div style="padding: 40px 20px;">
    <h1 style="color: #333;">Reset Your Password</h1>
    
    <p>Hi {{FIRST_NAME}},</p>
    
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{RESET_URL}}" style="background-color: #FF6B35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="color: #666; word-break: break-all;">{{RESET_URL}}</p>
    
    <p><strong>This link will expire in 1 hour.</strong></p>
    
    <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
    
    <p>Best regards,<br>The OneDettyDecember Team</p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>&copy; 2025 OneDettyDecember. All rights reserved.</p>
    <p>Follow us on @onedettydecember</p>
  </div>
</body>
</html>
```

**Testing:**
- [ ] Test password reset request
- [ ] Test reset with valid token
- [ ] Test reset with expired token
- [ ] Test reset with invalid token
- [ ] Test rate limiting
- [ ] Test password validation
- [ ] Test confirmation email

**Acceptance Criteria:**
- [ ] Users can request password reset
- [ ] Reset email sent successfully
- [ ] Valid tokens allow password reset
- [ ] Expired/invalid tokens rejected
- [ ] Rate limiting prevents abuse
- [ ] Confirmation email sent
- [ ] Old password no longer works

**Dependencies:** DDT-102

---

## EPIC 2: Package Discovery & Search {#epic-2}

**Priority:** P0 (Critical)  
**Total Estimate:** 56 points  
**Target Sprint:** Sprint 3-4

### Story 2.1: Browse Packages

**As a** potential traveler  
**I want to** browse available tour packages  
**So that** I can find experiences that interest me

**Acceptance Criteria:**
- [ ] Display all available packages on home/browse page
- [ ] Show package card with image, title, price, duration, rating
- [ ] Packages load quickly (<2 seconds)
- [ ] Mobile-responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- [ ] Smooth scrolling and lazy loading images
- [ ] Filter by price range, duration, category
- [ ] Sort by price, popularity, newest
- [ ] Show "New" or "Popular" badges
- [ ] Display sold out packages with overlay
- [ ] Click card to view details

---

#### Ticket DDT-201: Create Package Database Schema

**Priority:** P0  
**Estimate:** 5 points  
**Assignee:** Backend Dev  
**Sprint:** 3

**Description:**
Design and implement comprehensive database schema for tour packages.

**Technical Tasks:**
- [ ] Design packages table
- [ ] Design package_images table (multiple images per package)
- [ ] Design package_inclusions table
- [ ] Design package_exclusions table
- [ ] Design package_itinerary table (day-by-day schedule)
- [ ] Design package_categories table
- [ ] Design package_tags table
- [ ] Add database migrations
- [ ] Create indexes for performance
- [ ] Seed database with sample packages

**Database Schema:**

```prisma
model Package {
  id                String    @id @default(cuid())
  title             String
  slug              String    @unique
  shortDescription  String    @db.Text
  description       String    @db.Text
  price             Decimal   @db.Decimal(10, 2)
  currency          String    @default("USD")
  duration          Int       // Days
  maxCapacity       Int
  minCapacity       Int       @default(1)
  categoryId        String
  status            PackageStatus @default(ACTIVE)
  featured          Boolean   @default(false)
  averageRating     Decimal?  @db.Decimal(3, 2)
  totalReviews      Int       @default(0)
  totalBookings     Int       @default(0)
  viewCount         Int       @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  category          Category  @relation(fields: [categoryId], references: [id])
  images            PackageImage[]
  inclusions        PackageInclusion[]
  exclusions        PackageExclusion[]
  itinerary         PackageItinerary[]
  tags              PackageTag[]
  bookings          Booking[]
  reviews           Review[]
  wishlistItems     Wishlist[]
  
  @@index([slug])
  @@index([categoryId])
  @@index([status])
  @@index([featured])
  @@index([price])
  @@fulltext([title, shortDescription, description])
}

enum PackageStatus {
  DRAFT
  ACTIVE
  INACTIVE
  SOLD_OUT
  ARCHIVED
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  icon        String?
  order       Int       @default(0)
  
  packages    Package[]
  
  @@index([slug])
}

model PackageImage {
  id          String    @id @default(cuid())
  packageId   String
  url         String
  alt         String?
  isPrimary   Boolean   @default(false)
  order       Int       @default(0)
  
  package     Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  @@index([packageId])
}

model PackageInclusion {
  id          String    @id @default(cuid())
  packageId   String
  title       String
  description String?
  icon        String?
  
  package     Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)
}

model PackageExclusion {
  id          String    @id @default(cuid())
  packageId   String
  title       String
  description String?
  
  package     Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)
}

model PackageItinerary {
  id          String    @id @default(cuid())
  packageId   String
  day         Int
  title       String
  description String    @db.Text
  activities  String[]
  meals       String[]  // breakfast, lunch, dinner
  
  package     Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  @@unique([packageId, day])
}

model PackageTag {
  id          String    @id @default(cuid())
  packageId   String
  name        String
  
  package     Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)
  
  @@index([packageId])
  @@index([name])
}
```

**Sample Data:**

```typescript
// seeds/packages.ts
const samplePackages = [
  {
    title: "Ultimate Detty December Experience",
    slug: "ultimate-detty-december-experience",
    shortDescription: "7 days of non-stop parties, concerts, and cultural experiences",
    price: 6500,
    duration: 7,
    maxCapacity: 20,
    category: "Detty December",
    featured: true,
  },
  {
    title: "Lagos Cultural Immersion",
    slug: "lagos-cultural-immersion",
    shortDescription: "Explore Lagos' rich history, art, and vibrant culture",
    price: 2800,
    duration: 5,
    maxCapacity: 15,
    category: "Cultural Tours",
  },
  // ... more packages
];
```

**Testing:**
- [ ] Test database migrations
- [ ] Test relationships between tables
- [ ] Test indexes improve query performance
- [ ] Test full-text search functionality
- [ ] Test data seeding

**Acceptance Criteria:**
- [ ] All tables created successfully
- [ ] Relationships properly configured
- [ ] Indexes created for performance
- [ ] Sample data seeded
- [ ] Can perform CRUD operations

**Dependencies:** None

---

#### Ticket DDT-202: Implement Package Listing API

**Priority:** P0  
**Estimate:** 8 points  
**Assignee:** Backend Dev  
**Sprint:** 3

**Description:**
Create API endpoint for fetching paginated list of packages with filtering and sorting.

**Technical Tasks:**
- [ ] Implement GET /api/packages endpoint
- [ ] Add pagination (20 packages per page)
- [ ] Add sorting (price_asc, price_desc, popularity, newest, rating)
- [ ] Add filtering (category, price range, duration, status)
- [ ] Include primary image and basic package info
- [ ] Optimize query performance (<100ms)
- [ ] Add response caching with Redis (5 min TTL)
- [ ] Implement cache invalidation on package updates
- [ ] Write comprehensive unit tests
- [ ] Write API documentation

**API Endpoint:**

```typescript
GET /api/packages?page=1&limit=20&category=detty-december&minPrice=0&maxPrice=10000&sortBy=popularity&status=active

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- category: string (category slug)
- minPrice: number
- maxPrice: number
- minDuration: number
- maxDuration: number
- sortBy: "price_asc" | "price_desc" | "popularity" | "newest" | "rating"
- status: "active" | "sold_out" (default: active)
- featured: boolean

Success Response (200 OK):
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "clx1234567890",
        "title": "Ultimate Detty December Experience",
        "slug": "ultimate-detty-december-experience",
        "shortDescription": "7 days of non-stop parties...",
        "price": 6500,
        "currency": "USD",
        "duration": 7,
        "category": {
          "id": "cat123",
          "name": "Detty December",
          "slug": "detty-december"
        },
        "primaryImage": {
          "url": "https://...",
          "alt": "Detty December party"
        },
        "averageRating": 4.8,
        "totalReviews": 127,
        "totalBookings": 342,
        "status": "active",
        "featured": true,
        "tags": ["party", "nightlife", "concerts"]
      },
      // ... more packages
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 94,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "categories": [
        { "id": "cat1", "name": "Detty December", "count": 25 },
        { "id": "cat2", "name": "Cultural Tours", "count": 18 },
        // ...
      ],
      "priceRange": {
        "min": 800,
        "max": 10000
      },
      "durationRange": {
        "min": 1,
        "max": 14
      }
    }
  }
}
```

**Implementation:**

```typescript
// app/api/packages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const category = searchParams.get('category');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const minDuration = parseInt(searchParams.get('minDuration') || '0');
  const maxDuration = parseInt(searchParams.get('maxDuration') || '999');
  const sortBy = searchParams.get('sortBy') || 'popularity';
  const featured = searchParams.get('featured') === 'true';
  
  // Generate cache key
  const cacheKey = `packages:${page}:${limit}:${category}:${minPrice}:${maxPrice}:${sortBy}`;
  
  // Check cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(JSON.parse(cached));
  }
  
  // Build query
  const where = {
    status: 'ACTIVE',
    price: {
      gte: minPrice,
      lte: maxPrice,
    },
    duration: {
      gte: minDuration,
      lte: maxDuration,
    },
    ...(category && {
      category: {
        slug: category,
      },
    }),
    ...(featured && { featured: true }),
  };
  
  // Determine sort order
  let orderBy;
  switch (sortBy) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'rating':
      orderBy = { averageRating: 'desc' };
      break;
    default: // popularity
      orderBy = { totalBookings: 'desc' };
  }
  
  // Execute queries in parallel
  const [packages, totalItems, categories] = await Promise.all([
    db.package.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
          select: {
            url: true,
            alt: true,
          },
          take: 1,
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    }),
    db.package.count({ where }),
    db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            packages: {
              where: { status: 'ACTIVE' },
            },
          },
        },
      },
    }),
  ]);
  
  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit);
  
  // Format response
  const response = {
    success: true,
    data: {
      packages: packages.map(pkg => ({
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        shortDescription: pkg.shortDescription,
        price: pkg.price,
        currency: pkg.currency,
        duration: pkg.duration,
        category: pkg.category,
        primaryImage: pkg.images[0] || null,
        averageRating: pkg.averageRating,
        totalReviews: pkg.totalReviews,
        totalBookings: pkg.totalBookings,
        status: pkg.status,
        featured: pkg.featured,
        tags: pkg.tags.map(t => t.name),
      })),
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: cat._count.packages,
        })),
      },
    },
  };
  
  // Cache response for 5 minutes
  await cache.set(cacheKey, JSON.stringify(response), 300);
  
  return NextResponse.json(response);
}
```

**Performance Optimizations:**
- Use database indexes for filtering and sorting
- Implement Redis caching with TTL
- Use `select` to only fetch needed fields
- Execute parallel queries with Promise.all()
- Add pagination to limit data transfer
- Use CDN for package images

**Testing:**
- [ ] Test pagination
- [ ] Test filtering by category
- [ ] Test filtering by price range
- [ ] Test filtering by duration
- [ ] Test all sort options
- [ ] Test cache hits and misses
- [ ] Test performance with large datasets
- [ ] Load test with 1000+ concurrent requests

**Acceptance Criteria:**
- [ ] Endpoint returns paginated packages
- [ ] Filtering works correctly
- [ ] Sorting works correctly
- [ ] Response time <100ms (cached)
- [ ] Response time <500ms (uncached)
- [ ] Cache invalidates on updates
- [ ] All tests passing

**Dependencies:** DDT-201

---

Due to length constraints, I'll continue this comprehensive markdown file. Would you like me to continue with more stories and tickets, or would you prefer I now move on to creating the **Investor Pitch Deck Outline** and **Technical Architecture Diagrams**?

The file has been created and contains the first sections. Let me know how you'd like to proceed!