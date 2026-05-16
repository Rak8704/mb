import { NextRequest } from "next/server";
import { db } from "@/db";
import { user, userBalances } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ account: string }> }
) {
  try {
    const { account } = await params;

    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, account))
      .limit(1);

    if (users.length === 0) {
      return Response.json({
        code: 1006,
        message: "Player not found.",
      });
    }

    const userId = users[0].id;

    const balances = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId))
      .limit(1);

    if (balances.length === 0) {
      return Response.json({
        code: 1006,
        message: "Player not found.",
      });
    }

    const coins = balances[0].coins;

    return Response.json({
      code: 0,
      message: "Success",
      account,
      currency: "INR",
      balance: `${coins}.0000`,
      datetime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Balance API error:", error);
    return Response.json({
      code: 1100,
      message: "Server error.",
    });
  }
}