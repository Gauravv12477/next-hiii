import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

// Define the registration schema using Zod
const registrationSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  const { firstname, lastname, email, password } = await req.json();

  // Validate using Zod
  try {
    registrationSchema.parse({ firstname, lastname, email, password });
  } catch (error: any) {
    // Check if the error is a ZodError
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation errors",
          errors: error.errors, // Return detailed error messages
        },
        { status: 400 }
      ); // Return validation errors
    }
    // Handle any other types of errors
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },  
      { status: 500 }
    );
  }

  // Check if the user already exists
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: 'Internal Server Error',
    }, { status: 500 });
  }
}
