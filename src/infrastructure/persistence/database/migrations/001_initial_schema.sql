-- Initial database schema migration for PostgreSQL
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  pair VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK(direction IN ('BUY', 'SELL')),
  entry_price DECIMAL(20, 8) NOT NULL,
  exit_price DECIMAL(20, 8),
  lot_size DECIMAL(10, 2) NOT NULL,
  stop_loss DECIMAL(20, 8),
  take_profit DECIMAL(20, 8),
  pips DECIMAL(10, 2),
  points DECIMAL(10, 2),
  profit_loss DECIMAL(20, 8),
  risk_amount DECIMAL(20, 8),
  risk_reward_ratio DECIMAL(10, 4),
  status VARCHAR(20) NOT NULL CHECK(status IN ('OPEN', 'WIN', 'LOSS', 'BREAK_EVEN')),
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time);
CREATE INDEX IF NOT EXISTS idx_trades_pair ON trades(pair);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_user_status ON trades(user_id, status);
