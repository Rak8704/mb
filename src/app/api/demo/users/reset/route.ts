import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { demoUserId } = body;

    // Validate demoUserId is provided
    if (!demoUserId) {
      return NextResponse.json(
        { 
          error: 'Demo user ID is required',
          code: 'MISSING_DEMO_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate demoUserId is a valid integer
    const parsedId = parseInt(demoUserId);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { 
          error: 'Demo user ID must be a valid integer',
          code: 'INVALID_DEMO_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Check if demo user exists
    const existingUser = await db.select()
      .from(demoUsers)
      .where(eq(demoUsers.id, parsedId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'Demo user not found',
          code: 'DEMO_USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Update demo user: reset coins to 1000 and update lastResetAt
    const updated = await db.update(demoUsers)
      .set({
        coins: 1000,
        lastResetAt: new Date().toISOString()
      })
      .where(eq(demoUsers.id, parsedId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update demo user',
          code: 'UPDATE_FAILED' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: updated[0],
        message: 'Demo user coins reset to 1000'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}