import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers, userBalances } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Admin role verification
    const userBalance = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, user.id))
      .limit(1);

    if (userBalance.length === 0 || userBalance[0].role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { demoUserId, amount, description } = body;

    // Validate demoUserId
    if (!demoUserId) {
      return NextResponse.json(
        { error: 'Demo user ID is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const parsedDemoUserId = parseInt(demoUserId);
    if (isNaN(parsedDemoUserId)) {
      return NextResponse.json(
        { error: 'Demo user ID must be a valid integer', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // Validate amount
    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive integer', code: 'INVALID_INPUT' },
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
    if (demoUser[0].coins < parsedAmount) {
      return NextResponse.json(
        { 
          error: 'Insufficient balance', 
          code: 'INSUFFICIENT_BALANCE',
          currentBalance: demoUser[0].coins,
          requestedAmount: parsedAmount
        },
        { status: 400 }
      );
    }

    // Calculate new balance
    const newBalance = demoUser[0].coins - parsedAmount;

    // Update demo user
    const updatedUser = await db
      .update(demoUsers)
      .set({
        coins: newBalance,
        lastResetAt: new Date().toISOString()
      })
      .where(eq(demoUsers.id, parsedDemoUserId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update demo user', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        user: updatedUser[0],
        message: `Removed ${parsedAmount} coins from demo user`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}