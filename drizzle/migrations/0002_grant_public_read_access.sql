GRANT SELECT ON public.furniture_products TO anon, authenticated;
GRANT SELECT ON public.customer_reviews TO anon, authenticated;
GRANT ALL ON public.furniture_products TO service_role;
GRANT ALL ON public.customer_reviews TO service_role;