// app/api/wallet/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/lib/wallet-service';
import { db } from '@/db';
import { coinTransactions } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify callback token
    const isValid = await walletService.verifyCallback(body);

    if (!isValid) {
      console.warn('Invalid wallet callback token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      );
    }

    const {
      username,
      transactionId,
      type, // 'debit' or 'credit'
      amount,
      gameId,
      status = 'completed',
    } = body;

    // Log transaction to database
    if (username && amount && gameId) {
      try {
        await db.insert(coinTransactions).values({
          userId: username,
          amount: type === 'debit' ? -amount : amount,
          type: type,
          description: `Cypress Gaming - ${gameId}`,
          gameName: gameId,
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error('Error logging transaction:', dbError);
        // Continue even if logging fails
      }
    }

    return NextResponse.json({
      success: true,
      transactionId,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Wallet callback error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process callback',
      },
      { status: 500 }
    );
  }
}

// SELECT id, username, email, role FROM admins WHERE status = 'active';
