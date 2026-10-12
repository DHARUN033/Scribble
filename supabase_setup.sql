-- ============================================================================
-- SCRIBBLE ARENA - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ============================================================================

-- 1. ROOMS TABLE: Stores active and historical game rooms
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    admin_key VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'lobby', -- 'lobby', 'active', 'finished'
    rounds INTEGER DEFAULT 3,
    draw_time INTEGER DEFAULT 80,
    game_mode VARCHAR(20) DEFAULT 'ffa', -- 'ffa', 'team'
    custom_words TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. GAME SESSIONS TABLE: Match history, podium champions, and statistics
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(10) NOT NULL,
    winner_name VARCHAR(50),
    winner_score INTEGER DEFAULT 0,
    total_rounds INTEGER DEFAULT 3,
    game_mode VARCHAR(20) DEFAULT 'ffa',
    podium JSONB DEFAULT '[]'::jsonb, -- 1st, 2nd, 3rd place details
    all_players JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GLOBAL LEADERBOARD TABLE: Hall of Fame across all matches
CREATE TABLE IF NOT EXISTS public.global_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_name VARCHAR(50) UNIQUE NOT NULL,
    avatar JSONB DEFAULT '{}'::jsonb,
    total_score BIGINT DEFAULT 0,
    matches_played INTEGER DEFAULT 1,
    matches_won INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CUSTOM WORD PACKS TABLE: Reusable word libraries created by hosts
CREATE TABLE IF NOT EXISTS public.custom_word_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    words TEXT[] NOT NULL,
    created_by VARCHAR(50) DEFAULT 'Host',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_rooms_code ON public.rooms(code);
CREATE INDEX IF NOT EXISTS idx_game_sessions_room ON public.game_sessions(room_code);
CREATE INDEX IF NOT EXISTS idx_global_leaderboard_score ON public.global_leaderboard(total_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_word_packs ENABLE ROW LEVEL SECURITY;

-- Permissive policies for multiplayer game clients using anon key
CREATE POLICY "Allow public read/write on rooms" 
    ON public.rooms FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on game_sessions" 
    ON public.game_sessions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on global_leaderboard" 
    ON public.global_leaderboard FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write on custom_word_packs" 
    ON public.custom_word_packs FOR ALL USING (true) WITH CHECK (true);

-- Seed Initial Custom Word Packs for Event Hosts
INSERT INTO public.custom_word_packs (name, description, words) VALUES
(
    'Cloud & DevOps Engineering',
    'Curated terms for tech events and cloud engineering teams',
    ARRAY['Kubernetes', 'Docker', 'Terraform', 'Microservices', 'Load Balancer', 'Serverless', 'Pipeline', 'Ansible', 'Prometheus', 'Grafana', 'EC2', 'Lambda', 'Ingress', 'Helm Chart', 'VPC', 'Container']
),
(
    'AI & Machine Learning',
    'Keywords for AI hackathons and data science workshops',
    ARRAY['Transformer', 'Neural Network', 'Backpropagation', 'Tokenization', 'Latent Space', 'Gradient Descent', 'Fine-tuning', 'Vector Database', 'Hallucination', 'Diffusion Model', 'GPU Cluster', 'Embeddings']
),
(
    'Agile & Startup Life',
    'Fun terms for team offsites and company game nights',
    ARRAY['Standup', 'Sprint Retrospective', 'Backlog grooming', 'Burn-down chart', 'MVP', 'Pivot', 'Pitch Deck', 'Product Hunt', 'Venture Capital', 'Angel Investor', 'Burn Rate', 'Unicorn']
)
ON CONFLICT DO NOTHING;
