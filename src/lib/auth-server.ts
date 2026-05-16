// lib/auth-server.ts
import mysql from 'mysql2/promise';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "nicebet_sports",
};

// MySQL Database Connection
export async function getMySQLConnection() {
  return await mysql.createConnection(dbConfig);
}

// Server-side user validation
export async function validateToken(token: string) {
  const connection = await getMySQLConnection();
  
  try {
    const [sessions] = await connection.execute(
      "SELECT user_id FROM user_sessions WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    
    if (Array.isArray(sessions) && sessions.length > 0) {
      const session = sessions[0] as any;
      
      // Get user details
      const [users] = await connection.execute(
        "SELECT id, name, email, email_verified, referral_code, referred_by, agent_id FROM user WHERE id = ?",
        [session.user_id]
      );
      
      if (Array.isArray(users) && users.length > 0) {
        const user = users[0] as any;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: Boolean(user.email_verified),
          referralCode: user.referral_code,
          referredBy: user.referred_by,
          agentId: user.agent_id
        };
      }
    }
    
    return null;
  } finally {
    await connection.end();
  }
}

// For compatibility with existing code that might expect auth object
export const auth = {
  api: {
    getSession: async (options?: { headers?: Headers }) => {
      try {
        // Get token from cookies
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        if (!token) {
          return { user: null };
        }
        
        // Validate token
        const user = await validateToken(token);
        
        if (user) {
          return {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              emailVerified: user.emailVerified
            }
          };
        }
        
        return { user: null };
        
      } catch (error) {
        console.error("getSession error:", error);
        return { user: null };
      }
    }
  }
};
