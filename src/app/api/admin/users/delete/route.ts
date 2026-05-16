import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances, account, session, bets, coinTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user and all related data (cascade will handle most of it)
    // But we'll explicitly delete some for clarity
    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(bets).where(eq(bets.userId, userId));
    await db.delete(coinTransactions).where(eq(coinTransactions.userId, userId));
    await db.delete(userBalances).where(eq(userBalances.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({
      error: 'Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}