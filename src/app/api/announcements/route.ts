import { NextResponse } from 'next/server';
import { db } from '@/db';
import { announcements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Fetch all active announcements
export async function GET() {
    try {
        const activeAnnouncements = await db.select()
            .from(announcements)
            .where(eq(announcements.isActive, true))
            .orderBy(desc(announcements.orderIndex), desc(announcements.id));

        return NextResponse.json({ announcements: activeAnnouncements }, { status: 200 });
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// POST - Create new announcement (Admin only)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrl, buttonText, buttonLink, orderIndex } = body;

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const now = new Date().toISOString();
        const newAnnouncement = await db.insert(announcements).values({
            title,
            description,
            imageUrl: imageUrl || null,
            buttonText: buttonText || 'Learn More',
            buttonLink: buttonLink || null,
            orderIndex: orderIndex || 0,
            isActive: true,
            createdAt: now,
            updatedAt: now,
        }).returning();

        return NextResponse.json({ announcement: newAnnouncement[0] }, { status: 201 });
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// PUT - Update announcement (Admin only)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, imageUrl, buttonText, buttonLink, orderIndex, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
        }

        const now = new Date().toISOString();
        const updated = await db.update(announcements)
            .set({
                ...(title && { title }),
                ...(description && { description }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(buttonText && { buttonText }),
                ...(buttonLink !== undefined && { buttonLink }),
                ...(orderIndex !== undefined && { orderIndex }),
                ...(isActive !== undefined && { isActive }),
                updatedAt: now,
            })
            .where(eq(announcements.id, id))
            .returning();

        return NextResponse.json({ announcement: updated[0] }, { status: 200 });
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}

// DELETE - Delete announcement (Admin only)
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 });
        }

        await db.delete(announcements).where(eq(announcements.id, parseInt(id)));

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
