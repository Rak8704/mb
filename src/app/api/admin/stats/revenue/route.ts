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

        const dailyRevenue = await db
            .select({
                date: sql<string>`substr(${bets.createdAt}, 1, 10)`,
                betCount: sql<number>`count(*)`,
                totalStaked: sql<number>`sum(${bets.amount})`,
                totalPayout: sql<number>`sum(${bets.payout})`,
            })
            .from(bets)
            .where(gte(bets.createdAt, startDate.toISOString()))
            .groupBy(sql`substr(${bets.createdAt}, 1, 10)`)
            .orderBy(desc(sql`substr(${bets.createdAt}, 1, 10)`));

        const formattedDaily = dailyRevenue.map(day => ({
            date: day.date,
            betCount: day.betCount,
            netRevenue: (day.totalStaked ?? 0) - (day.totalPayout ?? 0)
        }));

        const totalRevenue = formattedDaily.reduce((sum, day) => sum + day.netRevenue, 0);

        return NextResponse.json({
            daily: formattedDaily,
            summary: {
                profit: totalRevenue
            }
        });
    } catch (error) {
        console.error('Revenue stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
