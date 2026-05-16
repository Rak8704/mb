// app/api/wallet/debit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { walletService, WalletDebitRequest } from '@/lib/wallet-service';

export async function POST(request: NextRequest) {
  try {
    const body: WalletDebitRequest = await request.json();

    // Validate required fields
    if (!body.username || !body.amount || !body.gameId || !body.transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: username, amount, gameId, transactionId' },
        { status: 400 }
      );
    }

    const result = await walletService.debit(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Wallet debit error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to debit wallet',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
