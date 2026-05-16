import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, userBalances } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Demo admin credentials (update these to match your needs)
const DEMO_ADMIN = {
  email: "admin@nicebet.com",
  password: "admin123", // In production, this should be stored securely
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check against demo admin first
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const token = jwt.sign(
        {
          id: "admin_demo",
          email: DEMO_ADMIN.email,
          name: "Admin",
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return NextResponse.json({
        success: true,
        token,
        admin: {
          id: "admin_demo",
          email: DEMO_ADMIN.email,
          name: "Admin",
          role: "admin",
        },
        message: "Login successful",
      });
    }

    // Try to find user in database with admin role
    try {
      const adminUsers = await db
        .select({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: userBalances.role,
        })
        .from(user)
        .innerJoin(userBalances, eq(user.id, userBalances.userId))
        .where(eq(userBalances.role, "admin"));

      const adminUser = adminUsers.find((u) => u.email === email);

      if (!adminUser) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // For now, using demo password validation
      // In production, store hashed passwords in the database
      if (password === DEMO_ADMIN.password) {
        const token = jwt.sign(
          {
            id: adminUser.userId,
            email: adminUser.email,
            name: adminUser.name,
            role: "admin",
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        return NextResponse.json({
          success: true,
          token,
          admin: {
            id: adminUser.userId,
            email: adminUser.email,
            name: adminUser.name,
            role: "admin",
          },
          message: "Login successful",
        });
      } else {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } catch (dbError) {
      // If database fails, fall back to demo admin
      console.warn("Database error, using demo admin", dbError);
      if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
        const token = jwt.sign(
          {
            id: "admin_demo",
            email: DEMO_ADMIN.email,
            name: "Admin",
            role: "admin",
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        return NextResponse.json({
          success: true,
          token,
          admin: {
            id: "admin_demo",
            email: DEMO_ADMIN.email,
            name: "Admin",
            role: "admin",
          },
          message: "Login successful",
        });
      }

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
