import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

// PUT - Update user
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, name, role } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const now = new Date();

        // Update user name if provided
        if (name) {
            await db.update(user)
                .set({ name, updatedAt: now })
                .where(eq(user.id, userId));
        }

        // Update role if provided
        if (role) {
            await db.update(userBalances)
                .set({ role, updatedAt: now.toISOString() })
                .where(eq(userBalances.userId, userId));
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({
            error: 'Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
