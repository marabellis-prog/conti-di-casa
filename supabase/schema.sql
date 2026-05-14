-- ═══════════════════════════════════════════════════════════════
-- CONTI DI CASA — Schema completo
-- Da applicare al progetto Supabase `lrvkchqvjzynfzevpqaj`
-- ATTENZIONE: tutte le tabelle/funzioni/trigger sono prefissate `cdc_`
-- per non collidere con altre tabelle del progetto.
-- Esegui questo file dal SQL Editor di Supabase Studio.
-- ═══════════════════════════════════════════════════════════════

-- ── TABELLE ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cdc_categorie (
  id              bigserial PRIMARY KEY,
  nome            text    NOT NULL,
  tipo            text    NOT NULL CHECK (tipo IN ('entrata','uscita')),
  colore          text,
  icona           text,
  macro_categoria text,        -- es. 'bollette', 'casa', 'cibo', ... derivata dal picker emoji
  ordine          integer NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);
-- migration safe: se il campo non c'era ancora
ALTER TABLE public.cdc_categorie ADD COLUMN IF NOT EXISTS macro_categoria text;

CREATE TABLE IF NOT EXISTS public.cdc_transazioni (
  id           bigserial PRIMARY KEY,
  data         date    NOT NULL,
  importo      numeric(12,2) NOT NULL CHECK (importo > 0),
  tipo         text    NOT NULL CHECK (tipo IN ('entrata','uscita')),
  categoria_id bigint  REFERENCES public.cdc_categorie(id) ON DELETE SET NULL,
  descrizione  text,
  autore       text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cdc_tx_data ON public.cdc_transazioni (data DESC);
CREATE INDEX IF NOT EXISTS idx_cdc_tx_cat  ON public.cdc_transazioni (categoria_id);

CREATE TABLE IF NOT EXISTS public.cdc_budget (
  id           bigserial PRIMARY KEY,
  categoria_id bigint   NOT NULL REFERENCES public.cdc_categorie(id) ON DELETE CASCADE,
  anno         smallint NOT NULL,
  mese         smallint NOT NULL CHECK (mese BETWEEN 1 AND 12),
  importo      numeric(12,2) NOT NULL CHECK (importo >= 0),
  UNIQUE (categoria_id, anno, mese)
);

CREATE TABLE IF NOT EXISTS public.cdc_update_cache (
  id int PRIMARY KEY,
  ts bigint NOT NULL
);
INSERT INTO public.cdc_update_cache (id, ts) VALUES (1, 0)
  ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.cdc_prefs (
  id      int PRIMARY KEY DEFAULT 1,
  dati    jsonb NOT NULL DEFAULT '{}'::jsonb,
  CHECK (id = 1)
);
INSERT INTO public.cdc_prefs (id, dati)
VALUES (1, '{"autori":["Stefano","Partner"],"autoreDefault":"Stefano"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.cdc_app_version (
  id           int PRIMARY KEY DEFAULT 1,
  sha          text NOT NULL DEFAULT '',
  deployed_at  bigint,
  message      text,
  CHECK (id = 1)
);
INSERT INTO public.cdc_app_version (id, sha) VALUES (1, '')
ON CONFLICT (id) DO NOTHING;

-- ── TRIGGER: bump cache timestamp ─────────────────────────────

CREATE OR REPLACE FUNCTION public.cdc_bump_cache_ts()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.cdc_update_cache
     SET ts = (extract(epoch from now()) * 1000)::bigint
   WHERE id = 1;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS cdc_bump_cats ON public.cdc_categorie;
CREATE TRIGGER cdc_bump_cats AFTER INSERT OR UPDATE OR DELETE ON public.cdc_categorie
  FOR EACH STATEMENT EXECUTE FUNCTION public.cdc_bump_cache_ts();

DROP TRIGGER IF EXISTS cdc_bump_tx ON public.cdc_transazioni;
CREATE TRIGGER cdc_bump_tx AFTER INSERT OR UPDATE OR DELETE ON public.cdc_transazioni
  FOR EACH STATEMENT EXECUTE FUNCTION public.cdc_bump_cache_ts();

DROP TRIGGER IF EXISTS cdc_bump_budget ON public.cdc_budget;
CREATE TRIGGER cdc_bump_budget AFTER INSERT OR UPDATE OR DELETE ON public.cdc_budget
  FOR EACH STATEMENT EXECUTE FUNCTION public.cdc_bump_cache_ts();

-- ── TRIGGER: touch updated_at ─────────────────────────────────

CREATE OR REPLACE FUNCTION public.cdc_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cdc_touch_tx ON public.cdc_transazioni;
CREATE TRIGGER cdc_touch_tx BEFORE UPDATE ON public.cdc_transazioni
  FOR EACH ROW EXECUTE FUNCTION public.cdc_touch_updated_at();

-- ── GRANT + RLS permissiva ────────────────────────────────────

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'cdc_categorie', 'cdc_transazioni', 'cdc_budget',
    'cdc_update_cache', 'cdc_prefs', 'cdc_app_version'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO anon, authenticated, service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "cdc_public_all" ON public.%I', t);
    EXECUTE format('CREATE POLICY "cdc_public_all" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- ── REALTIME publication ──────────────────────────────────────

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'cdc_categorie', 'cdc_transazioni', 'cdc_budget',
    'cdc_prefs', 'cdc_app_version'
  ] LOOP
    -- aggiungi alla publication solo se non gia` presente
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

-- ── SEED categorie iniziali ──────────────────────────────────
-- Si applica solo se la tabella e` vuota

INSERT INTO public.cdc_categorie (nome, tipo, colore, icona, macro_categoria, ordine)
SELECT * FROM (VALUES
  ('Spesa',         'uscita', '#e74c3c', '🛒', 'cibo',          0),
  ('Casa',          'uscita', '#3498db', '🏠', 'casa',          1),
  ('Bollette',      'uscita', '#f39c12', '💡', 'bollette',      2),
  ('Trasporti',     'uscita', '#9b59b6', '🚗', 'trasporti',     3),
  ('Ristorante',    'uscita', '#e91e63', '🍽️', 'cibo',         4),
  ('Salute',        'uscita', '#1abc9c', '💊', 'salute',        5),
  ('Tempo libero',  'uscita', '#34d399', '🎮', 'svago',         6),
  ('Abbigliamento', 'uscita', '#a777e3', '👕', 'abbigliamento', 7),
  ('Regali',        'uscita', '#ff5722', '🎁', 'regali',        8),
  ('Altro uscita',  'uscita', '#607d8b', '📦', 'altro',       9),
  ('Stipendio',     'entrata','#2ecc71', '💰', 'soldi',         0),
  ('Rimborso',      'entrata','#5ab885', '💼', 'soldi',         1),
  ('Altro entrata', 'entrata','#7dd3a8', '✨', 'altro',       2)
) AS v(nome, tipo, colore, icona, macro_categoria, ordine)
WHERE NOT EXISTS (SELECT 1 FROM public.cdc_categorie);

-- ═══════════════════════════════════════════════════════════════
-- FINE
-- Verifica con: SELECT count(*) FROM public.cdc_categorie;  -> 13
--               SELECT * FROM public.cdc_app_version;       -> id=1, sha=''
-- ═══════════════════════════════════════════════════════════════
