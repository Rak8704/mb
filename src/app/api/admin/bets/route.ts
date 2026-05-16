import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bets, user } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
        const offset = parseInt(searchParams.get('offset') ?? '0');

        const results = await db
            .select({
                id: bets.id,
                userId: bets.userId,
                userName: user.name,
                gameName: bets.gameName,
                amount: bets.amount,
                payout: bets.payout,
                result: bets.result,
                createdAt: bets.createdAt,
            })
            .from(bets)
            .leftJoin(user, eq(bets.userId, user.id))
            .orderBy(desc(bets.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count
        const totalResult = await db.select({ count: sql<number>`count(*)` }).from(bets);
        const total = totalResult[0]?.count ?? 0;

        return NextResponse.json({
            bets: results,
            total,
        });
    } catch (error) {
        console.error('GET bets error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
