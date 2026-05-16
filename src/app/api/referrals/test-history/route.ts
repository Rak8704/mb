import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referrals, user } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get userId from query parameter
    const userId = searchParams.get('userId');
    
    // Validate userId is provided
    if (!userId) {
      return NextResponse.json({ 
        error: "userId query parameter is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Parse optional status filter
    const status = searchParams.get('status');
    
    // Validate status filter if provided
    const validStatuses = ['pending', 'completed', 'rewarded'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`,
        code: "INVALID_STATUS_FILTER" 
      }, { status: 400 });
    }

    // Check if user exists
    const userRecord = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Build where conditions
    const whereConditions = [eq(referrals.referrerUserId, userId)];
    
    if (status) {
      whereConditions.push(eq(referrals.status, status));
    }

    const whereClause = whereConditions.length > 1 
      ? and(...whereConditions) 
      : whereConditions[0];

    // Get total count for pagination metadata
    const totalResult = await db.select({ count: count() })
      .from(referrals)
      .where(whereClause);

    const total = totalResult[0]?.count ?? 0;

    // Query referrals with user join
    const referralResults = await db.select({
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
      .where(whereClause)
      .orderBy(desc(referrals.createdAt))
      .limit(limit)
      .offset(offset);

    // Format response
    return NextResponse.json({
      user: {
        id: userRecord[0].id,
        email: userRecord[0].email,
      },
      referrals: referralResults,
      total,
      limit,
      offset,
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/referrals/test-history error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}