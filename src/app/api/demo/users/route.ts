import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { demoUsers } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single demo user by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({
          error: "Valid ID is required",
          code: "INVALID_ID"
        }, { status: 400 });
      }

      const demoUser = await db.select()
        .from(demoUsers)
        .where(eq(demoUsers.id, parseInt(id)))
        .limit(1);

      if (demoUser.length === 0) {
        return NextResponse.json({
          error: 'Demo user not found',
          code: "USER_NOT_FOUND"
        }, { status: 404 });
      }

      return NextResponse.json(demoUser[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = db.select().from(demoUsers);
    let countQuery = db.select().from(demoUsers);

    const conditions = [];

    // Search filter
    if (search) {
      const searchCondition = or(
        like(demoUsers.name, `%${search}%`),
        like(demoUsers.email, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Role filter
    if (role) {
      conditions.push(eq(demoUsers.role, role));
    }

    // Apply conditions
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition) as typeof query;
      countQuery = countQuery.where(whereCondition) as typeof countQuery;
    }

    // Execute queries
    const results = await query
      .orderBy(desc(demoUsers.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResults = await countQuery;
    const total = totalResults.length;

    return NextResponse.json({
      users: results,
      total
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, coins, role } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({
        error: "Name is required",
        code: "MISSING_NAME"
      }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({
        error: "Email is required",
        code: "MISSING_EMAIL"
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Invalid email format",
        code: "INVALID_EMAIL"
      }, { status: 400 });
    }

    // Validate coins if provided
    if (coins !== undefined && coins !== null) {
      if (typeof coins !== 'number' || coins < 0 || !Number.isInteger(coins)) {
        return NextResponse.json({
          error: "Coins must be a positive integer",
          code: "INVALID_COINS"
        }, { status: 400 });
      }
    }

    // Check for duplicate email
    const existingUser = await db.select()
      .from(demoUsers)
      .where(eq(demoUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({
        error: "Email already exists",
        code: "DUPLICATE_EMAIL"
      }, { status: 400 });
    }

    // Prepare insert data
    const now = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      coins: coins !== undefined && coins !== null ? coins : 1000,
      role: role?.trim() || 'demo',
      createdAt: now,
      lastResetAt: now,
    };

    // Insert new demo user
    const newDemoUser = await db.insert(demoUsers)
      .values(insertData)
      .returning();

    return NextResponse.json(newDemoUser[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({
        error: "Email already exists",
        code: "DUPLICATE_EMAIL"
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    // Check if demo user exists
    const existingUser = await db.select()
      .from(demoUsers)
      .where(eq(demoUsers.id, parseInt(id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({
        error: 'Demo user not found',
        code: "USER_NOT_FOUND"
      }, { status: 404 });
    }

    // Delete demo user
    const deleted = await db.delete(demoUsers)
      .where(eq(demoUsers.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Demo user deleted",
      user: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}