# OneDettyDecember API Documentation

## 🚀 **Overview**

This documentation covers all API endpoints for the OneDettyDecember payment and authentication system. The API is built with Next.js 14 App Router and uses Supabase for database operations.

**Base URL**: `https://your-domain.com/api`  
**Authentication**: Bearer token (JWT from Supabase Auth)  
**Content-Type**: `application/json`

---

## 🔐 **Authentication Endpoints**

### User Registration
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "TRAVELER" // or "VENDOR"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "emailConfirmed": false
  },
  "message": "Please check your email to verify your account"
}
```

### User Login
```http
POST /auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "TRAVELER"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

---

## 💳 **Payment Endpoints**

### Create Payment Intent
```http
POST /api/payments/create-intent
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bookingId": "booking_uuid",
  "amount": 100.00,
  "currency": "USD",
  "provider": "stripe", // optional, auto-selected if not provided
  "userLocation": "US" // optional, for provider optimization
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "payment_uuid",
  "provider": "stripe",
  "amount": 100.00,
  "currency": "USD",
  "clientSecret": "pi_xxx_secret_xxx", // for Stripe
  "redirectUrl": "https://checkout.paystack.com/xxx", // for Paystack
  "feeCalculation": {
    "processingFee": 3.20,
    "platformFee": 2.50,
    "totalFees": 5.70,
    "netAmount": 94.30
  }
}
```

### Verify Payment
```http
POST /api/payments/verify
```

**Request Body:**
```json
{
  "paymentId": "payment_uuid", // or
  "reference": "paystack_reference"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment_uuid",
    "status": "COMPLETED",
    "amount": 100.00,
    "currency": "USD",
    "provider": "STRIPE",
    "verified": true,
    "booking": {
      "id": "booking_uuid",
      "status": "CONFIRMED"
    }
  },
  "verification": {
    "verified": true,
    "status": "succeeded",
    "amount": 100.00,
    "currency": "USD"
  }
}
```

### Process Refund
```http
POST /api/payments/refund
```

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "paymentId": "payment_uuid",
  "amount": 50.00, // optional, defaults to full refund
  "reason": "Customer requested refund"
}
```

**Response:**
```json
{
  "success": true,
  "refundId": "refund_uuid",
  "amount": 50.00,
  "status": "PARTIALLY_REFUNDED"
}
```

### Payment Analytics
```http
GET /api/payments/analytics
```

**Query Parameters:**
- `userId` (string): Filter by user ID
- `vendorId` (string): Filter by vendor ID
- `startDate` (ISO string): Start date filter
- `endDate` (ISO string): End date filter
- `admin` (boolean): Admin access for all data

**Response:**
```json
{
  "success": true,
  "analytics": {
    "overview": {
      "totalPayments": 1250,
      "totalRevenue": 125000.00,
      "averageTransactionValue": 100.00,
      "successRate": 95.2
    },
    "byStatus": {
      "COMPLETED": { "count": 1190, "amount": 119000.00 },
      "PENDING": { "count": 45, "amount": 4500.00 },
      "FAILED": { "count": 15, "amount": 1500.00 }
    },
    "byProvider": {
      "STRIPE": { "count": 800, "amount": 80000.00 },
      "PAYSTACK": { "count": 450, "amount": 45000.00 }
    },
    "timeline": [
      { "date": "2024-01-01", "count": 25, "amount": 2500.00 }
    ],
    "topPackages": [
      {
        "packageId": "pkg_uuid",
        "title": "Lagos New Year Party",
        "count": 150,
        "revenue": 15000.00
      }
    ]
  },
  "totalRecords": 1250
}
```

---

## 📦 **Booking Endpoints**

### Create Booking
```http
POST /api/bookings
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "userId": "user_uuid",
  "packageId": "package_uuid",
  "quantity": 2,
  "bookingDate": "2024-12-25T20:00:00Z"
}
```

**Response:**
```json
{
  "booking": {
    "id": "booking_uuid",
    "userId": "user_uuid",
    "packageId": "package_uuid",
    "quantity": 2,
    "totalPrice": 200.00,
    "currency": "USD",
    "status": "PENDING",
    "bookingDate": "2024-12-25T20:00:00Z"
  },
  "package": {
    "id": "package_uuid",
    "title": "Amazing Event",
    "price": 100.00,
    "currency": "USD"
  },
  "totalPrice": 200.00,
  "currency": "USD"
}
```

### Get User Bookings
```http
GET /api/bookings?userId=<user_uuid>
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "booking_uuid",
      "quantity": 2,
      "totalPrice": 200.00,
      "status": "CONFIRMED",
      "package": {
        "id": "package_uuid",
        "title": "Amazing Event",
        "type": "EVENT",
        "location": "Lagos, Nigeria",
        "images": ["url1", "url2"],
        "startDate": "2024-12-25T20:00:00Z",
        "endDate": "2024-12-26T04:00:00Z"
      },
      "payment": {
        "id": "payment_uuid",
        "status": "COMPLETED",
        "provider": "STRIPE",
        "amount": 200.00,
        "currency": "USD"
      }
    }
  ]
}
```

---

## 🏢 **Package Endpoints**

### List Packages
```http
GET /api/packages
```

**Query Parameters:**
- `type` (string): Filter by package type (EVENT, STAY, EXPERIENCE, RENTAL)
- `city` (string): Filter by city
- `status` (string): Filter by status (default: PUBLISHED)

**Response:**
```json
{
  "packages": [
    {
      "id": "package_uuid",
      "type": "EVENT",
      "title": "Detty December Party",
      "description": "Amazing party experience",
      "price": 100.00,
      "currency": "USD",
      "location": "Victoria Island, Lagos",
      "city": "Lagos",
      "images": ["url1", "url2"],
      "capacity": 500,
      "availableSlots": 450,
      "startDate": "2024-12-25T20:00:00Z",
      "endDate": "2024-12-26T04:00:00Z",
      "status": "PUBLISHED"
    }
  ]
}
```

### Create Package
```http
POST /api/packages
```

**Headers:**
```
Authorization: Bearer <vendor_jwt_token>
```

**Request Body:**
```json
{
  "vendorId": "vendor_uuid",
  "type": "EVENT",
  "title": "New Year Bash",
  "description": "Epic New Year celebration",
  "price": 150.00,
  "currency": "USD",
  "location": "Lekki, Lagos",
  "city": "Lagos",
  "images": ["url1", "url2"],
  "capacity": 300,
  "startDate": "2024-12-31T22:00:00Z",
  "endDate": "2025-01-01T06:00:00Z"
}
```

---

## 🚨 **Error Responses**

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

---

## 🔒 **Security Features**

### Rate Limiting
- **Default**: 100 requests per minute per IP
- **Headers**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Authentication
- **JWT Tokens**: Supabase-issued JWT tokens
- **Refresh Tokens**: Automatic token refresh
- **Session Management**: Secure session handling

### Input Validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Input sanitization
- **CSRF Protection**: Token-based protection

---

## 📊 **Webhook Endpoints**

### Stripe Webhook
```http
POST /api/payments/webhook/stripe
```

**Headers:**
```
Stripe-Signature: <stripe_signature>
```

### Paystack Webhook
```http
POST /api/payments/webhook/paystack
```

**Headers:**
```
X-Paystack-Signature: <paystack_signature>
```

---

## 🧪 **Testing**

### Test Cards (Stripe)
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **3D Secure**: `4000000000003220`

### Test Cards (Paystack)
- **Success**: `4084084084084081`
- **Insufficient Funds**: `4000000000000119`

---

## 📞 **Support**

For API support and questions:
- **Email**: dev@onedettydecember.com
- **Documentation**: [API Docs](https://docs.onedettydecember.com)
- **Status Page**: [Status](https://status.onedettydecember.com)
