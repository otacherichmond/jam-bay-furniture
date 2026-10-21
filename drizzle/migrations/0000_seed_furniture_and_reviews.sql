-- Jam & Bay Furniture: products and reviews
CREATE TABLE public.furniture_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL,
  materials text NOT NULL DEFAULT '',
  dimensions text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  in_stock boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  location text NOT NULL DEFAULT 'Abuja, Nigeria',
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.furniture_products TO anon;
GRANT SELECT ON public.furniture_products TO authenticated;
GRANT ALL ON public.furniture_products TO service_role;
GRANT SELECT ON public.customer_reviews TO anon;
GRANT SELECT ON public.customer_reviews TO authenticated;
GRANT ALL ON public.customer_reviews TO service_role;

ALTER TABLE public.furniture_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.furniture_products FOR SELECT USING (true);
CREATE POLICY "Public read published reviews" ON public.customer_reviews FOR SELECT USING (is_published = true);

-- Public read for the product-images bucket
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Seed products
INSERT INTO public.furniture_products (name, category, description, price, materials, dimensions, image_url, in_stock, is_featured, sort_order) VALUES
('Wuse 3-Seater Sofa', 'sofas', 'A generously sized three-seater with plush boucle upholstery on a kiln-dried teak frame. Built by our Wuse workshop for everyday comfort that lasts.', 485000, 'Premium boucle upholstery, kiln-dried teak frame, high-resilience foam', 'W 220 × D 95 × H 85 cm', '/images/products/sofa.jpg', true, true, 1),
('Asokoro King Bed Frame', 'beds', 'A statement king bed in solid mahogany with a tall upholstered headboard. Custom sizes and headboard fabrics available on request.', 395000, 'Solid mahogany frame, taupe upholstered headboard, slatted base', 'W 200 × L 210 × H 130 cm', '/images/products/bed.jpg', true, true, 2),
('Wuse II 6-Door Wardrobe', 'wardrobes', 'Six-door wardrobe in a warm walnut finish with brass handles, soft-close doors and adjustable internal shelving.', 545000, 'Walnut-finish MDF, brass handles, adjustable shelves', 'W 180 × D 60 × H 220 cm', '/images/products/wardrobe.jpg', true, false, 3),
('Iroko Dining Table Set (6-Seater)', 'tables', 'Solid iroko dining table with visible grain and six woven-fabric upholstered chairs. Table also sold separately.', 365000, 'Solid iroko wood table, woven-fabric upholstered chairs', 'L 200 × W 100 × H 76 cm', '/images/products/dining-table.jpg', true, true, 4),
('Executive High-Back Office Chair', 'chairs', 'Ergonomic high-back executive chair with padded leather upholstery, lumbar support and a chrome swivel base.', 145000, 'Padded leather upholstery, chrome swivel base, nylon castors', 'W 65 × D 70 × H 118 cm', '/images/products/office-chair.jpg', true, false, 5),
('Ndjamena Executive Desk', 'desks', 'Double-pedestal executive desk in dark walnut with six drawers, brass handles and a cable-management grommet.', 295000, 'Dark walnut veneer, brass handles, solid wood edge banding', 'W 180 × D 70 × H 76 cm', '/images/products/office-desk.jpg', true, false, 6),
('Modular Kitchen Cabinet Set', 'kitchen', 'Made-to-measure kitchen cabinets combining oak-grain doors with matte cream uppers, soft-close hinges and brass hardware.', 895000, 'Oak-grain door finish, matte cream laminate, soft-close hinges, brass hardware', 'Custom sizes — measured to fit your kitchen', '/images/products/kitchen-cabinets.jpg', true, true, 7),
('Carved Entrance Door', 'doors', 'Hand-carved solid wood entrance doors in a range of panel designs. Made to order in standard and custom sizes.', 235000, 'Solid iroko wood, hand-carved panels, weather-sealed finish', 'W 90 × H 210 cm (custom sizes available)', '/images/products/door.jpg', true, false, 8);

-- Seed reviews
INSERT INTO public.customer_reviews (customer_name, location, rating, comment, is_published) VALUES
('Adebayo Ogundimu', 'Wuse 2, Abuja', 5, 'Jam & Bay furnished our entire office — desks, chairs and reception seating — in under three weeks. The finish quality is honestly better than what we saw in the big showrooms.', true),
('Chiamaka Eze', 'Gwarinpa, Abuja', 5, 'My custom wardrobe fits the room perfectly and the woodwork is beautiful. They measured, sent photos during production and delivered on time. Highly recommended.', true),
('Musa Ibrahim', 'Maitama, Abuja', 4, 'We ordered the dining table set for our new home. Solid, well-made furniture at a fair price. Delivery took a day longer than promised but the team kept us updated.', true),
('Blessing Adeyemi', 'Lugbe, Abuja', 5, 'The kitchen cabinets completely transformed our kitchen. Great attention to detail and the soft-close finishes feel premium. Worth every naira.', true),
('Tunde Bakare', 'Central Area, Abuja', 4, 'Good quality office chairs at reasonable prices. Will definitely use them again for our branch office fit-out.', true);
