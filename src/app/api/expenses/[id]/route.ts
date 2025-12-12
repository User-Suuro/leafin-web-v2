import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { expenses } from "@/lib/db/schema/expenses";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop();
    const expenseId = Number(idParam);

    if (isNaN(expenseId)) {
      return NextResponse.json(
        { error: "Invalid expense id" },
        { status: 400 }
      );
    }

    // Check if the expense exists
    const expense = await db
      .select()
      .from(expenses)
      .where(eq(expenses.expenseId, expenseId))
      .limit(1);

    if (!expense.length) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete the expense
    await db.delete(expenses).where(eq(expenses.expenseId, expenseId));

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense", details: String(error) },
      { status: 500 }
    );
  }
}
