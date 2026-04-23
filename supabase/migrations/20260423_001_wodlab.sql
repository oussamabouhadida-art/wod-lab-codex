CREATE TABLE IF NOT EXISTS wods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  description_es TEXT,
  content_en TEXT NOT NULL,
  content_fr TEXT NOT NULL,
  content_es TEXT NOT NULL,
  wod_type TEXT NOT NULL CHECK (wod_type IN ('for_time','amrap','emom','chipper','ladder','benchmark_hero')),
  objective TEXT NOT NULL CHECK (objective IN ('strength','endurance','power','agility','conditioning')),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wods ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wods'
      AND policyname = 'Public read published wods'
  ) THEN
    CREATE POLICY "Public read published wods" ON wods FOR SELECT USING (is_published = TRUE);
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS wod_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wod_id UUID REFERENCES wods(id) ON DELETE CASCADE,
  component TEXT NOT NULL CHECK (component IN ('gymnastics','weightlifting','cardio'))
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS wod_tags (
  wod_id UUID REFERENCES wods(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (wod_id, tag_id)
);

CREATE TABLE IF NOT EXISTS wod_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wod_id UUID REFERENCES wods(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_en TEXT,
  alt_fr TEXT,
  alt_es TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wod_kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wod_id UUID REFERENCES wods(id) ON DELETE CASCADE,
  estimated_duration_min INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  estimated_calories INTEGER,
  training_effect TEXT,
  intensity_level TEXT CHECK (intensity_level IN ('low','moderate','high','extreme')),
  recovery_time_hours INTEGER,
  training_load INTEGER
);
