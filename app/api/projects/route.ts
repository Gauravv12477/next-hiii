import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"), // Adjusted error message
  description: z.string().optional(),
  color: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const data = await req.json();
    const parsedData = createProjectSchema.parse(data);

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized: Missing User ID",
        },
        { status: 401 }
      );
    }

    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        userId: userId,
        name: parsedData.name,
        description: parsedData.description || null,
        color: parsedData.color || null,
      },
    });

    return new Response(
      JSON.stringify({ message: "Project Created Successfully", project }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
