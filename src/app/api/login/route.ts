// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "nicebet_sports",
};

export async function POST(request: NextRequest) {
  let connection;
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Database connection
    connection = await mysql.createConnection(dbConfig);
    
    // Find user by email
    const [users] = await connection.execute(
      `SELECT id, name, email, password, email_verified, 
              referral_code, referred_by, agent_id, 
              created_at 
       FROM user WHERE email = ?`,
      [email.toLowerCase().trim()]
    );

    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0] as any;
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      await connection.end();
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified (optional)
    if (!user.email_verified) {
      // You can add email verification logic here
      console.log("User email not verified yet");
    }

    // Generate token (in production use JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    
    // Update last login time (optional)
    await connection.execute(
      "UPDATE user SET updated_at = NOW() WHERE id = ?",
      [user.id]
    );

    await connection.end();

    // Prepare user data for frontend (remove password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.email_verified,
      referralCode: user.referral_code,
      referredBy: user.referred_by,
      agentId: user.agent_id,
      createdAt: user.created_at
    };

    // Set cookie for remember me
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: userData,
      token: `Bearer ${token}`
    });

    if (rememberMe) {
      // Set cookie for 30 days
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
    } else {
      // Set session cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
      });
    }

    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    
    if (connection) {
      await connection.end();
    }
    
    return NextResponse.json(
      { 
        error: "Login failed", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
