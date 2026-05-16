import { db } from '@/db';
import { referralCodes, user } from '@/db/schema';
import { eq, or, inArray } from 'drizzle-orm';

async function main() {
    // Query existing users from the database
    const targetEmails = [
        'demo1@example.com',
        'demo2@example.com',
        'demo3@example.com',
        'demo4@example.com',
        'demo5@example.com',
        'demo6@example.com',
        'agent1@example.com',
        'agent2@example.com',
    ];

    const existingUsers = await db
        .select({ id: user.id, email: user.email })
        .from(user)
        .where(inArray(user.email, targetEmails));

    if (existingUsers.length === 0) {
        console.log('⚠️  No matching users found. Please seed users table first.');
        return;
    }

    console.log(`Found ${existingUsers.length} users to create referral codes for`);

    // Generate referral codes based on user emails
    const generateReferralCode = (email: string): string => {
        const baseCode = email.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '');
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = baseCode;
        
        while (code.length < 8) {
            code += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        
        return code.substring(0, 8);
    };

    // Create referral codes with varied timestamps from the past 30 days
    const now = new Date();
    const sampleReferralCodes = existingUsers.map((user, index) => {
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const createdDate = new Date(now);
        createdDate.setDate(createdDate.getDate() - daysAgo);
        createdDate.setHours(createdDate.getHours() - hoursAgo);

        return {
            userId: user.id,
            referralCode: generateReferralCode(user.email),
            createdAt: createdDate.toISOString(),
        };
    });

    await db.insert(referralCodes).values(sampleReferralCodes);
    
    console.log('✅ Referral codes seeder completed successfully');
    console.log(`Created ${sampleReferralCodes.length} referral codes`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});