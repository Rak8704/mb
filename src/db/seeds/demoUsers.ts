import { db } from '@/db';
import { demoUsers } from '@/db/schema';

async function main() {
    const sampleDemoUsers = [
        {
            name: 'Demo Player',
            email: 'demo1@example.com',
            coins: 1000,
            role: 'demo',
            createdAt: new Date().toISOString(),
            lastResetAt: new Date().toISOString(),
        },
        {
            name: 'Demo Agent',
            email: 'demo2@example.com',
            coins: 5000,
            role: 'demo_agent',
            createdAt: new Date().toISOString(),
            lastResetAt: new Date().toISOString(),
        },
        {
            name: 'Demo VIP',
            email: 'demo3@example.com',
            coins: 10000,
            role: 'demo_vip',
            createdAt: new Date().toISOString(),
            lastResetAt: new Date().toISOString(),
        },
    ];

    await db.insert(demoUsers).values(sampleDemoUsers);
    
    console.log('✅ Demo users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});