import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function POST() {
    try {
        console.log('Running content tables migration...');

        // Create announcements table
        await db.run(sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        button_text TEXT NOT NULL DEFAULT 'Learn More',
        button_link TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

        // Create scrolling_messages table
        await db.run(sql`
      CREATE TABLE IF NOT EXISTS scrolling_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

        // Insert default data
        const now = new Date().toISOString();

        // Check if announcements exist
        const existingAnnouncements = await db.run(sql`SELECT COUNT(*) as count FROM announcements`);
        if (!existingAnnouncements || (existingAnnouncements as any).rows?.[0]?.count === 0) {
            await db.run(sql`
        INSERT INTO announcements (title, description, button_text, button_link, order_index, is_active, created_at, updated_at)
        VALUES 
        ('Welcome Bonus - $10 Billion', 'Register now and claim your special welcome bonus! Available for new members only.', 'Claim Now', '/register', 1, 1, ${now}, ${now}),
        ('1 Refer = $1000 Bonus', 'Invite 1 friend and earn up to $1000 bonus instantly. Simple, fast and profitable. Start earning now!', 'Start Referring', '/en/invite', 2, 1, ${now}, ${now}),
        ('Red Envelope Bonus', 'Automatically live red envelope bonus! We are taking some time, so come quickly, test and win prizes.', 'Learn More', '/en/promotions', 3, 1, ${now}, ${now})
      `);
        }

        // Check if messages exist
        const existingMessages = await db.run(sql`SELECT COUNT(*) as count FROM scrolling_messages`);
        if (!existingMessages || (existingMessages as any).rows?.[0]?.count === 0) {
            await db.run(sql`
        INSERT INTO scrolling_messages (message, order_index, is_active, created_at, updated_at)
        VALUES 
        ('Welcome to JK222! Experience the best sports betting and casino games.', 1, 1, ${now}, ${now}),
        ('Get 100% Welcome Bonus on your first deposit!', 2, 1, ${now}, ${now}),
        ('JK222 - Your trusted gaming platform. Play responsibly!', 3, 1, ${now}, ${now})
      `);
        }

        return NextResponse.json({
            success: true,
            message: 'Content tables created and seeded successfully!'
        }, { status: 200 });
    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({
            error: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
