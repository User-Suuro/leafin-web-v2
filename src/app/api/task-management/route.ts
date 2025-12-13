import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle"; // your drizzle db connection
import { tasks } from "@/lib/db/schema/tasks";
import { logAction } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await req.json();
    const result = await db.insert(tasks).values(body);

    if (session?.user?.id) {
      await logAction(
        session.user.id,
        "CREATE",
        "TASK",
        {
          ...body,
          taskId: Number(result[0].insertId),
        },
        String(result[0].insertId),
        `Created Task: ${body.title} (${body.taskType})`
      );
    }

    return NextResponse.json(
      { message: "Task added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}
