import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Payment packages available for purchase
const COIN_PACKAGES = {
  basic: { coins: 100, price: 10, name: 'Basic Package' },
  standard: { coins: 500, price: 45, name: 'Standard Package' },
  premium: { coins: 1000, price: 85, name: 'Premium Package' },
  mega: { coins: 5000, price: 400, name: 'Mega Package' },
};

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
    const { packageId, paymentMethod } = body;

    // Validate package
    if (!packageId || !COIN_PACKAGES[packageId as keyof typeof COIN_PACKAGES]) {
      return NextResponse.json(
        { error: 'Invalid package selected', code: 'INVALID_PACKAGE' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['mtn', 'airtel', 'stripe'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method', code: 'INVALID_PAYMENT_METHOD' },
        { status: 400 }
      );
    }

    const pkg = COIN_PACKAGES[packageId as keyof typeof COIN_PACKAGES];

    // Create payment order
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In production, this would integrate with real payment gateways
    // For now, we'll simulate the payment process
    const paymentOrder = {
      orderId,
      userId: currentUser.id,
      packageId,
      coins: pkg.coins,
      amount: pkg.price,
      currency: 'USD',
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Return payment details
    return NextResponse.json(
      {
        success: true,
        order: paymentOrder,
        message: 'Payment order created successfully',
        // In production, include payment gateway redirect URL
        paymentUrl: `/api/payments/process?orderId=${orderId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /api/payments/create-order error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error, code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// Get available packages
export async function GET() {
  return NextResponse.json(
    {
      packages: Object.entries(COIN_PACKAGES).map(([id, pkg]) => ({
        id,
        ...pkg,
      })),
      paymentMethods: [
        { id: 'mtn', name: 'MTN MoMo', enabled: true },
        { id: 'airtel', name: 'Airtel Money', enabled: true },
        { id: 'stripe', name: 'Card Payment', enabled: true },
      ],
    },
    { status: 200 }
  );
}