import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userBalances, coinTransactions, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

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

    // Check if current user is admin
    const adminBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, currentUser.id))
      .limit(1);

    if (adminBalance.length === 0 || adminBalance[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, amount, description } = body;

    // Validate input
    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'userId and amount are required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive', code: 'INVALID_AMOUNT' },
        { status: 400 }
      );
    }

    // Check if user exists
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (targetUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Get user balance
    const existingBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId))
      .limit(1);

    if (existingBalance.length === 0) {
      return NextResponse.json(
        { error: 'User balance not found', code: 'BALANCE_NOT_FOUND' },
        { status: 404 }
      );
    }

    if (existingBalance[0].coins < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance', code: 'INSUFFICIENT_BALANCE' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Update balance
    await db
      .update(userBalances)
      .set({
        coins: existingBalance[0].coins - amount,
        updatedAt: now,
      })
      .where(eq(userBalances.userId, userId));

    // Record transaction
    await db.insert(coinTransactions).values({
      userId,
      amount: -amount,
      type: 'admin_remove',
      description: description || `Admin removed ${amount} coins`,
      createdByAdminId: currentUser.id,
      createdAt: now,
    });

    // Get updated balance
    const updatedBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId))
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        balance: updatedBalance[0],
        transaction: {
          amount: -amount,
          type: 'admin_remove',
          description: description || `Admin removed ${amount} coins`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/admin/balances/remove error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}