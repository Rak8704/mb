import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referralCodes, referrals, userBalances, coinTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, userId } = body;

    // Validate required fields
    if (!referralCode || !userId) {
      return NextResponse.json({ 
        error: "Referral code and user ID are required",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Trim and validate inputs
    const trimmedReferralCode = referralCode.trim();
    const trimmedUserId = userId.trim();

    if (!trimmedReferralCode || !trimmedUserId) {
      return NextResponse.json({ 
        error: "Referral code and user ID cannot be empty",
        code: "INVALID_INPUT" 
      }, { status: 400 });
    }

    // Check if referral code exists
    const referralCodeRecord = await db.select()
      .from(referralCodes)
      .where(eq(referralCodes.referralCode, trimmedReferralCode))
      .limit(1);

    if (referralCodeRecord.length === 0) {
      return NextResponse.json({ 
        error: "Invalid referral code",
        code: "INVALID_REFERRAL_CODE" 
      }, { status: 404 });
    }

    const referrerUserId = referralCodeRecord[0].userId;

    // Check if user is trying to use their own referral code
    if (referrerUserId === trimmedUserId) {
      return NextResponse.json({ 
        error: "Cannot use your own referral code",
        code: "SELF_REFERRAL_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if user has already been referred
    const existingReferral = await db.select()
      .from(referrals)
      .where(eq(referrals.referredUserId, trimmedUserId))
      .limit(1);

    if (existingReferral.length > 0) {
      return NextResponse.json({ 
        error: "You have already been referred",
        code: "ALREADY_REFERRED" 
      }, { status: 400 });
    }

    // Use transaction to create referral and update balances atomically
    const result = await db.transaction(async (tx) => {
      const now = new Date().toISOString();
      const rewardAmount = 500;

      // Create referral record
      const newReferral = await tx.insert(referrals)
        .values({
          referrerUserId: referrerUserId,
          referredUserId: trimmedUserId,
          referralCode: trimmedReferralCode,
          status: 'completed',
          rewardAmount: rewardAmount,
          createdAt: now,
          completedAt: now,
        })
        .returning();

      // Check if referrer has a balance record
      const existingBalance = await tx.select()
        .from(userBalances)
        .where(eq(userBalances.userId, referrerUserId))
        .limit(1);

      if (existingBalance.length > 0) {
        // Update existing balance
        await tx.update(userBalances)
          .set({
            coins: existingBalance[0].coins + rewardAmount,
            updatedAt: now,
          })
          .where(eq(userBalances.userId, referrerUserId));
      } else {
        // Create new balance record
        await tx.insert(userBalances)
          .values({
            userId: referrerUserId,
            coins: rewardAmount,
            role: 'user',
            createdAt: now,
            updatedAt: now,
          });
      }

      // Create coin transaction record for referrer
      await tx.insert(coinTransactions)
        .values({
          userId: referrerUserId,
          amount: rewardAmount,
          type: 'referral_reward',
          description: `Referral reward for referring user ${trimmedUserId}`,
          createdAt: now,
        });

      return newReferral[0];
    });

    return NextResponse.json({
      success: true,
      message: 'Referral code applied successfully',
      referral: {
        referrerUserId: result.referrerUserId,
        referredUserId: result.referredUserId,
        status: result.status,
        rewardAmount: result.rewardAmount,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}