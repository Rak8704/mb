import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';



// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Coin/Balance and Betting System Tables
export const userBalances = sqliteTable('user_balances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  coins: integer('coins').notNull().default(0),
  role: text('role').notNull().default('user'),
  agentId: text('agent_id').references(() => user.id, { onDelete: 'set null' }), // Which agent manages this user
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const coinTransactions = sqliteTable('coin_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  gameName: text('game_name'),
  createdByAdminId: text('created_by_admin_id').references(() => user.id),
  createdAt: text('created_at').notNull(),
});

export const bets = sqliteTable('bets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  gameId: text('game_id').notNull(),
  gameName: text('game_name').notNull(),
  amount: integer('amount').notNull(),
  result: text('result').notNull().default('pending'),
  payout: integer('payout').notNull().default(0),
  multiplier: real('multiplier'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Demo System Tables
export const demoUsers = sqliteTable('demo_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  coins: integer('coins').notNull().default(1000),
  role: text('role').notNull().default('demo'),
  createdAt: text('created_at').notNull(),
  lastResetAt: text('last_reset_at').notNull(),
});

export const demoBets = sqliteTable('demo_bets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  demoUserId: integer('demo_user_id').notNull().references(() => demoUsers.id, { onDelete: 'cascade' }),
  gameId: text('game_id').notNull(),
  gameName: text('game_name').notNull(),
  amount: integer('amount').notNull(),
  result: text('result').notNull().default('pending'),
  payout: integer('payout').notNull().default(0),
  multiplier: real('multiplier'),
  createdAt: text('created_at').notNull(),
});

// Social contacts table for storing social media and contact information
export const socialContacts = sqliteTable('social_contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  iconColor: text('icon_color').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add promotions table
export const promotions = sqliteTable('promotions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  buttonText: text('button_text').notNull().default('View'),
  buttonLink: text('button_link'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add referral system tables
export const referralCodes = sqliteTable('referral_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  referralCode: text('referral_code').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  referrerUserId: text('referrer_user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  referredUserId: text('referred_user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  referralCode: text('referral_code').notNull(),
  status: text('status').notNull().default('pending'),
  rewardAmount: real('reward_amount').notNull().default(0),
  createdAt: text('created_at').notNull(),
  completedAt: text('completed_at'),
});

// Binary Options Trading Tables
export const trades = sqliteTable('trades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  asset: text('asset').notNull(), // e.g., "BTC/USD"
  amount: integer('amount').notNull(),
  direction: text('direction').notNull(), // "UP" or "DOWN"
  duration: integer('duration').notNull(), // in seconds
  entryPrice: real('entry_price').notNull(),
  exitPrice: real('exit_price'),
  result: text('result').notNull().default('pending'), // "win", "loss", "pending"
  payout: integer('payout').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  closedAt: integer('closed_at', { mode: 'timestamp' }),
});

export const demoTrades = sqliteTable('demo_trades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  demoUserId: integer('demo_user_id').notNull().references(() => demoUsers.id, { onDelete: 'cascade' }),
  asset: text('asset').notNull(),
  amount: integer('amount').notNull(),
  direction: text('direction').notNull(),
  duration: integer('duration').notNull(),
  entryPrice: real('entry_price').notNull(),
  exitPrice: real('exit_price'),
  result: text('result').notNull().default('pending'),
  payout: integer('payout').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  closedAt: integer('closed_at', { mode: 'timestamp' }),
});

// Announcements table for popup announcements
export const announcements = sqliteTable('announcements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  buttonText: text('button_text').notNull().default('Learn More'),
  buttonLink: text('button_link'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Scrolling messages table for notification banner
export const scrollingMessages = sqliteTable('scrolling_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});