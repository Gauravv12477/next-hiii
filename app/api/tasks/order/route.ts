import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { taskIds } = await req.json();

    // Check if taskIds is provided and is an array
    if (!Array.isArray(taskIds)) {
      return NextResponse.json(
        { message: "Invalid or missing 'taskIds' field. It should be an array." },
        { status: 400 }
      );
    }

    // Extract the userId from request headers
    const userId = req.headers.get("x-user-id");

    // Check if userId exists
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Missing user ID" },
        { status: 401 }
      );
    }

    // Update the task order in the database for the given user
    const updatedOrder = await prisma.orderTaskListing.update({
      where: { userId: userId },
      data: { taskId: taskIds },
    });

    // Return success response with updated order data
    return NextResponse.json(
      { message: "Task order updated successfully", updatedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle specific error for record not found
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Order record not found" }, { status: 404 });
    }
    // For any other errors, return a generic 500 response
    return NextResponse.json(
      { message: "Failed to update task order", error: error.message },
      { status: 500 }
    );
  }
}
