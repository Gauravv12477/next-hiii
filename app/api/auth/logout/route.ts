import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.json({ message: "Logged out successfully" }, {status: 200});
  
  // Delete the 'token' cookie by setting it with an empty value and immediate expiration
  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set to expire immediately
    path: "/", // Ensure this path matches where the cookie was initially set
  });
  
  return res;
}
