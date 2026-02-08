import { NextResponse,NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken_user')?.value;
  const path = request.nextUrl.pathname;

  if (!token && path.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

//   if (token && (path === '/my_account')) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};