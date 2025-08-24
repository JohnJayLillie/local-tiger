-- Tiger Platform Database Schema
-- Local Development Environment

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Content generations table
CREATE TABLE IF NOT EXISTS content_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    content_type VARCHAR(100) NOT NULL, -- 'youtube', 'www', 'blog', etc.
    prompt_data JSONB NOT NULL,         -- Original user input
    generated_content JSONB NOT NULL,   -- AI-generated content
    ai_model VARCHAR(100),              -- 'gpt-4', 'claude-3', etc.
    generation_time_ms INTEGER,         -- Processing time
    token_usage INTEGER,                -- Tokens consumed
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content templates table
CREATE TABLE IF NOT EXISTS content_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    template_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_generations_created_at ON content_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_content_generations_content_type ON content_generations(content_type);

-- Insert sample data
INSERT INTO users (email, name) VALUES 
    ('test@tiger.local', 'Test User'),
    ('admin@tiger.local', 'Tiger Admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample templates
INSERT INTO content_templates (template_name, content_type, template_data, is_public) VALUES 
    ('YouTube Gaming Video', 'youtube', '{"style": "engaging", "length": "10-15 min", "audience": "gamers"}', true),
    ('Tech Blog Post', 'www', '{"tone": "professional", "length": "long-form", "seo": true}', true),
    ('Social Media Thread', 'www', '{"platform": "twitter", "length": "5-7 tweets", "style": "conversational"}', true)
ON CONFLICT DO NOTHING;

COMMENT ON DATABASE tiger_local IS 'Tiger Platform Local Development Database';
