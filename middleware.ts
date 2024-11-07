import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Importing jwtVerify from jose

const protectedPaths = ["/dashboard", "/profile", "/settings"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_jwt_secret");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specified paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Get the token from cookies
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie ? tokenCookie.value : null; // Extract the value from the cookie

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT token
    try {
      await jwtVerify(token, JWT_SECRET); // Using async verification
    } catch (error) {
      console.log("JWT verification failed: ", error);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access if the path is not protected
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"], // Adjusted to match nested paths
};
