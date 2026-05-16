// app/api/wallet/balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { walletService } from '@/lib/wallet-service';

export async function POST(request: NextRequest) {
  try {
    const { username, currency = 'INR' } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const balance = await walletService.getBalance(username, currency);

    return NextResponse.json({
      success: true,
      data: balance,
    });
  } catch (error: any) {
    console.error('Wallet balance error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get balance',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
