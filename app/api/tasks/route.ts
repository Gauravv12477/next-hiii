import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { date, z } from "zod";

// Define the Priority enum values
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

const createTaskSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  dueDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),
  priority: PriorityEnum,
});

export async function POST(req: Request) {
  try {
    // Parse the request body to validate task data
    const data = await req.json();
    const { title, description, dueDate, priority } =
      createTaskSchema.parse(data);

    // Extract userId from the request headers
    const userId = req.headers.get("x-user-id");

    // If userId is missing, return 401 Unauthorized
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Missing user ID" },
        { status: 401 }
      );
    }

    // Create a new task in the database
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        userId,
      },
    });

    console.log("hi there iam inside");

    // Return the created task with a 201 Created status
    return NextResponse.json(newTask, { status: 201 });
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

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");

    // If userId is missing, return 401 Unauthorized
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Missing user ID" },
        { status: 401 }
      );
    }

    // get All the tasks created by user above;

    const allTasks = await prisma.task.findMany({
      where:{
        userId: userId
      }
    });

    return NextResponse.json(
      {
        data: allTasks,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
