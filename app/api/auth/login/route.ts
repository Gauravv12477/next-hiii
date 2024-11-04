import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import the jwt library

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // validation using zod
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User is not registred !!",
        },
        { status: 404 }
      );
    }

    //check the email and password

    if (user) {
      await bcrypt.compare(password, user.email);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "6h" }
      );

      return NextResponse.json(
        { message: "Login successful", user, token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.error,
      },
      { status: 500 }
    );
  }
}
