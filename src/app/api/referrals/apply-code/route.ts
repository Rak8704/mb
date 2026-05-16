import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referralCodes, referrals, userBalances, coinTransactions, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { referralCode } = body;

    // Validate referral code is provided
    if (!referralCode || typeof referralCode !== 'string' || referralCode.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Referral code is required',
          code: 'MISSING_REFERRAL_CODE'
        },
        { status: 400 }
      );
    }

    const code = referralCode.trim();

    // Check if referral code exists
    const referralCodeRecord = await db.select()
      .from(referralCodes)
      .where(eq(referralCodes.referralCode, code))
      .limit(1);

    if (referralCodeRecord.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid referral code',
          code: 'INVALID_REFERRAL_CODE'
        },
        { status: 404 }
      );
    }

    const referrerUserId = referralCodeRecord[0].userId;

    // Check if user is trying to use their own referral code
    if (referrerUserId === currentUser.id) {
      return NextResponse.json(
        { 
          error: 'Cannot use your own referral code',
          code: 'SELF_REFERRAL_NOT_ALLOWED'
        },
        { status: 400 }
      );
    }

    // Check if user has already been referred
    const existingReferral = await db.select()
      .from(referrals)
      .where(eq(referrals.referredUserId, currentUser.id))
      .limit(1);

    if (existingReferral.length > 0) {
      return NextResponse.json(
        { 
          error: 'You have already been referred',
          code: 'ALREADY_REFERRED'
        },
        { status: 400 }
      );
    }

    // Get referrer user details for transaction description
    const referrerUser = await db.select()
      .from(user)
      .where(eq(user.id, referrerUserId))
      .limit(1);

    const referrerName = referrerUser.length > 0 ? referrerUser[0].name : 'user';

    // Use transaction to ensure atomic operations
    const result = await db.transaction(async (tx) => {
      const currentTimestamp = new Date().toISOString();
      const rewardAmount = 500;

      // Create new referral record
      const newReferral = await tx.insert(referrals)
        .values({
          referrerUserId: referrerUserId,
          referredUserId: currentUser.id,
          referralCode: code,
          status: 'completed',
          rewardAmount: rewardAmount,
          createdAt: currentTimestamp,
          completedAt: currentTimestamp,
        })
        .returning();

      // Update referrer's balance
      const existingBalance = await tx.select()
        .from(userBalances)
        .where(eq(userBalances.userId, referrerUserId))
        .limit(1);

      if (existingBalance.length > 0) {
        await tx.update(userBalances)
          .set({
            coins: existingBalance[0].coins + rewardAmount,
            updatedAt: currentTimestamp,
          })
          .where(eq(userBalances.userId, referrerUserId));
      } else {
        // Create balance record if it doesn't exist
        await tx.insert(userBalances)
          .values({
            userId: referrerUserId,
            coins: rewardAmount,
            role: 'user',
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
          });
      }

      // Record coin transaction
      await tx.insert(coinTransactions)
        .values({
          userId: referrerUserId,
          amount: rewardAmount,
          type: 'referral_reward',
          description: `Referral bonus for inviting ${referrerName || 'user'}`,
          createdAt: currentTimestamp,
        });

      return newReferral[0];
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Referral code applied successfully',
        referral: {
          referrerUserId: result.referrerUserId,
          referredUserId: result.referredUserId,
          status: result.status,
          rewardAmount: result.rewardAmount,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/referrals/apply-code error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}