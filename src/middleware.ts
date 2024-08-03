// pages/admin/_middleware.js
export { default } from "next-auth/middleware";

/** Define here what route should be protected by authentication */
export const config = {
  matcher: [
    "/admin/:path*", // Protect all routes under /admin
  ],
};
