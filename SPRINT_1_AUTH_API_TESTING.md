# Sprint 1: Authentication API Testing Guide
**Developer:** Nesiah (Backend Lead)
**Date:** November 18, 2025
**Sprint:** 1 of 13
**Status:** ✅ Implementation Complete

---

## 🎯 Overview

This guide covers testing for the complete authentication system built in Sprint 1.

**Endpoints Implemented:**
1. POST `/api/auth/register` - User registration
2. POST `/api/auth/login` - User login
3. POST `/api/auth/logout` - User logout
4. GET `/api/auth/verify` - Email verification
5. GET `/api/auth/session` - Get current session
6. POST `/api/auth/refresh` - Refresh access token

---

## Prerequisites

1. **Environment Variables (.env.local):**
   ```bash
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
   ```

2. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

---

## 1. User Registration

### POST `/api/auth/register`

**Test Case 1: Successful Registration**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+2348012345678"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+2348012345678",
    "role": "TRAVELER",
    "status": "ACTIVE",
    "emailVerified": false,
    "createdAt": "2025-11-18T..."
  }
}
```

**Test Case 2: Duplicate Email**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response (409):**
```json
{
  "error": {
    "code": "CONFLICT",
    "message": "An account with this email already exists"
  }
}
```

**Test Case 3: Weak Password**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "weak",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "password": [
        "Password must be at least 8 characters",
        "Password must contain at least one uppercase letter",
        "Password must contain at least one number"
      ]
    }
  }
}
```

---

## 2. User Login

### POST `/api/auth/login`

**Test Case 1: Successful Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TRAVELER",
    "status": "ACTIVE",
    "emailVerified": true,
    "profile": {
      "bio": null,
      "avatar": null,
      "city": "Lagos",
      "country": "Nigeria"
    },
    "vendor": null
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "v1.MRjXdN4...",
    "expiresIn": 3600,
    "expiresAt": 1700000000
  }
}
```

**Test Case 2: Invalid Credentials**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

**Test Case 3: Suspended Account**

```bash
# First, manually suspend the user in the database
# Then attempt login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "suspended@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (403):**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Your account has been suspended"
  }
}
```

---

## 3. Session Management

### GET `/api/auth/session`

**Test Case: Get Current Session**

```bash
curl http://localhost:3000/api/auth/session \
  -H "Cookie: sb-access-token=eyJhbG...; sb-refresh-token=v1.MRj..."
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "clx...",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TRAVELER",
    "emailVerified": true,
    "profile": { /* profile data */ }
  },
  "session": {
    "accessToken": "eyJhbG...",
    "refreshToken": "v1.MRj...",
    "expiresIn": 3600,
    "expiresAt": 1700000000
  }
}
```

**Test Case: No Session**

```bash
curl http://localhost:3000/api/auth/session
```

**Expected Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "No active session"
  }
}
```

---

## 4. Token Refresh

### POST `/api/auth/refresh`

**Test Case: Refresh Token**

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "v1.MRjXdN4..."
  }'
```

**Expected Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "session": {
    "accessToken": "eyJhbG...",
    "refreshToken": "v1.MRj...",
    "expiresIn": 3600,
    "expiresAt": 1700000000
  }
}
```

**Test Case: Expired/Invalid Token**

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid_token"
  }'
```

**Expected Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired refresh token"
  }
}
```

---

## 5. Email Verification

### GET `/api/auth/verify?token=...`

**Test Case: Verify Email**

```bash
# Token is sent to user's email by Supabase
curl "http://localhost:3000/api/auth/verify?token=hashed_token_here"
```

**Expected Response (200):**
```json
{
  "message": "Email verified successfully! You can now log in.",
  "userId": "clx..."
}
```

**Test Case: Invalid Token**

```bash
curl "http://localhost:3000/api/auth/verify?token=invalid_token"
```

**Expected Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid or expired verification token"
  }
}
```

---

## 6. Logout

### POST `/api/auth/logout`

**Test Case: Logout**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sb-access-token=eyJhbG...; sb-refresh-token=v1.MRj..."
```

**Expected Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Integration Test Flow

**Complete Authentication Flow:**

```bash
# 1. Register
REGISTER_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User"
  }')

echo "Registration: $REGISTER_RESPONSE"

# 2. Verify Email (manual step - check email for token)
# curl "http://localhost:3000/api/auth/verify?token=TOKEN_FROM_EMAIL"

# 3. Login
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.session.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.session.refreshToken')

echo "Login: $LOGIN_RESPONSE"

# 4. Get Session
SESSION_RESPONSE=$(curl http://localhost:3000/api/auth/session \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN; sb-refresh-token=$REFRESH_TOKEN")

echo "Session: $SESSION_RESPONSE"

# 5. Refresh Token
REFRESH_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

echo "Refresh: $REFRESH_RESPONSE"

# 6. Logout
LOGOUT_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: sb-access-token=$ACCESS_TOKEN; sb-refresh-token=$REFRESH_TOKEN")

echo "Logout: $LOGOUT_RESPONSE"
```

---

## Password Requirements

**Valid Password Must Have:**
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ Maximum 72 characters

**Example Valid Passwords:**
- `SecurePass123`
- `MyPassword2024!`
- `Test123Password`

**Example Invalid Passwords:**
- `weak` - Too short, no uppercase, no numbers
- `alllowercase123` - No uppercase
- `ALLUPPERCASE123` - No lowercase
- `NoNumbers` - No numbers

---

## Testing with Postman

**Import Collection:**

1. Create new collection: "OneDettyDecember Auth"
2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `access_token`: (will be set automatically)
   - `refresh_token`: (will be set automatically)

**Requests:**

1. **Register**
   - POST `{{base_url}}/api/auth/register`
   - Body: JSON with user details

2. **Login**
   - POST `{{base_url}}/api/auth/login`
   - Tests: Save tokens to environment variables

3. **Get Session**
   - GET `{{base_url}}/api/auth/session`
   - Auth: Cookies (automatic)

4. **Refresh Token**
   - POST `{{base_url}}/api/auth/refresh`
   - Body: `{"refreshToken": "{{refresh_token}}"}`

5. **Logout**
   - POST `{{base_url}}/api/auth/logout`
   - Auth: Cookies (automatic)

---

## Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution:** Ensure `.env.local` has all required Supabase variables

### Issue 2: Email verification not working
**Solution:** Check Supabase email templates and SMTP configuration

### Issue 3: Cookies not persisting
**Solution:** Ensure you're testing with a browser or tool that supports cookies

### Issue 4: CORS errors
**Solution:** Add allowed origins in Next.js config

---

## Next Steps (Sprint 1 Continuation)

- [ ] Add rate limiting (5 attempts/min per IP)
- [ ] Implement password reset flow
- [ ] Add OAuth (Google + Facebook)
- [ ] Write automated tests (Lolu)
- [ ] Add email templates (Resend)
- [ ] Security audit
- [ ] Load testing

---

**Status:** ✅ **ALL AUTH ENDPOINTS FUNCTIONAL**
**Testing:** Ready for QA
**Integration:** Ready for Neriah's UI
**Next:** Rate limiting + OAuth
