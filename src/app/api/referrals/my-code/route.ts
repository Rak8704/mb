import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { referralCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

function generateReferralCode(email: string): string {
  const emailPrefix = email.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const prefix = emailPrefix.padEnd(3, chars.charAt(Math.floor(Math.random() * chars.length)));
  return (prefix + randomPart).substring(0, 8).toUpperCase();
}

async function generateUniqueReferralCode(email: string): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const code = generateReferralCode(email);
    
    const existing = await db.select()
      .from(referralCodes)
      .where(eq(referralCodes.referralCode, code))
      .limit(1);
    
    if (existing.length === 0) {
      return code;
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique referral code after maximum attempts');
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required' 
      }, { status: 401 });
    }

    const existingCode = await db.select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, user.id))
      .limit(1);

    if (existingCode.length > 0) {
      const code = existingCode[0];
      return NextResponse.json({
        referralCode: code.referralCode,
        createdAt: code.createdAt,
        referralLink: `https://nicebet.com/register?ref=${code.referralCode}`
      }, { status: 200 });
    }

    const newReferralCode = await generateUniqueReferralCode(user.email);
    
    const createdCode = await db.insert(referralCodes)
      .values({
        userId: user.id,
        referralCode: newReferralCode,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      referralCode: createdCode[0].referralCode,
      createdAt: createdCode[0].createdAt,
      referralLink: `https://nicebet.com/register?ref=${createdCode[0].referralCode}`
    }, { status: 200 });

  } catch (error) {
    console.error('GET /api/referrals/my-code error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}