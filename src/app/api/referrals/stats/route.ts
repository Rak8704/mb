import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referrals, referralCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Query all referrals for the current user
    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerUserId, user.id));

    // Calculate statistics
    const totalInvited = userReferrals.length;
    
    const pendingSignups = userReferrals.filter(
      (referral) => referral.status === 'pending'
    ).length;
    
    const completedSignups = userReferrals.filter(
      (referral) => referral.status === 'completed' || referral.status === 'rewarded'
    ).length;
    
    const totalEarnings = userReferrals.reduce(
      (sum, referral) => sum + (referral.rewardAmount || 0),
      0
    );
    
    const rewardedCount = userReferrals.filter(
      (referral) => referral.status === 'rewarded'
    ).length;

    // Get user's referral code
    const userReferralCode = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, user.id))
      .limit(1);

    const referralCode = userReferralCode.length > 0 
      ? userReferralCode[0].referralCode 
      : null;

    // Return statistics
    return NextResponse.json({
      totalInvited,
      pendingSignups,
      completedSignups,
      totalEarnings,
      rewardedCount,
      referralCode,
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/referrals/stats error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}