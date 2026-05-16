import { NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers } from '@/db/schema';

// GET - Fetch all demo users
export async function GET() {
    try {
        const users = await db.select().from(demoUsers);

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('GET demo users error:', error);
        return NextResponse.json({
            error: 'Failed to fetch demo users: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
