// app/api/tasks/[taskId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("x-user-id");
  const taskId = params.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Missing user ID" },
      { status: 401 }
    );
  }

  try {
    await prisma.task.delete({
      where: { id: taskId, userId: userId },
    });

    return NextResponse.json(
      { message: `Task ${taskId} deleted successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to delete task",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    console.log("Request:", req);
  
    try {
      // Parse JSON data from the request body
      const data = await req.json();
      const { title, description, dueDate, priority, completed } = data;
  
      // Extract the userId from request headers
      const userId = req.headers.get("x-user-id");
  
      // Await the `params` object and extract the `id`
      const { id: taskId } = await context.params;
  
      // Check if userId exists
      if (!userId) {
        return NextResponse.json(
          { message: "Unauthorized: Missing user ID" },
          { status: 401 }
        );
      }
  
      // Build update data dynamically based on provided fields
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
      if (priority !== undefined) updateData.priority = priority;
      if (completed !== undefined) updateData.completed = completed;
  
      // Validate that at least one field is provided to update
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { message: "No valid fields provided for update" },
          { status: 400 }
        );
      }
  
      // Update task in the database
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
      });
  
      // Return success response with updated task data
      return NextResponse.json(
        { message: "Task updated successfully", updatedTask },
        { status: 200 }
      );
    } catch (error: any) {
      // Handle known errors, e.g., task not found
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
      }
      // For any other errors, return a generic 500 response
      return NextResponse.json(
        { message: "Failed to update task", error: error.message },
        { status: 500 }
      );
    }
  }