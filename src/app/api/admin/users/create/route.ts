import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances, account, referralCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// POST - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'user', initialCoins = 1000, agentId } = body;

    console.log('Creating user with:', { name, email, role, initialCoins, agentId: agentId || 'none' });

    if (!name || !email || !password) {
      console.log('Validation failed: Missing required fields');
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
    if (existingUser.length > 0) {
      console.log('Validation failed: Email already exists:', email);
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // If agentId is provided and not empty, verify the agent exists and has agent role
    if (agentId && agentId.trim() !== '') {
      console.log('Validating agentId:', agentId);
      const agent = await db.select().from(userBalances).where(eq(userBalances.userId, agentId)).limit(1);
      if (agent.length === 0 || agent[0].role !== 'agent') {
        console.log('Validation failed: Invalid agent or not an agent role');
        return NextResponse.json({ error: 'Invalid agent ID or user is not an agent' }, { status: 400 });
      }
      console.log('Agent validated successfully');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Create user
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create account with password
    await db.insert(account).values({
      id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    // Create user balance with optional agentId
    await db.insert(userBalances).values({
      userId: userId,
      coins: parseInt(initialCoins.toString()) || 1000,
      role: role,
      agentId: (agentId && agentId.trim() !== '') ? agentId : null, // Assign to agent if provided and not empty
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    // If creating an agent, automatically create a referral code
    if (role === 'agent') {
      const referralCode = `AGENT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      await db.insert(referralCodes).values({
        userId: userId,
        referralCode: referralCode,
        createdAt: now.toISOString(),
      });
      console.log('✅ Agent created with referral code:', referralCode);
    } else {
      console.log('✅ User created successfully');
    }

    return NextResponse.json({
      success: true,
      message: `${role === 'agent' ? 'Agent' : 'User'} created successfully`,
      userId
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Create user error:', error);
    return NextResponse.json({
      error: 'Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}