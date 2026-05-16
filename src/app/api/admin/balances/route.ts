import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let query = db
            .select({
                userId: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                coins: userBalances.coins,
                role: userBalances.role,
            })
            .from(user)
            .leftJoin(userBalances, eq(user.id, userBalances.userId));

        if (role) {
            query = query.where(eq(userBalances.role, role)) as any;
        }

        const balances = await query;

        return NextResponse.json({ balances });
    } catch (error) {
        console.error('Balances error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
