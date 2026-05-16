// app/api/wallet/credit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { walletService, WalletCreditRequest } from '@/lib/wallet-service';

export async function POST(request: NextRequest) {
  try {
    const body: WalletCreditRequest = await request.json();

    // Validate required fields
    if (!body.username || !body.amount || !body.gameId || !body.transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields: username, amount, gameId, transactionId' },
        { status: 400 }
      );
    }

    const result = await walletService.credit(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Wallet credit error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to credit wallet',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
