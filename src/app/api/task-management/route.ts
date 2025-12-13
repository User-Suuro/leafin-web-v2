import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle"; // your drizzle db connection
import { tasks } from "@/lib/db/schema/tasks";
import { logActivity } from "@/lib/logUtils";

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
    const result = await db.insert(tasks).values(body);

    await logActivity({
      notes: `Created Task: ${body.title} (${body.taskType})`,
      taskId: Number(result[0].insertId),
      fishBatchId: body.relatedFishBatchId || undefined,
      plantBatchId: body.relatedPlantBatchId || undefined,
    });

    return NextResponse.json(
      { message: "Task added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}
