import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle"; // your drizzle db connection
import { tasks } from "@/lib/db/schema/tasks";

// GET all tasks
export async function GET() {
  try {
    const allTasks = await db.select().from(tasks);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST a new task
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.insert(tasks).values(body);
    return NextResponse.json(
      { message: "Task added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}
