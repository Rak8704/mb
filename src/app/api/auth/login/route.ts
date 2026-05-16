import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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
    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    
    // Find user by email
    const [users] = await connection.execute(
      `SELECT id, name, email, password, email_verified, 
              referral_code, referred_by, agent_id, 
              created_at FROM user WHERE email = ?`,
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

    // Generate token
    const token = Buffer.from(`${Date.now()}:${user.id}:${user.email}`).toString('base64');
    
    // Store session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1));
    
    await connection.execute(
      "INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );
    
    // Cleanup old sessions
    await connection.execute(
      "DELETE FROM user_sessions WHERE expires_at <= NOW()"
    );
    
    // Ensure user_balances exists
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_balances (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          coins INT DEFAULT 1000,
          role ENUM('user', 'agent', 'admin') DEFAULT 'user',
          agent_id VARCHAR(255) NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user (user_id)
        )
      `);
      
      // Check if balance exists
      const [balances] = await connection.execute(
        "SELECT * FROM user_balances WHERE user_id = ?",
        [user.id]
      );
      
      if (!Array.isArray(balances) || balances.length === 0) {
        await connection.execute(
          `INSERT INTO user_balances (user_id, coins, role, agent_id) VALUES (?, ?, ?, ?)`,
          [user.id, 1000, 'user', user.agent_id]
        );
      }
    } catch (balanceError) {
      console.warn("Balance creation failed:", balanceError);
    }

    await connection.end();

    // Prepare user data
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: Boolean(user.email_verified),
      referralCode: user.referral_code,
      referredBy: user.referred_by,
      agentId: user.agent_id,
      createdAt: user.created_at
    };

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      data: userData,
      token: token
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error("Login error:", error);
    
    if (connection) {
      await connection.end();
    }
    
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 }
    );
  }
}
