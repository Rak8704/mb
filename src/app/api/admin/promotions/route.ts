import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { promotions } from '@/db/schema';
import { eq, like, or, desc, asc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single promotion by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const promotion = await db
        .select()
        .from(promotions)
        .where(eq(promotions.id, parseInt(id)))
        .limit(1);

      if (promotion.length === 0) {
        return NextResponse.json(
          { error: 'Promotion not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(promotion[0]);
    }

    // List promotions with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');

    const conditions = [];

    // Filter by isActive if provided
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(promotions.isActive, isActiveValue));
    }

    // Search in title and description
    if (search) {
      const searchCondition = or(
        like(promotions.title, `%${search}%`),
        like(promotions.description, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Build query with conditions
    let queryBuilder = db.select().from(promotions);

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions)) as typeof queryBuilder;
    }

    const results = await queryBuilder
      .orderBy(asc(promotions.orderIndex), desc(promotions.id))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    let countQueryBuilder = db.select().from(promotions);

    if (conditions.length > 0) {
      countQueryBuilder = countQueryBuilder.where(and(...conditions)) as typeof countQueryBuilder;
    }

    const totalRecords = await countQueryBuilder;
    const total = totalRecords.length;

    return NextResponse.json({
      promotions: results,
      total: total,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, buttonText, buttonLink, orderIndex, isActive } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required and must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (orderIndex !== undefined && (typeof orderIndex !== 'number' || isNaN(orderIndex))) {
      return NextResponse.json(
        { error: 'Order index must be a valid integer', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const now = new Date().toISOString();
    const insertData = {
      title: title.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl.trim(),
      buttonText: buttonText?.trim() || 'View',
      buttonLink: buttonLink?.trim() || null,
      orderIndex: orderIndex ?? 0,
      isActive: isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const newPromotion = await db
      .insert(promotions)
      .values(insertData)
      .returning();

    return NextResponse.json(newPromotion[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if promotion exists
    const existing = await db
      .select()
      .from(promotions)
      .where(eq(promotions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, buttonText, buttonLink, orderIndex, isActive } = body;

    // Validate fields if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (imageUrl !== undefined && (typeof imageUrl !== 'string' || imageUrl.trim() === '')) {
      return NextResponse.json(
        { error: 'Image URL must be a non-empty string', code: 'INVALID_IMAGE_URL' },
        { status: 400 }
      );
    }

    if (orderIndex !== undefined && (typeof orderIndex !== 'number' || isNaN(orderIndex))) {
      return NextResponse.json(
        { error: 'Order index must be a valid integer', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    if (isActive !== undefined && typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (buttonText !== undefined) updateData.buttonText = buttonText.trim();
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink?.trim() || null;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await db
      .update(promotions)
      .set(updateData)
      .where(eq(promotions.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if promotion exists
    const existing = await db
      .select()
      .from(promotions)
      .where(eq(promotions.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(promotions)
      .where(eq(promotions.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully',
      promotion: deleted[0],
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}