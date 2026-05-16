import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, userBalances } from "@/db/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    try {
      // Check if email already exists
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

      // Create new admin user
      const userId = `admin_${uuidv4().replace(/-/g, "").substring(0, 12)}`;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      await db.insert(user).values({
        id: userId,
        name: name,
        email: email,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add admin balance entry
      await db.insert(userBalances).values({
        userId: userId,
        coins: 100000, // Default coins
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Admin account created successfully",
        userId: userId,
      });
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to create admin account", details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
