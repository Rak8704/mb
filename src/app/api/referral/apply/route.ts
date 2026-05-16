import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { referralCodes, referrals, userBalances } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// POST - Apply referral code when user signs up
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { referralCode } = body;

        if (!referralCode || referralCode.trim() === '') {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        // Get user from Bearer token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
        const token = authHeader.substring(7);
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const currentUserId = decoded.id;
        console.log('Applying referral code:', referralCode, 'for user:', currentUserId);

        // Find the referral code
        const refCodes = await db.select().from(referralCodes)
            .where(eq(referralCodes.referralCode, referralCode.toUpperCase()))
            .limit(1);

        if (refCodes.length === 0) {
            console.log('❌ Invalid referral code:', referralCode);
            return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
        }

        const refCode = refCodes[0];
        const referrerUserId = refCode.userId;

        // Don't allow self-referral
        if (referrerUserId === currentUserId) {
            return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 });
        }

        // Check if user already has a referral
        const existingReferrals = await db.select().from(referrals)
            .where(eq(referrals.referredUserId, currentUserId))
            .limit(1);

        if (existingReferrals.length > 0) {
            return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 });
        }

        console.log('Referrer user ID:', referrerUserId);

        // Get referrer's current role
        const referrerBalances = await db.select().from(userBalances)
            .where(eq(userBalances.userId, referrerUserId))
            .limit(1);

        if (referrerBalances.length === 0) {
            return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
        }

        const referrerBalance = referrerBalances[0];
        const now = new Date();
        let wasPromoted = false;

        // **AUTOMATICALLY PROMOTE REFERRER TO AGENT** if not already an agent
        if (referrerBalance.role !== 'agent' && referrerBalance.role !== 'admin') {
            console.log('🎉 Promoting user to agent:', referrerUserId);

            await db.update(userBalances)
                .set({
                    role: 'agent',
                    updatedAt: now.toISOString()
                })
                .where(eq(userBalances.userId, referrerUserId));

            // Create referral code for the newly promoted agent if they don't have one
            const existingCode = await db.select().from(referralCodes)
                .where(eq(referralCodes.userId, referrerUserId))
                .limit(1);

            if (existingCode.length === 0) {
                const newReferralCode = `AGENT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
                await db.insert(referralCodes).values({
                    userId: referrerUserId,
                    referralCode: newReferralCode,
                    createdAt: now.toISOString(),
                });
                console.log('✅ Created referral code for new agent:', newReferralCode);
            }

            wasPromoted = true;
            console.log('✅ User promoted to agent successfully');
        }

        // Assign current user to the referrer (now an agent)
        await db.update(userBalances)
            .set({
                agentId: referrerUserId,
                updatedAt: now.toISOString()
            })
            .where(eq(userBalances.userId, currentUserId));

        console.log('✅ User assigned to agent');

        // Create referral record
        await db.insert(referrals).values({
            referrerUserId: referrerUserId,
            referredUserId: currentUserId,
            referralCode: referralCode.toUpperCase(),
            status: 'completed',
            rewardAmount: 100, // Default reward amount
            createdAt: now.toISOString(),
            completedAt: now.toISOString(),
        });

        console.log('✅ Referral record created');

        return NextResponse.json({
            success: true,
            message: wasPromoted
                ? 'Referral code applied! Your referrer has been promoted to agent and you have been assigned to them.'
                : 'Referral code applied successfully! You have been assigned to an agent.',
            referrerPromoted: wasPromoted
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Apply referral error:', error);
        return NextResponse.json({
            error: 'Failed to apply referral code: ' + (error instanceof Error ? error.message : 'Unknown error')
        }, { status: 500 });
    }
}
