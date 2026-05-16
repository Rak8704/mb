// app/api/user/balance/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from 'mysql2/promise';

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "nicebet_sports",
};

export async function GET(req: NextRequest) {
    let connection;
    
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        connection = await mysql.createConnection(dbConfig);

        // Check if user exists
        const [users] = await connection.execute(
            "SELECT id FROM user WHERE id = ?",
            [userId]
        );

        if (!Array.isArray(users) || users.length === 0) {
            await connection.end();
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get or create balance
        const [balances] = await connection.execute(
            "SELECT * FROM user_balances WHERE user_id = ?",
            [userId]
        );

        if (Array.isArray(balances) && balances.length > 0) {
            await connection.end();
            return NextResponse.json({ 
                balance: balances[0] 
            });
        }

        // Create new balance
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        // Check for agent assignment
        const [agents] = await connection.execute(
            "SELECT id FROM user WHERE agent_id IS NOT NULL OR role = 'agent' LIMIT 1"
        );
        
        let agentId = null;
        if (Array.isArray(agents) && agents.length > 0) {
            agentId = (agents[0] as any).id;
        }

        // Insert new balance
        await connection.execute(
            `INSERT INTO user_balances 
             (user_id, coins, role, agent_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, 1000, 'user', agentId, now, now]
        );

        // Get the newly created balance
        const [newBalances] = await connection.execute(
            "SELECT * FROM user_balances WHERE user_id = ?",
            [userId]
        );

        await connection.end();

        return NextResponse.json({ 
            balance: Array.isArray(newBalances) && newBalances.length > 0 
                ? newBalances[0] 
                : {
                    user_id: userId,
                    coins: 1000,
                    role: 'user',
                    agent_id: agentId,
                    created_at: now,
                    updated_at: now
                }
        });

    } catch (error: any) {
        console.error("Error in balance API:", error);
        
        if (connection) {
            await connection.end();
        }
        
        return NextResponse.json(
            { 
                error: "Failed to get balance",
                message: error.message 
            }, 
            { status: 500 }
        );
    }
}
