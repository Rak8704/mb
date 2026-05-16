import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialContacts } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const contacts = await db.select({
      id: socialContacts.id,
      platform: socialContacts.platform,
      label: socialContacts.label,
      value: socialContacts.value,
      iconColor: socialContacts.iconColor,
      displayOrder: socialContacts.displayOrder,
    })
      .from(socialContacts)
      .where(eq(socialContacts.isActive, true))
      .orderBy(asc(socialContacts.displayOrder), asc(socialContacts.id));

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}