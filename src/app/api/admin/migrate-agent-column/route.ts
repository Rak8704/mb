import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

// POST - Run migration to add agent_id column
export async function POST(request: Request) {
    try {
        console.log('Starting migration: Adding agent_id to user_balances...');

        // Add agent_id column to user_balances table
        await db.run(sql`ALTER TABLE user_balances ADD COLUMN agent_id TEXT REFERENCES user(id) ON DELETE SET NULL`);

        console.log('✅ Column added successfully');

        // Create index for faster lookups
        try {
            await db.run(sql`CREATE INDEX IF NOT EXISTS idx_user_balances_agent_id ON user_balances(agent_id)`);
            console.log('✅ Index created successfully');
        } catch (indexError) {
            console.log('Index might already exist, continuing...');
        }

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully! agent_id column added to user_balances table.'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Migration error:', error);

        // Check if column already exists
        if (error.message?.includes('duplicate column name')) {
            return NextResponse.json({
                success: true,
                message: 'Migration already applied - agent_id column already exists.'
            }, { status: 200 });
        }

        return NextResponse.json({
            error: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
            details: error
        }, { status: 500 });
    }
}

// GET - Check if migration is needed
export async function GET(request: Request) {
    try {
        // Try to query the agent_id column
        const result = await db.run(sql`SELECT agent_id FROM user_balances LIMIT 1`);

        return NextResponse.json({
            migrationNeeded: false,
            message: 'Migration already applied - agent_id column exists.'
        }, { status: 200 });

    } catch (error: any) {
        if (error.message?.includes('no such column')) {
            return NextResponse.json({
                migrationNeeded: true,
                message: 'Migration needed - agent_id column does not exist.'
            }, { status: 200 });
        }

        return NextResponse.json({
            error: 'Failed to check migration status',
            details: error.message
        }, { status: 500 });
    }
}
