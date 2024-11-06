import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose"; // Importing SignJWT from jose

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User is not registered!" },
        { status: 404 }
      );
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(JWT_SECRET); // Encode the JWT secret

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" }) // Set protected headers
      .setIssuedAt() // Optional: Set the issued time
      .setExpirationTime("6h") // Set expiration time
      .sign(secretKey); // Sign the token with your secret
      


    const res = NextResponse.json(
      { message: "Login successful", user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastnma: user.lastname
      }, token },
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
      sameSite: 'lax',
      path: "/", // The cookies will be sent to all requests to the base path
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
