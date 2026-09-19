-- ============================================================
-- SPARRING — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY
-- ============================================================

-- 1. FRESH INSTALLATION: Create debates table if it does not exist
CREATE TABLE IF NOT EXISTS debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID NOT NULL,
  topic TEXT NOT NULL,
  user_stance TEXT NOT NULL,
  ai_stance TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  transcript JSONB NOT NULL,
  feedback JSONB,
  overall_score INTEGER,
  logic_score INTEGER,
  evidence_score INTEGER,
  persuasiveness_score INTEGER,
  rounds_completed INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_session UNIQUE (user_id, session_id)
);

-- 2. MIGRATION SAFETY: If the table was already created in an earlier migration,
-- ensure session_id, constraints, and indexes exist.
DO $$
BEGIN
  -- Check and add session_id column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'debates' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE debates ADD COLUMN session_id UUID NOT NULL DEFAULT gen_random_uuid();
  END IF;

  -- Check and add unique_user_session constraint if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_session'
  ) THEN
    ALTER TABLE debates ADD CONSTRAINT unique_user_session UNIQUE (user_id, session_id);
  END IF;
END $$;

-- 3. INDEXES: Fast lookup by user sorted by most recent first
CREATE INDEX IF NOT EXISTS debates_user_created_idx 
ON debates(user_id, created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running migration to avoid conflict
DROP POLICY IF EXISTS "Users can view only their own debates" ON debates;
DROP POLICY IF EXISTS "Users can insert only their own debates" ON debates;
DROP POLICY IF EXISTS "Users can delete only their own debates" ON debates;

-- SELECT Policy: Users can only read their own debates
CREATE POLICY "Users can view only their own debates"
  ON debates FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT Policy: Users can only insert debates belonging to themselves
CREATE POLICY "Users can insert only their own debates"
  ON debates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- DELETE Policy: Users can only delete their own debates
CREATE POLICY "Users can delete only their own debates"
  ON debates FOR DELETE
  USING (auth.uid() = user_id);
