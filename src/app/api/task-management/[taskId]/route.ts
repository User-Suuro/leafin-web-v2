import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { tasks } from "@/lib/db/schema/tasks";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Props = {
    params: Promise<{
        taskId: string;
    }>;
};

// PUT (Update) a task
export async function PUT(req: Request, props: Props) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const taskId = Number(params.taskId);
        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
        }

        const body = await req.json();

        // Ensure assignedTo is handled if present, similar to POST
        // We clean the body to ensure we don't accidentally update immutable fields if any
        // For now we trust the body but ensure assignedTo is picked up
        const cleanBody = {
            ...body,
            assignedTo: body.assignedTo === undefined ? undefined : (body.assignedTo || null), // Only update if present in body
        };

        // Remove taskId from body if present to avoid PK update error (though usually ignored or error)
        delete cleanBody.taskId;

        // Remove the logic that sets undefined if we want partial updates?
        // Drizzle update set(body) works for partials if keys match.
        // However, assignedTo might be sent as "" string from frontend for "no user".
        if (cleanBody.assignedTo === "") cleanBody.assignedTo = null;

        const result = await db
            .update(tasks)
            .set(cleanBody)
            .where(eq(tasks.taskId, taskId));

        if (session?.user?.id) {
            await logAction(
                session.user.id,
                "UPDATE",
                "TASK",
                {
                    ...cleanBody,
                    taskId: taskId,
                },
                String(taskId),
                `Updated Task: ${cleanBody.title || "Task " + taskId}`
            );
        }

        return NextResponse.json(
            { message: "Task updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}

// DELETE a task
export async function DELETE(req: Request, props: Props) {
    const params = await props.params;
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const taskId = Number(params.taskId);
        if (isNaN(taskId)) {
            return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
        }

        // Get task before delete for logging
        const tasksToDelete = await db.select().from(tasks).where(eq(tasks.taskId, taskId));
        const taskToDelete = tasksToDelete[0];

        await db.delete(tasks).where(eq(tasks.taskId, taskId));

        if (session?.user?.id) {
            await logAction(
                session.user.id,
                "DELETE",
                "TASK",
                {
                    taskId: taskId
                },
                String(taskId),
                `Deleted Task: ${taskToDelete?.title || taskId}`
            );
        }

        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}
