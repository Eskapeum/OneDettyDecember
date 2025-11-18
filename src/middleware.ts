import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  )

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com https://va.vercel-scripts.com https://app.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://api.paystack.co https://app.posthog.com https://*.supabase.co https://*.sentry.io",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.paystack.com",
    ].join('; ')
  )

  // Cache control for static assets
  const { pathname } = request.nextUrl

  // CDN Optimization: Aggressive caching with stale-while-revalidate
  if (pathname.startsWith('/_next/static/')) {
    // Static assets - cache for 1 year (immutable)
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/_next/image')) {
    // Next.js optimized images - cache for 1 month with revalidation
    response.headers.set(
      'Cache-Control',
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400'
    )
  } else if (pathname.startsWith('/api/packages')) {
    // Package API - cache for 5 minutes with CDN caching
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    )
  } else if (pathname.startsWith('/api/search')) {
    // Search API - cache for 2 minutes
    response.headers.set(
      'Cache-Control',
      'public, max-age=120, s-maxage=120, stale-while-revalidate=30'
    )
  } else if (pathname.startsWith('/api/')) {
    // Other API routes - no cache by default
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
  } else if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|avif)$/)) {
    // Images - cache for 1 week with CDN extension
    response.headers.set(
      'Cache-Control',
      'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400, immutable'
    )
  } else if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/)) {
    // Fonts - cache for 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.match(/\.(css|js)$/)) {
    // CSS/JS - cache for 1 day with revalidation
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=3600'
    )
  } else if (pathname === '/' || pathname.startsWith('/packages')) {
    // Homepage and package pages - cache for 5 minutes
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    )
  }

  // Add CDN-specific headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Vercel-Cache', 'MISS') // Will be overridden by CDN

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      'https://onedettydecember.com',
      'https://www.onedettydecember.com',
    ].filter(Boolean)

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
      )
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
