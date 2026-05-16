import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const demoUserId = searchParams.get('demoUserId');

    // Validate demoUserId is provided
    if (!demoUserId) {
      return NextResponse.json(
        { 
          error: 'Demo user ID is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Validate demoUserId is a valid integer
    const parsedId = parseInt(demoUserId);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { 
          error: 'Valid demo user ID is required',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Query demo user by ID
    const demoUser = await db.select()
      .from(demoUsers)
      .where(eq(demoUsers.id, parsedId))
      .limit(1);

    // Check if demo user exists
    if (demoUser.length === 0) {
      return NextResponse.json(
        { 
          error: 'Demo user not found',
          code: 'USER_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Return demo user with all fields
    return NextResponse.json(
      {
        user: {
          id: demoUser[0].id,
          name: demoUser[0].name,
          email: demoUser[0].email,
          coins: demoUser[0].coins,
          role: demoUser[0].role,
          createdAt: demoUser[0].createdAt,
          lastResetAt: demoUser[0].lastResetAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET demo balance error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}