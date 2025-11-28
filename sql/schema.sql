-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  native_language VARCHAR(50),
  target_accent VARCHAR(50) DEFAULT 'american',
  cefr_level VARCHAR(2) DEFAULT 'A1' CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speech analysis table
CREATE TABLE IF NOT EXISTS speech_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  transcription TEXT NOT NULL,
  detected_accent VARCHAR(50),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  pronunciation_score DECIMAL(3,2) CHECK (pronunciation_score >= 0 AND pronunciation_score <= 1),
  fluency_score DECIMAL(3,2) CHECK (fluency_score >= 0 AND fluency_score <= 1),
  phoneme_errors JSONB DEFAULT '[]',
  audio_duration DECIMAL(6,2) CHECK (audio_duration >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching sessions table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('assessment', 'practice', 'test')),
  target_phonemes TEXT[] DEFAULT '{}',
  exercises JSONB DEFAULT '[]',
  progress_score DECIMAL(3,2) CHECK (progress_score >= 0 AND progress_score <= 1),
  feedback TEXT,
  duration_minutes INTEGER CHECK (duration_minutes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  metric_type VARCHAR(20) NOT NULL CHECK (metric_type IN ('pronunciation', 'fluency', 'accuracy', 'overall')),
  metric_value DECIMAL(3,2) NOT NULL CHECK (metric_value >= 0 AND metric_value <= 1),
  phoneme VARCHAR(10),
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CEFR content table (for RAG system)
CREATE TABLE IF NOT EXISTS cefr_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(2) NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('word', 'phrase', 'sentence', 'dialogue')),
  content TEXT NOT NULL,
  phonetic_transcription TEXT,
  difficulty_score INTEGER CHECK (difficulty_score >= 1 AND difficulty_score <= 10),
  target_phonemes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_speech_analyses_user_id ON speech_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_speech_analyses_created_at ON speech_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_created_at ON coaching_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date ON user_progress(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_metric_type ON user_progress(metric_type);
CREATE INDEX IF NOT EXISTS idx_cefr_content_level ON cefr_content(level);
CREATE INDEX IF NOT EXISTS idx_cefr_content_type ON cefr_content(content_type);
