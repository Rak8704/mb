import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scrollingMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Fetch all active scrolling messages
export async function GET() {
    try {
        const activeMessages = await db.select()
            .from(scrollingMessages)
            .where(eq(scrollingMessages.isActive, true))
            .orderBy(desc(scrollingMessages.orderIndex), desc(scrollingMessages.id));

        return NextResponse.json({ messages: activeMessages }, { status: 200 });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// POST - Create new scrolling message (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, orderIndex } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const now = new Date().toISOString();
        const newMessage = await db.insert(scrollingMessages).values({
            message,
            orderIndex: orderIndex || 0,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        }).returning();

        return NextResponse.json({ message: newMessage[0] }, { status: 201 });
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// PUT - Update scrolling message (Admin only)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, message, orderIndex, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        const now = new Date().toISOString();
        const updated = await db.update(scrollingMessages)
            .set({
                ...(message && { message }),
                ...(orderIndex !== undefined && { orderIndex }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: now,
            })
            .where(eq(scrollingMessages.id, id))
            .returning();

        return NextResponse.json({ message: updated[0] }, { status: 200 });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// DELETE - Delete scrolling message (Admin only)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }

        await db.delete(scrollingMessages).where(eq(scrollingMessages.id, parseInt(id)));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
