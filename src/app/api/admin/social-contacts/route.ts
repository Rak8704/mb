import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialContacts, userBalances } from '@/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

async function verifyAdmin(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return { authorized: false, response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }

  const userBalance = await db.select()
    .from(userBalances)
    .where(eq(userBalances.userId, user.id))
    .limit(1);

  if (userBalance.length === 0 || userBalance[0].role !== 'admin') {
    return { authorized: false, response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  }

  return { authorized: true, user };
}

export async function GET(request: NextRequest) {
  try {
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        }, { status: 400 });
      }

      const contact = await db.select()
        .from(socialContacts)
        .where(eq(socialContacts.id, parseInt(id)))
        .limit(1);

      if (contact.length === 0) {
        return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
      }

      return NextResponse.json(contact[0]);
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const platform = searchParams.get('platform');
    const isActiveParam = searchParams.get('isActive');

    let query = db.select().from(socialContacts);
    const conditions = [];

    if (platform) {
      conditions.push(eq(socialContacts.platform, platform));
    }

    if (isActiveParam !== null) {
      const isActive = isActiveParam === 'true';
      conditions.push(eq(socialContacts.isActive, isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const contacts = await query
      .orderBy(asc(socialContacts.displayOrder), desc(socialContacts.createdAt))
      .limit(limit)
      .offset(offset);

    let totalQuery = db.select({ count: socialContacts.id }).from(socialContacts);
    if (conditions.length > 0) {
      totalQuery = totalQuery.where(and(...conditions)) as typeof totalQuery;
    }
    const totalResult = await totalQuery;
    const total = totalResult.length;

    return NextResponse.json({ contacts, total });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const body = await request.json();
    const { platform, label, value, iconColor, isActive = true, displayOrder = 0 } = body;

    if (!platform || typeof platform !== 'string' || platform.trim() === '') {
      return NextResponse.json({
        error: 'Platform is required and must be a non-empty string',
        code: 'MISSING_PLATFORM'
      }, { status: 400 });
    }

    if (!label || typeof label !== 'string' || label.trim() === '') {
      return NextResponse.json({
        error: 'Label is required and must be a non-empty string',
        code: 'MISSING_LABEL'
      }, { status: 400 });
    }

    if (!value || typeof value !== 'string' || value.trim() === '') {
      return NextResponse.json({
        error: 'Value is required and must be a non-empty string',
        code: 'MISSING_VALUE'
      }, { status: 400 });
    }

    if (!iconColor || typeof iconColor !== 'string' || iconColor.trim() === '') {
      return NextResponse.json({
        error: 'Icon color is required and must be a non-empty string',
        code: 'MISSING_ICON_COLOR'
      }, { status: 400 });
    }

    const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!hexColorRegex.test(iconColor)) {
      return NextResponse.json({
        error: 'Icon color must be a valid hex color format (#RGB or #RRGGBB)',
        code: 'INVALID_ICON_COLOR_FORMAT'
      }, { status: 400 });
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({
        error: 'isActive must be a boolean',
        code: 'INVALID_IS_ACTIVE_TYPE'
      }, { status: 400 });
    }

    if (typeof displayOrder !== 'number' || !Number.isInteger(displayOrder)) {
      return NextResponse.json({
        error: 'displayOrder must be an integer',
        code: 'INVALID_DISPLAY_ORDER_TYPE'
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newContact = await db.insert(socialContacts)
      .values({
        platform: platform.trim(),
        label: label.trim(),
        value: value.trim(),
        iconColor: iconColor.trim(),
        isActive,
        displayOrder,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newContact[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const existingContact = await db.select()
      .from(socialContacts)
      .where(eq(socialContacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, any> = {};

    if (body.platform !== undefined) {
      if (typeof body.platform !== 'string' || body.platform.trim() === '') {
        return NextResponse.json({
          error: 'Platform must be a non-empty string',
          code: 'INVALID_PLATFORM'
        }, { status: 400 });
      }
      updates.platform = body.platform.trim();
    }

    if (body.label !== undefined) {
      if (typeof body.label !== 'string' || body.label.trim() === '') {
        return NextResponse.json({
          error: 'Label must be a non-empty string',
          code: 'INVALID_LABEL'
        }, { status: 400 });
      }
      updates.label = body.label.trim();
    }

    if (body.value !== undefined) {
      if (typeof body.value !== 'string' || body.value.trim() === '') {
        return NextResponse.json({
          error: 'Value must be a non-empty string',
          code: 'INVALID_VALUE'
        }, { status: 400 });
      }
      updates.value = body.value.trim();
    }

    if (body.iconColor !== undefined) {
      if (typeof body.iconColor !== 'string' || body.iconColor.trim() === '') {
        return NextResponse.json({
          error: 'Icon color must be a non-empty string',
          code: 'INVALID_ICON_COLOR'
        }, { status: 400 });
      }
      const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
      if (!hexColorRegex.test(body.iconColor)) {
        return NextResponse.json({
          error: 'Icon color must be a valid hex color format (#RGB or #RRGGBB)',
          code: 'INVALID_ICON_COLOR_FORMAT'
        }, { status: 400 });
      }
      updates.iconColor = body.iconColor.trim();
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json({
          error: 'isActive must be a boolean',
          code: 'INVALID_IS_ACTIVE_TYPE'
        }, { status: 400 });
      }
      updates.isActive = body.isActive;
    }

    if (body.displayOrder !== undefined) {
      if (typeof body.displayOrder !== 'number' || !Number.isInteger(body.displayOrder)) {
        return NextResponse.json({
          error: 'displayOrder must be an integer',
          code: 'INVALID_DISPLAY_ORDER_TYPE'
        }, { status: 400 });
      }
      updates.displayOrder = body.displayOrder;
    }

    updates.updatedAt = new Date().toISOString();

    const updatedContact = await db.update(socialContacts)
      .set(updates)
      .where(eq(socialContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedContact[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await verifyAdmin(request);
    if (!authCheck.authorized) {
      return authCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const existingContact = await db.select()
      .from(socialContacts)
      .where(eq(socialContacts.id, parseInt(id)))
      .limit(1);

    if (existingContact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const deleted = await db.delete(socialContacts)
      .where(eq(socialContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Contact deleted successfully',
      contact: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error as Error).message
    }, { status: 500 });
  }
}