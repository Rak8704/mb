import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances, referralCodes, referrals } from '@/db/schema';
import { eq, isNull, count, isNotNull } from 'drizzle-orm';

// GET - System Statistics
export async function GET(request: Request) {
  try {
    // Total users
    const totalUsersResult = await db.select({ count: count() }).from(userBalances);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Total agents (role = 'agent')
    const totalAgentsResult = await db
      .select({ count: count() })
      .from(userBalances)
      .where(eq(userBalances.role, 'agent'));
    const totalAgents = totalAgentsResult[0]?.count || 0;

    // Users with agents assigned
    const usersWithAgentsResult = await db
      .select({ count: count() })
      .from(userBalances)
      .where(isNotNull(userBalances.agentId));
    const usersWithAgents = usersWithAgentsResult[0]?.count || 0;

    // Total referrals
    const totalReferralsResult = await db
      .select({ count: count() })
      .from(referrals);
    const totalReferrals = totalReferralsResult[0]?.count || 0;

    // Users without agents (orphaned)
    const orphanedUsersResult = await db
      .select({ count: count() })
      .from(userBalances)
      .where(isNull(userBalances.agentId));
    const orphanedUsers = orphanedUsersResult[0]?.count || 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalAgents,
        usersWithAgents,
        totalReferrals,
        orphanedUsers,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
