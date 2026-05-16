import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

// GET - Fetch all users with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    console.log('📊 Fetching users with filters:', { role, status });

    // Fetch users with their balances using LEFT JOIN
    const usersData = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        role: userBalances.role,
        coins: userBalances.coins,
        agentId: userBalances.agentId,
      })
      .from(user)
      .leftJoin(userBalances, eq(user.id, userBalances.userId));

    console.log(`📊 Found ${usersData.length} total users from database`);

    // Check for users without balances and create them
    const usersWithoutBalances = usersData.filter(u => u.role === null);

    if (usersWithoutBalances.length > 0) {
      console.log(`⚠️ Found ${usersWithoutBalances.length} users without balances, creating them...`);

      const now = new Date().toISOString();

      // Get all agents for auto-assignment
      const agents = await db.select()
        .from(userBalances)
        .where(eq(userBalances.role, 'agent'))
        .all();

      for (const u of usersWithoutBalances) {
        try {
          // Randomly assign to an agent if available
          let assignedAgentId = null;
          if (agents.length > 0) {
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            assignedAgentId = randomAgent.userId;
          }

          await db.insert(userBalances).values({
            userId: u.id,
            coins: 1000,
            role: 'user',
            agentId: assignedAgentId,
            createdAt: now,
            updatedAt: now,
          });

          console.log(`✅ Created balance for user ${u.id}${assignedAgentId ? ` and assigned to agent ${assignedAgentId}` : ''}`);

          // Update the user data in our result set
          u.role = 'user';
          u.coins = 1000;
          u.agentId = assignedAgentId;
        } catch (error) {
          console.error(`❌ Failed to create balance for user ${u.id}:`, error);
        }
      }
    }

    // Apply filters and map to proper format
    let filteredUsers = usersData.map(u => ({
      ...u,
      status: 'active', // Default status, can be enhanced with a status field in DB
      role: u.role || 'user',
      coins: u.coins || 0,
    }));

    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }

    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }

    console.log(`✅ Returning ${filteredUsers.length} users after filters`);

    return NextResponse.json({ users: filteredUsers }, { status: 200 });
  } catch (error) {
    console.error('❌ GET users error:', error);
    return NextResponse.json({
      error: 'Failed to fetch users: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}