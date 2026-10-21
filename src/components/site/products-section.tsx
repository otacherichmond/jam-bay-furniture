import { useMemo, useState } from "react";
import { MessageCircle, Ruler, Search, Sparkles, X } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { CATEGORIES, categoryLabel, formatNaira, whatsappLink } from "@/lib/site";
import type { ProductRow } from "@/functions/furniture";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { value: "all", label: "Any price", test: () => true },
  { value: "under-250", label: "Under ₦250,000", test: (p: number) => p < 250_000 },
  {
    value: "250-500",
    label: "₦250,000 – ₦500,000",
    test: (p: number) => p >= 250_000 && p <= 500_000,
  },
  { value: "above-500", label: "Above ₦500,000", test: (p: number) => p > 500_000 },
] as const;

type SortOption = "featured" | "price-asc" | "price-desc";

export function ProductsSection({ products }: { products: ProductRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const range = PRICE_RANGES.find((r) => r.value === priceRange) ?? PRICE_RANGES[0];

    let result = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!range.test(product.price)) return false;
      if (!q) return true;
      return [product.name, product.description, product.materials, categoryLabel(product.category)]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else
      result = [...result].sort(
        (a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order,
      );

    return result;
  }, [products, query, category, priceRange, sort]);

  return (
    <section id="furniture" className="scroll-mt-24 bg-sand py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Our furniture"
            title="Browse the collection"
            subtitle="Every piece shown here is available now or made to order. See something you like? Chat with us on WhatsApp and we'll confirm availability, sizing and delivery."
          />
        </Reveal>

        {/* Search & filters */}
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search furniture — e.g. sofa, wardrobe, desk…"
                  className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--accent)] focus:ring-2 focus:ring-ring/30"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                aria-label="Filter by price"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--accent)]"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                aria-label="Sort products"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--accent)]"
              >
                <option value="featured">Featured first</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
                All
              </FilterChip>
              {CATEGORIES.map((cat) => (
                <FilterChip
                  key={cat.value}
                  active={category === cat.value}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <Reveal key={product.id} delay={(i % 3) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              No furniture matches your search
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a different category or price range — or message us directly. We build custom
              pieces every week and may have exactly what you need in the workshop.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-[var(--accent)] hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ProductCard({ product }: { product: ProductRow }) {
  const inquiryMessage = `Hello Jam & Bay Furniture! I'm interested in the "${product.name}" (${formatNaira(product.price)}). Is it available, and can you deliver to my area?`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            width={1024}
            height={1024}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Ruler className="h-10 w-10" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {categoryLabel(product.category)}
        </span>
        {product.is_featured ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-black/80">
            <Sparkles className="h-3 w-3" />
            Featured
          </span>
        ) : null}
        {!product.in_stock ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
            Made to order
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        {product.materials ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{product.materials}</p>
        ) : null}
        {product.dimensions ? (
          <p className="mt-1 text-xs text-muted-foreground">{product.dimensions}</p>
        ) : null}
        {product.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          <p className="text-xl font-bold text-foreground">{formatNaira(product.price)}</p>
          <a
            href={whatsappLink(inquiryMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Inquire on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
