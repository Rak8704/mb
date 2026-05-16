import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { createAuthMiddleware } from "better-auth/api";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
import { userBalances } from "@/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 6, // Reduced from default 8
		maxPasswordLength: 128,
	},
	plugins: [bearer()],
	trustedOrigins: process.env.NODE_ENV === 'development'
		? [
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
			"http://127.0.0.1:3002",
			"http://192.168.1.4:3000",
			"http://192.168.1.4:3001",
			"http://192.168.1.4:3002",
			"http://10.214.240.189:3000",
			"http://10.214.240.189:3001",
			"http://10.214.240.189:3002",
			"http://192.168.1.2:3000",
			"http://192.168.1.2:3001",
			"http://192.168.1.2:3002"
		]
		: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			// Only run for signup endpoints
			if (!ctx.path?.startsWith('/sign-up')) {
				return;
			}

			// Only proceed if a new user was created
			const newUser = ctx.context?.newUser;
			if (!newUser) {
				return;
			}

			const userId = newUser.id;
			const now = new Date().toISOString();

			try {
				// Check if userBalances record already exists
				const existingBalance = await db.select()
					.from(userBalances)
					.where(eq(userBalances.userId, userId))
					.limit(1);

				if (existingBalance.length > 0) {
					console.log('✅ UserBalance already exists for:', userId);
					return;
				}

				// Find all active agents
				const agents = await db.select()
					.from(userBalances)
					.where(eq(userBalances.role, 'agent'))
					.all();

				let assignedAgentId = null;

				if (agents.length > 0) {
					// Randomly select an agent
					const randomAgent = agents[Math.floor(Math.random() * agents.length)];
					assignedAgentId = randomAgent.userId;
					console.log(`🤖 Auto-assigning user ${userId} to agent ${assignedAgentId}`);
				} else {
					console.log('⚠️ No agents available for auto-assignment');
				}

				// Create userBalances record with agent assignment
				await db.insert(userBalances).values({
					userId,
					coins: 1000, // Welcome bonus
					role: 'user',
					agentId: assignedAgentId,
					createdAt: now,
					updatedAt: now,
				});

				console.log(`✅ Created userBalance for ${userId}${assignedAgentId ? ` and assigned to agent ${assignedAgentId}` : ''}`);
			} catch (error) {
				console.error('❌ Error in signup hook:', error);
				// Don't throw - allow signup to complete even if this fails
			}
		})
	}
});

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
	const session = await auth.api.getSession({ headers: await headers() });
	return session?.user || null;
}