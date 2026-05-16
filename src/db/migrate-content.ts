import { db } from './index';
import { sql } from 'drizzle-orm';

async function migrate() {
    console.log('Running migrations...');

    try {
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
        console.log('✓ Created announcements table');

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
        console.log('✓ Created scrolling_messages table');

        // Insert default announcements
        const now = new Date().toISOString();
        await db.run(sql`
      INSERT INTO announcements (title, description, button_text, button_link, order_index, is_active, created_at, updated_at)
      SELECT 'Welcome Bonus - $10 Billion', 'Register now and claim your special welcome bonus! Available for new members only.', 'Claim Now', '/register', 1, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Welcome Bonus - $10 Billion')
    `);

        await db.run(sql`
      INSERT INTO announcements (title, description, button_text, button_link, order_index, is_active, created_at, updated_at)
      SELECT '1 Refer = $1000 Bonus', 'Invite 1 friend and earn up to $1000 bonus instantly. Simple, fast and profitable. Start earning now!', 'Start Referring', '/en/invite', 2, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = '1 Refer = $1000 Bonus')
    `);

        await db.run(sql`
      INSERT INTO announcements (title, description, button_text, button_link, order_index, is_active, created_at, updated_at)
      SELECT 'Red Envelope Bonus', 'Automatically live red envelope bonus! We are taking some time, so come quickly, test and win prizes.', 'Learn More', '/en/promotions', 3, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'Red Envelope Bonus')
    `);
        console.log('✓ Inserted default announcements');

        // Insert default scrolling messages
        await db.run(sql`
      INSERT INTO scrolling_messages (message, order_index, is_active, created_at, updated_at)
      SELECT 'Welcome to JK222! Experience the best sports betting and casino games.', 1, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM scrolling_messages WHERE message = 'Welcome to JK222! Experience the best sports betting and casino games.')
    `);

        await db.run(sql`
      INSERT INTO scrolling_messages (message, order_index, is_active, created_at, updated_at)
      SELECT 'Get 100% Welcome Bonus on your first deposit!', 2, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM scrolling_messages WHERE message = 'Get 100% Welcome Bonus on your first deposit!')
    `);

        await db.run(sql`
      INSERT INTO scrolling_messages (message, order_index, is_active, created_at, updated_at)
      SELECT 'JK222 - Your trusted gaming platform. Play responsibly!', 3, 1, ${now}, ${now}
      WHERE NOT EXISTS (SELECT 1 FROM scrolling_messages WHERE message = 'JK222 - Your trusted gaming platform. Play responsibly!')
    `);
        console.log('✓ Inserted default scrolling messages');

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

migrate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
