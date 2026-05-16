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

    // Database connection
    connection = await mysql.createConnection(dbConfig);
    
    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Handle referral code
    let referredBy = null;
    let agentId = null;

    if (referralCode && referralCode.trim() !== '') {
      const [referrerUsers] = await connection.execute(
        "SELECT id, agent_id FROM user WHERE referral_code = ? OR id = ?",
        [referralCode.trim(), referralCode.trim()]
      );

      if (Array.isArray(referrerUsers) && referrerUsers.length > 0) {
        const referrer = referrerUsers[0] as any;
        referredBy = referrer.id;
        agentId = referrer.agent_id || null;
      }
    }

    // Generate unique referral code for new user
    const userReferralCode = `REF${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Insert user into database
    await connection.execute(
      `INSERT INTO user (id, name, email, password, referral_code, referred_by, agent_id, email_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, hashedPassword, userReferralCode, referredBy, agentId, 0]
    );

    // Create user balance
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
      
      await connection.execute(
        `INSERT INTO user_balances 
         (user_id, coins, role, agent_id) 
         VALUES (?, ?, ?, ?)`,
        [userId, 1000, 'user', agentId]
      );
    } catch (balanceError) {
      console.warn("Balance creation failed:", balanceError);
    }

    await connection.end();

    // Generate token
    const token = Buffer.from(`${Date.now()}:${userId}:${email}`).toString('base64');

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        id: userId,
        name,
        email,
        referralCode: userReferralCode,
        referredBy,
        agentId
      },
      token: token
    });

  } catch (error: any) {
    console.error("Registration error:", error);
    
    if (connection) {
      await connection.end();
    }
    
    return NextResponse.json(
      { 
        error: "Registration failed", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
