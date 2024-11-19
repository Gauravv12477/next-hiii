import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Importing jwtVerify

const protectedPaths = ["/app", "/profile", "/settings", "/tasks"];
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie ? tokenCookie.value : null;

  // Only protect specified paths (like /app, /profile, etc.)
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify JWT token
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET); // Using jwtVerify for JWT

      console.log(payload); 
    } catch (error) {
      console.log("JWT verification failed: ", error);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Extract userId from the token after verifying it
  let userId: string | null = null;

  if (token) {
    // Ensure token is not null before calling jwtVerify
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET); // Verify the JWT
      if (payload && typeof payload === "object" && "id" in payload) {
        userId = payload.id as string; // Extract userId from the JWT payload
      }
    } catch (error) {
      console.log("JWT decryption failed: ", error);
    }
  }

  // Create a new response and set the x-user-id header if userId exists
  const response = NextResponse.next();

  if (userId) {
    console.log('userId',userId)
    // const userId = req.headers.get("x-user-id");
    response.headers.set("x-user-id", userId); // Set the userId in the response headers
  }

  return response;
}

// Configuration to match protected paths
export const config = {
  matcher: [
    "/app/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/tasks/:path*",
    "/tasks/:id*",
    "/api/:path*",
  ], // Match paths and nested paths
};
