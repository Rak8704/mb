import { db } from '@/db';
import { userBalances, user } from '@/db/schema';
import { eq, isNotNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await db.select().from(user);
        const balances = await db.select().from(userBalances);

        // Find users missing balances/roles
        const missing = users.filter(u => !balances.find(b => b.userId === u.id));

        return NextResponse.json({
            userCount: users.length,
            balanceCount: balances.length,
            missingCount: missing.length,
            missingUsers: missing.map(u => ({ id: u.id, name: u.name }))
        });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message });
    }
}
