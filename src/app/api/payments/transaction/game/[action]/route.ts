import { NextRequest } from "next/server";
import { db } from "@/db";
import { user, userBalances, coinTransactions } from "@/db/schema";
import { eq, like } from "drizzle-orm";

const ALLOWED_ACTIONS = [
  "bet",
  "debit",
  "credit",
  "refund",
  "rollin",
  "rollout",
  "endround",
  "takeall",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  try {
    const wtoken = request.headers.get("wtoken");
    if (!wtoken || wtoken !== process.env.CYPRESS_API_TOKEN) {
      return Response.json(
        { code: 1003, message: "Parameter error." },
        { status: 401 }
      );
    }

    const { action } = await params;

    if (!ALLOWED_ACTIONS.includes(action)) {
      return Response.json({
        code: 1002,
        message: "Game action error.",
      });
    }

    const body = await request.json();
    const { account, amount, mtcode, roundid, game } = body;

    if (!account || !amount || !mtcode || !roundid) {
      return Response.json({
        code: 1003,
        message: "Parameter error.",
      });
    }

    const amt = Math.floor(Number(amount));

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

    const existingTx = await db
      .select()
      .from(coinTransactions)
      .where(like(coinTransactions.description, `%mtcode=${mtcode}%`))
      .limit(1);

    if (existingTx.length > 0) {
      const bal = await db
        .select()
        .from(userBalances)
        .where(eq(userBalances.userId, userId))
        .limit(1);

      return Response.json({
        code: 0,
        message: "Success",
        balance: `${bal[0].coins}.0000`,
        currency: "INR",
        datetime: new Date().toISOString(),
      });
    }

    const balanceRows = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId))
      .limit(1);

    if (balanceRows.length === 0) {
      return Response.json({
        code: 1006,
        message: "Player not found.",
      });
    }

    let currentCoins = balanceRows[0].coins;
    let newCoins = currentCoins;

    if (action === "debit" || action === "bet") {
      if (currentCoins < amt) {
        return Response.json({
          code: 1005,
          message: "Insufficient Balance.",
        });
      }
      newCoins -= amt;
    }

    if (action === "credit" || action === "rollout" || action === "endround") {
      newCoins += amt;
    }

    if (action === "refund") {
      newCoins += amt;
    }

    await db
      .update(userBalances)
      .set({
        coins: newCoins,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userBalances.userId, userId));

    // 8️⃣ insert transaction
    await db.insert(coinTransactions).values({
      userId,
      amount: amt,
      type: action,
      description: `mtcode=${mtcode}|roundid=${roundid}`,
      gameName: game || null,
      createdAt: new Date().toISOString(),
    });

    return Response.json({
      code: 0,
      message: "Success",
      balance: `${newCoins}.0000`,
      currency: "INR",
      datetime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Game API error:", error);
    return Response.json({
      code: 1100,
      message: "Server error.",
    });
  }
}
