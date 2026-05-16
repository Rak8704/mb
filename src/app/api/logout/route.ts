// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    // Clear auth cookie
    response.cookies.delete('auth_token');
    
    // Also clear any other auth cookies
    response.cookies.delete('session');
    
    return response;

  } catch (error: any) {
    return NextResponse.json(
      { error: "Logout failed", details: error.message },
      { status: 500 }
    );
  }
}
