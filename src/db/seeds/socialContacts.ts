import { db } from '@/db';
import { socialContacts } from '@/db/schema';

async function main() {
    const sampleContacts = [
        {
            platform: 'whatsapp',
            label: 'WhatsApp',
            value: '+231770123456',
            iconColor: '#25D366',
            isActive: true,
            displayOrder: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            platform: 'telegram',
            label: 'Telegram',
            value: 'https://t.me/nicebet_support',
            iconColor: '#0088cc',
            isActive: true,
            displayOrder: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            platform: 'facebook',
            label: 'Facebook Page',
            value: 'https://facebook.com/nicebet.official',
            iconColor: '#1877F2',
            isActive: true,
            displayOrder: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            platform: 'support',
            label: 'Customer Support',
            value: '+231886543210',
            iconColor: '#00897B',
            isActive: true,
            displayOrder: 4,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(socialContacts).values(sampleContacts);
    
    console.log('✅ Social contacts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});