import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - List all users with their agent assignments
export async function GET(request: Request) {
  try {
    // Get all users with their balances
    const allUsers = await db
      .select({
        userId: userBalances.userId,
        name: user.name,
        email: user.email,
        role: userBalances.role,
        coins: userBalances.coins,
        agentId: userBalances.agentId,
      })
      .from(userBalances)
      .innerJoin(user, eq(userBalances.userId, user.id))
      .orderBy(userBalances.createdAt);

    // For users with agents, get agent names
    const usersWithAgentNames = await Promise.all(
      allUsers.map(async (userRecord) => {
        let agentName = null;

        if (userRecord.agentId) {
          const agentResult = await db
            .select({ name: user.name })
            .from(user)
            .where(eq(user.id, userRecord.agentId))
            .limit(1);

          agentName = agentResult[0]?.name || null;
        }

        return {
          id: userRecord.userId,
          name: userRecord.name,
          email: userRecord.email,
          role: userRecord.role,
          coins: userRecord.coins,
          agentId: userRecord.agentId,
          agentName,
        };
      })
    );

    return NextResponse.json({
      users: usersWithAgentNames,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
