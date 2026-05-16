import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { userBalances, user } from '@/db/schema';
import { eq, isNull, and, not } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// POST - Bulk auto-assign unassigned users to active agents
export async function POST(request: NextRequest) {
    try {
        // 1. Verify Admin Access
        const authHeader = request.headers.get("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);

        // Verify JWT
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (jwtError: any) {
            return NextResponse.json({ 
                valid: false, 
                error: jwtError.message 
            }, { status: 401 });
        }
        
        if (!decoded.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin by querying userBalances (for non-demo admins)
        if (decoded.id !== "admin_demo") {
            const currentUserBalance = await db.select().from(userBalances)
                .where(eq(userBalances.userId, decoded.id))
                .limit(1);

            if (currentUserBalance.length === 0 || currentUserBalance[0].role !== 'admin') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        // 2. Find all active agents
        // 2. Find all active agents
        const agents = await db.select().from(userBalances)
            .where(eq(userBalances.role, 'agent'))
            .all();

        if (agents.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No active agents found to assign users to.'
            }, { status: 400 });
        }

        // 2.5 Fix Missing User Balances (Legacy Support)
        const allAuthUsers = await db.select().from(user).all();
        const allBalances = await db.select().from(userBalances).all();
        const balanceUserIds = new Set(allBalances.map(b => b.userId));

        const missingBalanceUsers = allAuthUsers.filter(u => !balanceUserIds.has(u.id));

        if (missingBalanceUsers.length > 0) {
            console.log(`Found ${missingBalanceUsers.length} users without balance records. Creating them...`);
            const now = new Date().toISOString();

            for (const missingUser of missingBalanceUsers) {
                try {
                    await db.insert(userBalances).values({
                        userId: missingUser.id,
                        coins: 0,
                        role: 'user',
                        agentId: null,
                        createdAt: now,
                        updatedAt: now
                    });
                } catch (e) {
                    console.error(`Failed to create balance for user ${missingUser.id}`, e);
                }
            }
        }

        // 3. Find all unassigned users
        const allUsers = await db.select().from(userBalances)
            .where(eq(userBalances.role, 'user'))
            .all();

        // Include users with null, empty, or 'none' agentId
        const unassignedUsers = allUsers.filter(u => !u.agentId || u.agentId === 'none' || u.agentId === '');

        if (unassignedUsers.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No unassigned users found. Everyone already has an agent!'
            }, { status: 200 });
        }

        console.log(`Found ${unassignedUsers.length} unassigned users and ${agents.length} agents.`);

        // 4. Distribute users among agents (Round Robin)
        const updates = [];
        const now = new Date().toISOString();
        let assignedCount = 0;

        for (let i = 0; i < unassignedUsers.length; i++) {
            const user = unassignedUsers[i];
            const agent = agents[i % agents.length]; // Cycle through agents

            // Update user's agentId
            await db.update(userBalances)
                .set({
                    agentId: agent.userId,
                    updatedAt: now
                })
                .where(eq(userBalances.userId, user.userId));

            assignedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully assigned ${assignedCount} previously unassigned users to ${agents.length} agents.`,
            details: {
                usersAssigned: assignedCount,
                agentCount: agents.length
            }
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Bulk assign error:', error);
        return NextResponse.json({
            error: 'Failed to bulk assign users: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
