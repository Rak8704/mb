import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { user, userBalances } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function findAdminCredentials() {
  try {
    console.log('Connecting to Turso database...');
    
    const client = createClient({
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const db = drizzle(client, { schema: { user, userBalances } });

    console.log('\n📊 Fetching all users with admin role...\n');
    
    // Get all users with admin role
    const admins = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: userBalances.role,
        coins: userBalances.coins,
        createdAt: user.createdAt,
      })
      .from(user)
      .innerJoin(userBalances, eq(user.id, userBalances.userId))
      .where(eq(userBalances.role, 'admin'));

    if (admins.length === 0) {
      console.log('❌ No admin users found in database');
      
      // Show all users
      console.log('\n📋 All users in system:\n');
      const allUsers = await db.select().from(user);
      console.table(allUsers);
      
      return;
    }

    console.log('✅ Admin credentials found:\n');
    console.table(admins);

    // Also show the admin user balances
    console.log('\n💰 Admin User Balances:\n');
    const adminBalances = await db.select().from(userBalances).where(eq(userBalances.role, 'admin'));
    console.table(adminBalances);

  } catch (error) {
    console.error('❌ Error connecting to database:', error);
  }
}

findAdminCredentials();
