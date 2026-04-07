-- =============================================
-- Lessen 資料庫結構
-- 請在 Supabase Dashboard > SQL Editor 中執行
-- =============================================

-- 1. Profiles (所有使用者的基本資料)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('parent', 'helper')),
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT '',
  district TEXT NOT NULL DEFAULT '',
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Helper Profiles (幫手的完整個人檔案)
CREATE TABLE helper_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate INTEGER,
  experience_years INTEGER,
  certifications TEXT[] NOT NULL DEFAULT '{}',
  portfolio_urls TEXT[] NOT NULL DEFAULT '{}',
  available_days TEXT[] NOT NULL DEFAULT '{}',
  available_time_start TEXT,
  available_time_end TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Parent Profiles (家長的個人檔案)
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  children_ages TEXT[] NOT NULL DEFAULT '{}',
  needs TEXT[] NOT NULL DEFAULT '{}',
  preferred_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) 權限設定
-- =============================================

-- 啟用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE helper_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: 使用者只能讀寫自己的資料，所有人可讀取已審核幫手
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 所有人可以瀏覽幫手的公開資料
CREATE POLICY "Anyone can view helper profiles"
  ON profiles FOR SELECT
  USING (role = 'helper');

-- Helper Profiles: 幫手可讀寫自己的資料
CREATE POLICY "Helpers can view own helper profile"
  ON helper_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Helpers can insert own helper profile"
  ON helper_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Helpers can update own helper profile"
  ON helper_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 所有人可瀏覽已通過審核的幫手
CREATE POLICY "Anyone can view approved helpers"
  ON helper_profiles FOR SELECT
  USING (status = 'approved');

-- Parent Profiles: 家長可讀寫自己的資料
CREATE POLICY "Parents can view own parent profile"
  ON parent_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can insert own parent profile"
  ON parent_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can update own parent profile"
  ON parent_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- 自動更新 updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER helper_profiles_updated_at
  BEFORE UPDATE ON helper_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER parent_profiles_updated_at
  BEFORE UPDATE ON parent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 索引
-- =============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_helper_profiles_status ON helper_profiles(status);
CREATE INDEX idx_helper_profiles_user_id ON helper_profiles(user_id);
CREATE INDEX idx_parent_profiles_user_id ON parent_profiles(user_id);
