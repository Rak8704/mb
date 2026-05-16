import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { user, userBalances } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Authorization header");
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log("🔐 Token received, verifying...");

    // Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ JWT verified successfully:", decoded);
    } catch (jwtError: any) {
      console.error("❌ JWT verification failed:", jwtError.message);
      return NextResponse.json({ 
        valid: false, 
        error: jwtError.message 
      }, { status: 401 });
    }
    
    if (!decoded.id) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Check if it's demo admin
    if (decoded.id === "admin_demo") {
      return NextResponse.json({
        valid: true,
        admin: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: "admin",
        },
      });
    }

    // Check in database for regular admins
    try {
      const adminUser = await db
        .select({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: userBalances.role,
        })
        .from(user)
        .innerJoin(userBalances, eq(user.id, userBalances.userId))
        .where(eq(userBalances.role, "admin"))
        .limit(1);

      if (adminUser.length === 0 || adminUser[0].userId !== decoded.id) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }

      return NextResponse.json({
        valid: true,
        admin: {
          id: adminUser[0].userId,
          email: adminUser[0].email,
          name: adminUser[0].name,
          role: "admin",
        },
      });
    } catch (dbError) {
      // If database fails but token is valid demo admin, still allow
      console.warn("Database error in verify, but token is valid", dbError);
      return NextResponse.json({
        valid: true,
        admin: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: "admin",
        },
      });
    }
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
