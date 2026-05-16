import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bets } from '@/db/schema';
import { sql, desc, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') ?? '7');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // SQLite date formatting for grouping by day
        // We assume createdAt is stored as ISO string or compatible format

        const stats = await db
            .select({
                date: sql<string>`substr(${bets.createdAt}, 1, 10)`,
                totalBets: sql<number>`count(*)`,
                totalAmount: sql<number>`sum(${bets.amount})`,
                totalPayout: sql<number>`sum(${bets.payout})`,
                wonBets: sql<number>`sum(case when ${bets.result} = 'win' then 1 else 0 end)`,
                lostBets: sql<number>`sum(case when ${bets.result} = 'loss' then 1 else 0 end)`,
            })
            .from(bets)
            .where(gte(bets.createdAt, startDate.toISOString()))
            .groupBy(sql`substr(${bets.createdAt}, 1, 10)`)
            .orderBy(desc(sql`substr(${bets.createdAt}, 1, 10)`));

        const formattedStats = stats.map(stat => ({
            date: stat.date,
            totalBets: stat.totalBets,
            totalAmount: stat.totalAmount ?? 0,
            totalPayout: stat.totalPayout ?? 0,
            wonBets: stat.wonBets,
            lostBets: stat.lostBets,
            profit: (stat.totalAmount ?? 0) - (stat.totalPayout ?? 0)
        }));

        return NextResponse.json({ stats: formattedStats });
    } catch (error) {
        console.error('Wins/Losses stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
