-- 004_gamification_and_store.sql
-- HabitFlow Level-Up System, Coins Economy & Rewards Store Schema

-- 1. Extend user_settings with gamification jsonb structure if desired
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS gamification JSONB DEFAULT jsonb_build_object(
  'level', 1,
  'coins', 50,
  'totalCoinsEarned', 50,
  'completedDates', '[]'::jsonb,
  'activeTitle', 'Novice Striver',
  'activeTheme', 'slate',
  'inventory', '["title-novice"]'::jsonb,
  'customRewards', '[]'::jsonb,
  'redemptions', '[]'::jsonb
);

-- 2. Optional dedicated user_gamification table for relational queries
CREATE TABLE IF NOT EXISTS public.user_gamification (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 1,
  coins INT NOT NULL DEFAULT 50,
  total_coins_earned INT NOT NULL DEFAULT 50,
  completed_dates TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  active_title TEXT NOT NULL DEFAULT 'Novice Striver',
  active_theme TEXT NOT NULL DEFAULT 'slate',
  inventory TEXT[] NOT NULL DEFAULT ARRAY['title-novice']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Dedicated store redemption logs
CREATE TABLE IF NOT EXISTS public.store_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  title TEXT NOT NULL,
  cost INT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🎁',
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_store_redemptions_user ON public.store_redemptions(user_id, redeemed_at DESC);

-- Enable RLS
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own gamification" ON public.user_gamification
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own redemptions" ON public.store_redemptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redemptions" ON public.store_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
