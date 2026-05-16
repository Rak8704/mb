import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referrals, user } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const statusFilter = searchParams.get('status');

    // Validate status filter if provided
    const validStatuses = ['pending', 'completed', 'rewarded'];
    if (statusFilter && !validStatuses.includes(statusFilter)) {
      return NextResponse.json({ 
        error: 'Invalid status filter. Must be one of: pending, completed, rewarded',
        code: 'INVALID_STATUS_FILTER'
      }, { status: 400 });
    }

    // Build where conditions
    const whereConditions = [eq(referrals.referrerUserId, currentUser.id)];
    if (statusFilter) {
      whereConditions.push(eq(referrals.status, statusFilter));
    }

    // Query referrals with user information
    const referralsList = await db
      .select({
        id: referrals.id,
        referredUserName: user.name,
        referredUserEmail: user.email,
        status: referrals.status,
        rewardAmount: referrals.rewardAmount,
        createdAt: referrals.createdAt,
        completedAt: referrals.completedAt,
      })
      .from(referrals)
      .innerJoin(user, eq(referrals.referredUserId, user.id))
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
      .orderBy(desc(referrals.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(referrals)
      .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0]);

    const total = totalCountResult[0]?.count ?? 0;

    // Return response
    return NextResponse.json({
      referrals: referralsList,
      total,
      limit,
      offset,
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/referrals/history error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}