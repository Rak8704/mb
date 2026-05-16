import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { userBalances, coinTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, coins, amount, paymentMethod } = body;

    // Validate input
    if (!orderId || !coins || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // In production, verify payment with payment gateway
    // For demo purposes, we'll simulate successful payment
    const paymentVerified = true;

    if (!paymentVerified) {
      return NextResponse.json(
        { error: 'Payment verification failed', code: 'PAYMENT_FAILED' },
        { status: 400 }
      );
    }

    // Get or create user balance
    const existingBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, currentUser.id))
      .limit(1);

    const now = new Date().toISOString();

    if (existingBalance.length === 0) {
      // Create new balance
      await db.insert(userBalances).values({
        userId: currentUser.id,
        coins: coins,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Update existing balance
      await db
        .update(userBalances)
        .set({
          coins: existingBalance[0].coins + coins,
          updatedAt: now,
        })
        .where(eq(userBalances.userId, currentUser.id));
    }

    // Record transaction
    await db.insert(coinTransactions).values({
      userId: currentUser.id,
      amount: coins,
      type: 'purchase',
      description: `Purchased ${coins} coins via ${paymentMethod} - Order ${orderId}`,
      createdAt: now,
    });

    // Get updated balance
    const updatedBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, currentUser.id))
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        orderId,
        coinsAdded: coins,
        newBalance: updatedBalance[0]?.coins || coins,
        message: 'Payment processed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/payments/process error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}