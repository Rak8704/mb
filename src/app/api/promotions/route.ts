import { NextResponse } from 'next/server';
import { db } from '@/db';
import { promotions } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const activePromotions = await db.select()
      .from(promotions)
      .where(eq(promotions.isActive, true))
      .orderBy(asc(promotions.orderIndex), desc(promotions.id));

    return NextResponse.json({ promotions: activePromotions }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}