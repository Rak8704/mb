// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userBalances, referralCodes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, referralCode } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique ID
    const userId = `user_${uuidv4()}`;

    // Generate unique referral code for new user
    const userReferralCode = `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Insert user into database
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ============================================
    // 🎯 AUTO-ASSIGN USER TO AGENT
    // ============================================
    const now = new Date().toISOString();
    let assignedAgentId = null;

    // Check if referral code is provided
    if (referralCode && referralCode.trim() !== '') {
      console.log('📝 Registration with referral code:', referralCode);
      
      // Find the referral code owner
      const refCodes = await db.select().from(referralCodes)
        .where(eq(referralCodes.referralCode, referralCode.toUpperCase()))
        .limit(1);

      if (refCodes.length > 0) {
        assignedAgentId = refCodes[0].userId;
        console.log('✅ User will be assigned to referral code owner:', assignedAgentId);
      } else {
        console.log('⚠️ Invalid referral code provided, will auto-assign to random agent');
      }
    }

    // If no referral code, auto-assign to a random active agent
    if (!assignedAgentId) {
      const agents = await db.select().from(userBalances)
        .where(eq(userBalances.role, 'agent'))
        .all();

      if (agents.length > 0) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        assignedAgentId = randomAgent.userId;
        console.log('🤖 Auto-assigned user to random agent:', assignedAgentId);
      } else {
        console.log('ℹ️ No agents available, user will not be assigned');
      }
    }

    // Create user balance with role='user' (NOT agent) and assigned agent
    await db.insert(userBalances).values({
      userId: userId,
      coins: 1000, // Welcome bonus
      role: 'user', // 🔴 ALWAYS 'user' at registration
      agentId: assignedAgentId, // Assign to agent
      createdAt: now,
      updatedAt: now,
    });

    console.log(`✅ User '${email}' registered as 'user' (not agent), assigned to agent:`, assignedAgentId || 'none');

    // Generate token (simplified - in production use JWT)
    const token = Buffer.from(`${userId}:${email}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: {
        id: userId,
        name,
        email,
        referralCode: userReferralCode,
      },
      token: `Bearer ${token}`
    });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", details: error.message },
      { status: 500 }
    );
  }
}
