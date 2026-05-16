import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "nicebet_sports",
};

export async function POST(request: NextRequest) {
  let connection;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Remove session from database
    if (token) {
      connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        "DELETE FROM user_sessions WHERE token = ?",
        [token]
      );
      await connection.end();
    }

    // Clear cookie
    cookieStore.delete('auth_token');
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    response.cookies.delete('auth_token');

    return response;

  } catch (error: any) {
    console.error("Logout error:", error);
    
    if (connection) {
      await connection.end();
    }
    
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    
    return NextResponse.json(
      { success: true, message: "Logged out (with cleanup)" },
      { status: 200 }
    );
  }
}
