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


    // const check there is any record 
    const orderRecord = await prisma.orderTaskListing.findFirst({
      where: { userId: userId },
    });

    if (!orderRecord) {
      await prisma.orderTaskListing.create({
        data: {
          userId: userId,
          taskId: [newTask.id],  // Initialize with the new task ID
        },
      });
    } else {
      // Append the new task ID to the existing taskId array
      await prisma.orderTaskListing.update({
        where: { id: orderRecord.id },
        data: {
          taskId: {
            push: newTask.id,  // Use `push` to append the new task ID
          },
        },
      });
    }


    // Return the created task with a 201 Created status
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json(
      { message: "Something went wrong! wewe" },
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

    // Get the user's task order listing
    const orderRecord = await prisma.orderTaskListing.findFirst({
      where: { userId: userId },
      select: { taskId: true }, // Only select taskId for ordering
    });

    if (!orderRecord || !orderRecord.taskId) {
      return NextResponse.json(
        { message: "No tasks found for this user." },
        { status: 404 }
      );
    }

    // Fetch tasks based on the IDs in orderRecord.taskId
    const allTasks = await prisma.task.findMany({
      where: {
        userId: userId,
        completed: false,
        id: { in: orderRecord.taskId },
      },
    });

    // Sort tasks based on the order in taskId
    const orderedTasks = orderRecord.taskId.map((id) =>
      allTasks.find((task) => task.id === id)
    ).filter(Boolean);

    return NextResponse.json(
      {
        data: orderedTasks,
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




