-- Security hardening: enable RLS on all public-facing tables
-- and allow read access only for rows linked to published WoDs.

ALTER TABLE public.wod_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wod_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wod_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wod_kpis ENABLE ROW LEVEL SECURITY;

-- Public read for components only when parent WoD is published.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wod_components'
      AND policyname = 'Public read components of published wods'
  ) THEN
    CREATE POLICY "Public read components of published wods"
      ON public.wod_components
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.wods
          WHERE wods.id = wod_components.wod_id
            AND wods.is_published = TRUE
        )
      );
  END IF;
END
$$;

-- Public read for wod_tags only when parent WoD is published.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wod_tags'
      AND policyname = 'Public read wod_tags of published wods'
  ) THEN
    CREATE POLICY "Public read wod_tags of published wods"
      ON public.wod_tags
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.wods
          WHERE wods.id = wod_tags.wod_id
            AND wods.is_published = TRUE
        )
      );
  END IF;
END
$$;

-- Public read for images only when parent WoD is published.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wod_images'
      AND policyname = 'Public read images of published wods'
  ) THEN
    CREATE POLICY "Public read images of published wods"
      ON public.wod_images
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.wods
          WHERE wods.id = wod_images.wod_id
            AND wods.is_published = TRUE
        )
      );
  END IF;
END
$$;

-- Public read for KPI only when parent WoD is published.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wod_kpis'
      AND policyname = 'Public read kpis of published wods'
  ) THEN
    CREATE POLICY "Public read kpis of published wods"
      ON public.wod_kpis
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.wods
          WHERE wods.id = wod_kpis.wod_id
            AND wods.is_published = TRUE
        )
      );
  END IF;
END
$$;

-- Public read for tags. Tags are not sensitive and are required by joins.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'tags'
      AND policyname = 'Public read tags'
  ) THEN
    CREATE POLICY "Public read tags"
      ON public.tags
      FOR SELECT
      USING (TRUE);
  END IF;
END
$$;

