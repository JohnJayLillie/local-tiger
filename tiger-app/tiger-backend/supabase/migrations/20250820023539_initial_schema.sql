-- Tiger Database Schema Migration
-- Copy this entire content into: supabase/migrations/[timestamp]_initial_schema.sql

-- Users table with subscription tracking
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'creator_free',
  videos_used_this_month INTEGER DEFAULT 0,
  monthly_video_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table for video content
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  script TEXT,
  platform VARCHAR(50), -- youtube, tiktok, instagram
  video_url TEXT,
  thumbnail_url TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, generating, completed, failed
  ai_optimization_score DECIMAL(5,2),
  performance_metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prompt templates for AI coaching
CREATE TABLE prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  framework VARCHAR(50), -- RACE, SCOPE, VIRAL, EDUCATE
  template_content TEXT NOT NULL,
  quality_score DECIMAL(5,2),
  usage_count INTEGER DEFAULT 0,
  performance_rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content assets for legal compliance
CREATE TABLE content_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_agency VARCHAR(100), -- FBI, USMS, ICE, NARA
  asset_type VARCHAR(50), -- image, video, document
  file_url TEXT NOT NULL,
  compliance_verified BOOLEAN DEFAULT false,
  metadata JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics for performance tracking
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  event_type VARCHAR(100), -- video_generated, prompt_optimized, content_discovered
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Prompt templates policies
CREATE POLICY "Users can manage own templates" ON prompt_templates
  FOR ALL USING (auth.uid() = user_id);

-- Content assets are publicly readable
CREATE POLICY "Content assets are publicly readable" ON content_assets
  FOR SELECT USING (true);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

-- Create initial subscription tiers
INSERT INTO users (id, email, name, subscription_tier, monthly_video_limit) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@tiger.app', 'Tiger Admin', 'creator_studio', 9999);

-- Create sample content assets for testing
INSERT INTO content_assets (source_agency, asset_type, file_url, compliance_verified) VALUES
  ('NARA', 'image', 'https://catalog.archives.gov/sample1.jpg', true),
  ('FBI', 'document', 'https://vault.fbi.gov/sample1.pdf', true),
  ('USMS', 'image', 'https://usmarshals.gov/sample1.jpg', true);