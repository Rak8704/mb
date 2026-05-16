import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { referrals, referralCodes, user, userBalances } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const agentId = searchParams.get("agentId");

        if (!agentId) {
            return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
        }

        // Get agent's referral code
        const agentCodes = await db.select()
            .from(referralCodes)
            .where(eq(referralCodes.userId, agentId));

        const agentCode = agentCodes[0]?.referralCode || null;

        // Get users assigned to this agent (from userBalances)
        const agentUsers = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            // For auto-assigned users, we might not have a referral record, so we mock these or fetch if exists
            // status: userBalances.status, // userBalances doesn't have status
            assignedAt: userBalances.updatedAt // When they were assigned/last updated
        })
            .from(userBalances)
            .innerJoin(user, eq(userBalances.userId, user.id))
            .where(eq(userBalances.agentId, agentId));

        // Format for frontend
        const formattedUsers = agentUsers.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt,
            status: 'active', // Default status as active since they are in the system
            rewardAmount: 0, // Calculate if needed
            joinedAt: u.assignedAt || u.createdAt
        }));

        return NextResponse.json({
            referralCode: agentCode,
            referrals: formattedUsers
        });

    } catch (error) {
        console.error("Error fetching agent referrals:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
