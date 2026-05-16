import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoBets } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate required demoUserId parameter
    const demoUserIdParam = searchParams.get('demoUserId');
    if (!demoUserIdParam) {
      return NextResponse.json(
        { 
          error: 'Demo user ID is required',
          code: 'MISSING_USER_ID' 
        },
        { status: 400 }
      );
    }

    const demoUserId = parseInt(demoUserIdParam);
    if (isNaN(demoUserId)) {
      return NextResponse.json(
        { 
          error: 'Demo user ID must be a valid integer',
          code: 'INVALID_USER_ID' 
        },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Parse and validate result filter
    const resultFilter = searchParams.get('result');
    if (resultFilter && !['pending', 'won', 'lost'].includes(resultFilter)) {
      return NextResponse.json(
        { 
          error: 'Invalid result filter. Must be one of: pending, won, lost',
          code: 'INVALID_RESULT_FILTER' 
        },
        { status: 400 }
      );
    }

    // Build where conditions
    const whereConditions = [eq(demoBets.demoUserId, demoUserId)];
    
    if (resultFilter) {
      whereConditions.push(eq(demoBets.result, resultFilter));
    }

    const whereClause = whereConditions.length > 1 
      ? and(...whereConditions)
      : whereConditions[0];

    // Get bets with filters and pagination
    const betsData = await db.select()
      .from(demoBets)
      .where(whereClause)
      .orderBy(desc(demoBets.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination metadata
    const totalCountResult = await db.select({ count: count() })
      .from(demoBets)
      .where(whereClause);

    const total = totalCountResult[0]?.count || 0;

    return NextResponse.json(
      {
        bets: betsData,
        total,
        limit,
        offset
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('GET demo bets history error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}