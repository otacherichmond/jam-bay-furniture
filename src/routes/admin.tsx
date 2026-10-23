import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Check,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  MessageSquareQuote,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  adminAddProduct,
  adminAddReview,
  adminDeleteProduct,
  adminDeleteReview,
  adminListReviews,
  adminUploadImage,
  getProducts,
  type ProductRow,
  type ReviewRow,
} from "@/functions/furniture";
import { CATEGORIES, categoryLabel, formatNaira } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Jam & Bay — Owner Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const PASSCODE_KEY = "jb-admin-passcode";

function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const listReviewsFn = useServerFn(adminListReviews);

  // Remember an earlier unlock in this browser.
  useEffect(() => {
    const saved = sessionStorage.getItem(PASSCODE_KEY);
    if (!saved) return;
    setChecking(true);
    listReviewsFn({ data: { passcode: saved } })
      .then(() => {
        setPasscode(saved);
        setUnlocked(true);
      })
      .catch(() => sessionStorage.removeItem(PASSCODE_KEY))
      .finally(() => setChecking(false));
  }, [listReviewsFn]);

  async function handleUnlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setChecking(true);
    try {
      await listReviewsFn({ data: { passcode } });
      sessionStorage.setItem(PASSCODE_KEY, passcode);
      setUnlocked(true);
    } catch {
      setError("Incorrect admin passcode. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  function lock() {
    sessionStorage.removeItem(PASSCODE_KEY);
    setPasscode("");
    setUnlocked(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container-page flex h-14 items-center justify-between">
          <p className="font-display text-lg font-semibold text-foreground">
            Jam &amp; Bay <span className="text-muted-foreground">· Owner admin</span>
          </p>
          {unlocked ? (
            <button
              type="button"
              onClick={lock}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              Lock
            </button>
          ) : null}
        </div>
      </header>

      <main className="container-page py-10">
        {checking && !unlocked ? (
          <div className="flex justify-center py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : unlocked ? (
          <Dashboard passcode={passcode} />
        ) : (
          <div className="mx-auto max-w-sm">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Lock className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
                Owner access
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your admin passcode to add furniture and customer reviews.
              </p>
              <form onSubmit={handleUnlock} className="mt-6">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Admin passcode"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-[var(--accent)]"
                />
                {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
                <button
                  type="submit"
                  disabled={checking || !passcode}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Dashboard({ passcode }: { passcode: string }) {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[] | null>(null);

  const getProductsFn = useServerFn(getProducts);
  const listReviewsFn = useServerFn(adminListReviews);

  const reload = useCallback(async () => {
    const [productRows, reviewRows] = await Promise.all([
      getProductsFn(),
      listReviewsFn({ data: { passcode } }),
    ]);
    setProducts(productRows);
    setReviews(reviewRows);
  }, [passcode, getProductsFn, listReviewsFn]);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (products === null || reviews === null) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProductsPanel products={products} passcode={passcode} onChanged={reload} />
      <ReviewsPanel reviews={reviews} passcode={passcode} onChanged={reload} />
    </div>
  );
}

function PanelHeading({
  icon: Icon,
  title,
  count,
}: {
  icon: typeof Package;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="inline-flex items-center gap-2 font-display text-xl font-semibold text-foreground">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
        {count}
      </span>
    </div>
  );
}

function ProductsPanel({
  products,
  passcode,
  onChanged,
}: {
  products: ProductRow[];
  passcode: string;
  onChanged: () => void;
}) {
  const addFn = useServerFn(adminAddProduct);
  const deleteFn = useServerFn(adminDeleteProduct);
  const uploadFn = useServerFn(adminUploadImage);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleUpload(file: File) {
    setError("");
    setMessage("");
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result);
          resolve(result.slice(result.indexOf(",") + 1));
        };
        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.readAsDataURL(file);
      });
      const result = await uploadFn({
        data: { passcode, filename: file.name, contentType: file.type, base64 },
      });
      setImageUrl(result.image_url);
      setMessage("Image uploaded.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await addFn({
        data: {
          passcode,
          product: {
            name: String(fd.get("name") ?? ""),
            category: String(fd.get("category") ?? "sofas"),
            description: String(fd.get("description") ?? ""),
            price: Number(fd.get("price")),
            materials: String(fd.get("materials") ?? ""),
            dimensions: String(fd.get("dimensions") ?? ""),
            image_url: imageUrl,
            in_stock: fd.get("in_stock") === "on",
            is_featured: fd.get("is_featured") === "on",
            sort_order: Number(fd.get("sort_order")) || 0,
          },
        },
      });
      form.reset();
      setImageUrl("");
      setMessage("Product added — it now shows on the website.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteFn({ data: { passcode, id } });
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete product");
    }
  }

  const inputCls =
    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--accent)]";

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <PanelHeading icon={Package} title="Furniture products" count={products.length} />

      <form onSubmit={handleAddProduct} className="mt-6 grid gap-3">
        <input name="name" required placeholder="Product name *" className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <select name="category" className={cn(inputCls, "pr-2")}>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            min="1"
            step="1"
            required
            placeholder="Price in naira *"
            className={inputCls}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="materials" placeholder="Materials (e.g. Kiln-dried iroko)" className={inputCls} />
          <input
            name="dimensions"
            placeholder="Dimensions (e.g. 210 × 90 × 75 cm)"
            className={inputCls}
          />
        </div>
        <textarea
          name="description"
          rows={3}
          placeholder="Short description"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[var(--accent)]"
        />
        <div className="grid grid-cols-2 gap-3">
          <input name="sort_order" type="number" placeholder="Sort order (0 = first)" className={inputCls} />
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
            <ImagePlus className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{uploading ? "Uploading…" : imageUrl ? "Photo attached ✓" : "Upload photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </label>
        </div>
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="h-28 w-28 rounded-lg object-cover" />
        ) : null}
        <div className="flex gap-6 text-sm text-foreground">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="in_stock" defaultChecked className="accent-[var(--accent)]" />
            In stock
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_featured" className="accent-[var(--accent)]" />
            Featured
          </label>
        </div>
        <button
          type="submit"
          disabled={saving || uploading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add product
        </button>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>

      <ul className="mt-8 divide-y divide-border border-t border-border">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3 py-3">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="h-11 w-11 shrink-0 rounded-lg bg-secondary" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {categoryLabel(product.category)} · {formatNaira(product.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleDelete(product.id)}
              aria-label={`Delete ${product.name}`}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewsPanel({
  reviews,
  passcode,
  onChanged,
}: {
  reviews: ReviewRow[];
  passcode: string;
  onChanged: () => void;
}) {
  const addFn = useServerFn(adminAddReview);
  const deleteFn = useServerFn(adminDeleteReview);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleAddReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setMessage("");
    setSaving(true);
    try {
      await addFn({
        data: {
          passcode,
          review: {
            customer_name: String(fd.get("customer_name") ?? ""),
            location: String(fd.get("location") ?? ""),
            rating: Number(fd.get("rating")),
            comment: String(fd.get("comment") ?? ""),
            is_published: fd.get("is_published") !== null,
          },
        },
      });
      form.reset();
      setMessage("Review added.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    try {
      await deleteFn({ data: { passcode, id } });
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete review");
    }
  }

  const inputCls =
    "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-[var(--accent)]";

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <PanelHeading icon={MessageSquareQuote} title="Customer reviews" count={reviews.length} />

      <form onSubmit={handleAddReview} className="mt-6 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input name="customer_name" required placeholder="Customer name *" className={inputCls} />
          <input name="location" placeholder="Location (e.g. Gwarinpa, Abuja)" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="rating" defaultValue="5" className={cn(inputCls, "pr-2")}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked
              className="accent-[var(--accent)]"
            />
            Show on website
          </label>
        </div>
        <textarea
          name="comment"
          rows={3}
          required
          placeholder="Review text *"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Add review
        </button>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>

      <ul className="mt-8 divide-y divide-border border-t border-border">
        {reviews.map((review) => (
          <li key={review.id} className="flex items-start gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {review.customer_name}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {review.rating}★ · {review.location}
                  {!review.is_published ? " · hidden" : ""}
                </span>
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{review.comment}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleDelete(review.id)}
              aria-label={`Delete review from ${review.customer_name}`}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
