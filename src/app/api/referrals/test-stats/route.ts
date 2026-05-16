import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referrals, referralCodes, user } from '@/db/schema';
import { eq, and, or, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Get user info
    const userRecord = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Get user's referral code
    const referralCodeRecord = await db.select({
      referralCode: referralCodes.referralCode,
    })
      .from(referralCodes)
      .where(eq(referralCodes.userId, userId))
      .limit(1);

    const referralCode = referralCodeRecord.length > 0 ? referralCodeRecord[0].referralCode : null;

    // Get all referrals for this user
    const userReferrals = await db.select({
      status: referrals.status,
      rewardAmount: referrals.rewardAmount,
    })
      .from(referrals)
      .where(eq(referrals.referrerUserId, userId));

    // Calculate statistics
    const totalInvited = userReferrals.length;
    
    const pendingSignups = userReferrals.filter(
      ref => ref.status === 'pending'
    ).length;
    
    const completedSignups = userReferrals.filter(
      ref => ref.status === 'completed' || ref.status === 'rewarded'
    ).length;
    
    const rewardedCount = userReferrals.filter(
      ref => ref.status === 'rewarded'
    ).length;
    
    const totalEarnings = userReferrals.reduce(
      (sum, ref) => sum + (ref.rewardAmount || 0),
      0
    );

    // Return statistics
    return NextResponse.json({
      user: {
        id: userRecord[0].id,
        name: userRecord[0].name,
        email: userRecord[0].email,
      },
      totalInvited,
      pendingSignups,
      completedSignups,
      totalEarnings,
      rewardedCount,
      referralCode,
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}