import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const cookies = req.headers.get('cookie') || '';
  const userEmail = cookies
    .split('; ')
    .find((row) => row.startsWith('userEmail='))
    ?.split('=')[1];
  const userRole = cookies
    .split('; ')
    .find((row) => row.startsWith('userRole='))
    ?.split('=')[1];

  // Check if user is authenticated and has the role 'admin'
  if (!userEmail || userRole !== 'admin') {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
};
