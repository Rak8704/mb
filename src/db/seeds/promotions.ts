import { db } from '@/db';
import { promotions } from '@/db/schema';

async function main() {
    const samplePromotions = [
        {
            title: 'দৈনিক চ্যাম্পিয়নশিপ পুরস্কার পুল',
            description: 'প্রতিদিন বিশাল পুরস্কার জিতুন! আজই অংশগ্রহণ করুন এবং চ্যাম্পিয়ন হন।',
            imageUrl: '/images/promotions/championship.jpg',
            buttonText: 'এখনই যোগ দিন',
            buttonLink: '/games/championship',
            orderIndex: 1,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'স্বপ্নদ্রষ্টা নিয়োগ কর্মসূচি',
            description: 'আমাদের দলে যোগ দিন এবং বড় আয়ের সুযোগ পান। বিশেষ বোনাস এবং সুবিধা পাবেন।',
            imageUrl: '/images/promotions/recruitment.jpg',
            buttonText: 'আরও জানুন',
            buttonLink: '/promotions/agent-program',
            orderIndex: 2,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            title: 'প্রতিদিন লগইন ভাগ্যবান বোনাস',
            description: 'প্রতিদিন লগইন করুন এবং বিনামূল্যে কয়েন পান! পরপর লগইন করে আরও বেশি জিতুন।',
            imageUrl: '/images/promotions/daily-bonus.jpg',
            buttonText: 'সংগ্রহ করুন',
            buttonLink: '/rewards/daily',
            orderIndex: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(promotions).values(samplePromotions);
    
    console.log('✅ Promotions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});