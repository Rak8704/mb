import { NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers } from '@/db/schema';

// POST - Create new demo user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, initialCoins = 10000 } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const now = new Date().toISOString();

        await db.insert(demoUsers).values({
            name,
            email,
            coins: parseInt(initialCoins.toString()) || 10000,
            createdAt: now,
            lastResetAt: now,
        });

        return NextResponse.json({
            success: true,
            message: 'Demo user created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Create demo user error:', error);
        return NextResponse.json({
            error: 'Failed to create demo user: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
