-- Migration: Add agentId to user_balances table
-- Date: 2025-12-05
-- Purpose: Enable agent-user relationships for commission tracking

-- Add agentId column to user_balances table
ALTER TABLE user_balances ADD COLUMN agent_id TEXT REFERENCES user(id) ON DELETE SET NULL;

-- Create index for faster agent-user lookups
CREATE INDEX idx_user_balances_agent_id ON user_balances(agent_id);
