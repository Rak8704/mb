import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers, demoBets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demoUserId, gameId, gameName, amount, multiplier } = body;

    // Validate required fields
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user ID is required', code: 'MISSING_FIELD' },
        { status: 400 }
      );
    }

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required', code: 'MISSING_FIELD' },
        { status: 400 }
      );
    }

    if (!gameName) {
      return NextResponse.json(
        { error: 'Game name is required', code: 'MISSING_FIELD' },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        { error: 'Bet amount is required', code: 'MISSING_FIELD' },
        { status: 400 }
      );
    }

    // Validate amount is positive integer
    const betAmount = parseInt(amount);
    if (isNaN(betAmount) || betAmount <= 0) {
      return NextResponse.json(
        { error: 'Bet amount must be a positive integer', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // Validate demoUserId is valid integer
    const parsedDemoUserId = parseInt(demoUserId);
    if (isNaN(parsedDemoUserId)) {
      return NextResponse.json(
        { error: 'Valid demo user ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if demo user exists
    const demoUser = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, parsedDemoUserId))
      .limit(1);

    if (demoUser.length === 0) {
      return NextResponse.json(
        { error: 'Demo user not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if demo user has sufficient balance
    if (demoUser[0].coins < betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance', code: 'INSUFFICIENT_BALANCE' },
        { status: 400 }
      );
    }

    // Perform transaction: deduct coins and create bet
    const result = await db.transaction(async (tx) => {
      // Deduct amount from demo user's coins and update lastResetAt
      const updatedUser = await tx
        .update(demoUsers)
        .set({
          coins: demoUser[0].coins - betAmount,
          lastResetAt: new Date().toISOString(),
        })
        .where(eq(demoUsers.id, parsedDemoUserId))
        .returning();

      // Create new demo bet record
      const newBet = await tx
        .insert(demoBets)
        .values({
          demoUserId: parsedDemoUserId,
          gameId: gameId.trim(),
          gameName: gameName.trim(),
          amount: betAmount,
          result: 'pending',
          payout: 0,
          multiplier: multiplier ? parseFloat(multiplier) : null,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return {
        bet: newBet[0],
        balance: {
          coins: updatedUser[0].coins,
        },
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}