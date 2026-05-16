import { db } from '@/db';
import { referrals, referralCodes, user } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

async function main() {
    // Query referrer users (users with referral codes)
    const referrerEmails = ['demo1@example.com', 'demo2@example.com', 'demo3@example.com'];
    const referrers = await db.select().from(user).where(inArray(user.email, referrerEmails));
    
    if (referrers.length === 0) {
        throw new Error('No referrer users found. Please seed users first.');
    }

    // Query their referral codes
    const referrerUserIds = referrers.map(u => u.id);
    const referralCodesData = await db.select().from(referralCodes).where(inArray(referralCodes.userId, referrerUserIds));
    
    if (referralCodesData.length === 0) {
        throw new Error('No referral codes found. Please seed referralCodes first.');
    }

    // Create a map of userId to referral code
    const userIdToCodeMap = new Map(referralCodesData.map(rc => [rc.userId, rc.referralCode]));

    // Query referred users
    const referredEmails = ['demo4@example.com', 'demo5@example.com', 'demo6@example.com', 'agent1@example.com', 'agent2@example.com', 'agent3@example.com'];
    const referredUsers = await db.select().from(user).where(inArray(user.email, referredEmails));
    
    if (referredUsers.length < 6) {
        throw new Error('Not enough referred users found. Please seed users first.');
    }

    // Get user IDs by email for easier reference
    const getUserIdByEmail = (email: string) => {
        const foundUser = [...referrers, ...referredUsers].find(u => u.email === email);
        return foundUser?.id || '';
    };

    const demo1Id = getUserIdByEmail('demo1@example.com');
    const demo2Id = getUserIdByEmail('demo2@example.com');
    const demo3Id = getUserIdByEmail('demo3@example.com');
    const demo4Id = getUserIdByEmail('demo4@example.com');
    const demo5Id = getUserIdByEmail('demo5@example.com');
    const demo6Id = getUserIdByEmail('demo6@example.com');
    const agent1Id = getUserIdByEmail('agent1@example.com');
    const agent2Id = getUserIdByEmail('agent2@example.com');
    const agent3Id = getUserIdByEmail('agent3@example.com');

    const demo1Code = userIdToCodeMap.get(demo1Id) || '';
    const demo2Code = userIdToCodeMap.get(demo2Id) || '';
    const demo3Code = userIdToCodeMap.get(demo3Id) || '';

    // Generate timestamps from past 30 days
    const now = new Date();
    const getRandomPastDate = (daysAgo: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
        return date.toISOString();
    };

    const getCompletedDate = (createdAt: string, hoursLater: number) => {
        const date = new Date(createdAt);
        date.setHours(date.getHours() + hoursLater);
        return date.toISOString();
    };

    // Create referral records
    // 8 rewarded (60%), 3 completed (25%), 2 pending (15%)
    const sampleReferrals = [
        // demo1@example.com refers demo4@example.com - REWARDED
        {
            referrerUserId: demo1Id,
            referredUserId: demo4Id,
            referralCode: demo1Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(28),
            completedAt: getCompletedDate(getRandomPastDate(28), 24),
        },
        // demo1@example.com refers demo5@example.com - REWARDED
        {
            referrerUserId: demo1Id,
            referredUserId: demo5Id,
            referralCode: demo1Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(25),
            completedAt: getCompletedDate(getRandomPastDate(25), 36),
        },
        // demo1@example.com refers agent1@example.com - REWARDED
        {
            referrerUserId: demo1Id,
            referredUserId: agent1Id,
            referralCode: demo1Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(22),
            completedAt: getCompletedDate(getRandomPastDate(22), 48),
        },
        // demo1@example.com refers agent2@example.com - COMPLETED
        {
            referrerUserId: demo1Id,
            referredUserId: agent2Id,
            referralCode: demo1Code,
            status: 'completed',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(18),
            completedAt: getCompletedDate(getRandomPastDate(18), 18),
        },
        // demo2@example.com refers demo6@example.com - REWARDED
        {
            referrerUserId: demo2Id,
            referredUserId: demo6Id,
            referralCode: demo2Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(20),
            completedAt: getCompletedDate(getRandomPastDate(20), 30),
        },
        // demo2@example.com refers agent3@example.com - REWARDED
        {
            referrerUserId: demo2Id,
            referredUserId: agent3Id,
            referralCode: demo2Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(15),
            completedAt: getCompletedDate(getRandomPastDate(15), 42),
        },
        // demo3@example.com referrals - REWARDED
        {
            referrerUserId: demo3Id,
            referredUserId: referredUsers[0]?.id || demo4Id,
            referralCode: demo3Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(12),
            completedAt: getCompletedDate(getRandomPastDate(12), 28),
        },
        // demo3@example.com - REWARDED
        {
            referrerUserId: demo3Id,
            referredUserId: referredUsers[1]?.id || demo5Id,
            referralCode: demo3Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(10),
            completedAt: getCompletedDate(getRandomPastDate(10), 52),
        },
        // Additional COMPLETED records
        {
            referrerUserId: demo1Id,
            referredUserId: referredUsers[2]?.id || demo6Id,
            referralCode: demo1Code,
            status: 'completed',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(8),
            completedAt: getCompletedDate(getRandomPastDate(8), 20),
        },
        {
            referrerUserId: demo2Id,
            referredUserId: referredUsers[3]?.id || agent1Id,
            referralCode: demo2Code,
            status: 'completed',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(6),
            completedAt: getCompletedDate(getRandomPastDate(6), 38),
        },
        // PENDING records
        {
            referrerUserId: demo1Id,
            referredUserId: referredUsers[4]?.id || agent2Id,
            referralCode: demo1Code,
            status: 'pending',
            rewardAmount: 0.0,
            createdAt: getRandomPastDate(3),
            completedAt: null,
        },
        {
            referrerUserId: demo3Id,
            referredUserId: referredUsers[5]?.id || agent3Id,
            referralCode: demo3Code,
            status: 'pending',
            rewardAmount: 0.0,
            createdAt: getRandomPastDate(1),
            completedAt: null,
        },
        // Additional REWARDED record to reach 13
        {
            referrerUserId: demo2Id,
            referredUserId: referredUsers[0]?.id || demo4Id,
            referralCode: demo2Code,
            status: 'rewarded',
            rewardAmount: 500.0,
            createdAt: getRandomPastDate(14),
            completedAt: getCompletedDate(getRandomPastDate(14), 62),
        },
    ];

    // Filter out any duplicate referredUserId entries and invalid records
    const seenReferredIds = new Set<string>();
    const validReferrals = sampleReferrals.filter(ref => {
        if (!ref.referrerUserId || !ref.referredUserId || !ref.referralCode) {
            return false;
        }
        if (seenReferredIds.has(ref.referredUserId)) {
            return false;
        }
        seenReferredIds.add(ref.referredUserId);
        return true;
    });

    await db.insert(referrals).values(validReferrals);
    
    console.log(`✅ Referrals seeder completed successfully - ${validReferrals.length} records created`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});