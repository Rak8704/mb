import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances, referralCodes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

// GET - List all agents with statistics
export async function GET(request: Request) {
  try {
    // Get all agents with their details
    const agents = await db
      .select({
        userId: userBalances.userId,
        name: user.name,
        email: user.email,
        coins: userBalances.coins,
        role: userBalances.role,
        createdAt: userBalances.createdAt,
      })
      .from(userBalances)
      .innerJoin(user, eq(userBalances.userId, user.id))
      .where(eq(userBalances.role, 'agent'));

    // Get referral codes for each agent
    const agentsWithCodes = await Promise.all(
      agents.map(async (agent) => {
        const codeResult = await db
          .select()
          .from(referralCodes)
          .where(eq(referralCodes.userId, agent.userId))
          .limit(1);

        const referralCode = codeResult[0]?.referralCode || 'N/A';

        // Count referrals for this agent
        const referralCount = await db
          .select({ count: count() })
          .from(userBalances)
          .where(eq(userBalances.agentId, agent.userId));

        return {
          id: agent.userId,
          name: agent.name,
          email: agent.email,
          referralCode,
          referredCount: referralCount[0]?.count || 0,
          coins: agent.coins,
          createdAt: agent.createdAt,
        };
      })
    );

    return NextResponse.json({
      agents: agentsWithCodes.sort(
        (a, b) => b.referredCount - a.referredCount
      ),
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
