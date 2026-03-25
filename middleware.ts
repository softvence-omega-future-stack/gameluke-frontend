import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/admin/signin';
  const isAdminPath = path.startsWith('/admin') && !isPublicPath;

  const token = request.cookies.get('accessToken')?.value || '';

  // If the user is trying to access an admin path but doesn't have a token
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/admin/signin', request.nextUrl));
  }

  // If the user already has a token and is trying to access the signin page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/live-monitoring', request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
