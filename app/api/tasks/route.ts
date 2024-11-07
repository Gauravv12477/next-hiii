import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from 'zod';

// Define the Priority enum values
const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

const createTaskSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    dueDate: z.date(),
    priority: PriorityEnum,
    userId: z.string(), // assuming userId is a string; adjust if different
});

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { title, description, dueDate, priority, userId } = createTaskSchema.parse(data);

        // Create task in database
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                dueDate,
                priority,
                userId,
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: error.errors }, { status: 400 });
        }
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}

