import { NextResponse } from "next/server";
import { db } from "@/db";
import { bets, user, userBalances } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Active Users (Total users for now)
    const usersCountRes = await db.select({ count: sql<number>`count(*)` }).from(user);
    const activeUsers = usersCountRes[0]?.count ?? 0;

    // 2. Total Bets (24h logic omitted for brevity, doing total for now)
    const betsCountRes = await db.select({ count: sql<number>`count(*)` }).from(bets);
    const totalBets = betsCountRes[0]?.count ?? 0;

    // 3. GGR (Gross Gaming Revenue) = Total Bets Amount - Total Payout
    // We can sum these up.
    const betsStats = await db
      .select({
        totalStaked: sql<number>`sum(${bets.amount})`,
        totalPayout: sql<number>`sum(${bets.payout})`,
      })
      .from(bets);

    const totalStaked = betsStats[0]?.totalStaked ?? 0;
    const totalPayout = betsStats[0]?.totalPayout ?? 0;
    const ggr = totalStaked - totalPayout;

    // 4. Wallet Float (Total coins in user balances)
    const walletStats = await db
      .select({
        totalCoins: sql<number>`sum(${userBalances.coins})`,
      })
      .from(userBalances);
    const walletFloat = walletStats[0]?.totalCoins ?? 0;

    return NextResponse.json({
      ggr24h: ggr, // Using total GGR as 24h placeholder for now
      ggrDelta: 0,
      bets24h: totalBets,
      betsDelta: 0,
      activeUsers: activeUsers,
      payoutRatio: totalStaked > 0 ? (totalPayout / totalStaked) * 100 : 0,
      payoutDelta: 0,
      walletFloat: walletFloat,
      topSports: [
        { name: "Casino", share: 100 }, // Placeholder
      ],
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}