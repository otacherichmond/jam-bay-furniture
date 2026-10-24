-- The passcode hash must only ever be reachable by server-side admin functions.
REVOKE ALL ON public.admin_settings FROM anon, authenticated;
GRANT ALL ON public.admin_settings TO service_role;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_settings' LOOP
    EXECUTE format('DROP POLICY %I ON public.admin_settings', p.policyname);
  END LOOP;
END $$;
