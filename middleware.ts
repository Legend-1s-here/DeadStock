export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/listings/new',
    '/listings/:id/edit',
  ],
};
