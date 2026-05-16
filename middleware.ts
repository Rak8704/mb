// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// JWT validation function (no database required)
function validateJWT(token: string) {
  if (!token) return null;
  
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.id) {
      return null;
    }
    
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      }
    };
    
  } catch (error) {
    console.error("JWT validation error:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths (no authentication required)
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/admin/login',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/admin/login',
    '/api/admin/register',
    '/api/public',
    '/en/',
    '/slots'
  ];
  
  // Check if current path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  try {
    // Try to get token from cookies first
    const cookieStore = await cookies();
    let token = cookieStore.get('auth_token')?.value;
    
    // If not in cookies, try Authorization header (for API calls)
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    // Check if request is to admin routes
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
      // For admin routes, allow pass-through to the endpoint
      // Each endpoint will handle its own verification
      return NextResponse.next();
    }
    
    if (!token) {
      // Store the intended URL to redirect back after login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate the JWT
    const session = validateJWT(token);
    
    if (!session) {
      // Invalid or expired session, clear cookie and redirect to login
      cookieStore.delete('auth_token');
      
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      loginUrl.searchParams.set('expired', 'true');
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Session is valid, allow access
    // Add user info to headers if needed
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-email', session.user.email);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (error) {
    console.error("Middleware error:", error);
    
    // On error, allow pass-through for now
    // Specific endpoints will handle auth validation
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Protected routes (your original list plus additional)
    "/account",
    "/account/:path*",
    "/wallet",
    "/wallet/:path*", 
    "/bets",
    "/bets/:path*",
    "/en/wallet",
    "/en/wallet/:path*",
    "/en/account",
    "/en/account/:path*",
    "/en/bets",
    "/en/bets/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/settings",
    "/settings/:path*",
    "/api/user/:path*",
    "/api/balance/:path*",
    "/api/private/:path*"
  ],
};
