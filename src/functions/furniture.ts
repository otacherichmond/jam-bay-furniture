import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["furniture_products"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["customer_reviews"]["Row"];

export type ProductInput = {
  name: string;
  category: string;
  description: string;
  price: number;
  materials: string;
  dimensions: string;
  image_url: string;
  in_stock: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type ReviewInput = {
  customer_name: string;
  location: string;
  rating: number;
  comment: string;
  is_published: boolean;
};

/**
 * Publishable-key client for public reads (anon, RLS-gated).
 * sb_ keys are opaque, so send apikey only — never the default bearer.
 */
function createPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  if (!key || !url) throw new Error("Supabase environment is not configured");

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function checkPasscode(passcode: unknown): boolean {
  const expected = process.env["ADMIN_PASSCODE"];
  return Boolean(expected && passcode && passcode === expected);
}

function forbidden() {
  throw new Error("Incorrect admin passcode");
}

// ---------- Public reads ----------

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("furniture_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load furniture: ${error.message}`);
  return (data ?? []) as ProductRow[];
});

export const getReviews = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(`Could not load reviews: ${error.message}`);
  return (data ?? []) as ReviewRow[];
});

// ---------- Admin (passcode-gated) ----------

async function getAdminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminAddProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; product: ProductInput }) => input)
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) forbidden();

    const product = data.product;
    if (!product.name?.trim()) throw new Error("Product name is required");
    if (!Number.isInteger(product.price) || product.price <= 0) {
      throw new Error("Price must be a positive whole number (in naira)");
    }

    const supabase = await getAdminClient();
    const { data: inserted, error } = await supabase
      .from("furniture_products")
      .insert({
        name: product.name.trim(),
        category: product.category,
        description: product.description?.trim() ?? "",
        price: product.price,
        materials: product.materials?.trim() ?? "",
        dimensions: product.dimensions?.trim() ?? "",
        image_url: product.image_url ?? "",
        in_stock: product.in_stock ?? true,
        is_featured: product.is_featured ?? false,
        sort_order: Number.isInteger(product.sort_order) ? product.sort_order : 0,
      })
      .select("*")
      .single();
    if (error) throw new Error(`Could not save product: ${error.message}`);
    return inserted as ProductRow;
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string }) => input)
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) forbidden();
    const supabase = await getAdminClient();
    const { error } = await supabase
      .from("furniture_products")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(`Could not delete product: ${error.message}`);
    return { success: true };
  });

export const adminAddReview = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; review: ReviewInput }) => input)
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) forbidden();

    const review = data.review;
    if (!review.customer_name?.trim()) throw new Error("Customer name is required");
    if (!review.comment?.trim()) throw new Error("Review text is required");
    if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const supabase = await getAdminClient();
    const { data: inserted, error } = await supabase
      .from("customer_reviews")
      .insert({
        customer_name: review.customer_name.trim(),
        location: review.location?.trim() || "Abuja, Nigeria",
        rating: review.rating,
        comment: review.comment.trim(),
        is_published: review.is_published ?? true,
      })
      .select("*")
      .single();
    if (error) throw new Error(`Could not save review: ${error.message}`);
    return inserted as ReviewRow;
  });

export const adminDeleteReview = createServerFn({ method: "POST" })
  .inputValidator((input: { passcode: string; id: string }) => input)
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) forbidden();
    const supabase = await getAdminClient();
    const { error } = await supabase
      .from("customer_reviews")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(`Could not delete review: ${error.message}`);
    return { success: true };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { passcode: string; filename: string; contentType: string; base64: string }) => input,
  )
  .handler(async ({ data }) => {
    if (!checkPasscode(data.passcode)) forbidden();
    if (data.base64.length > 12_000_000) throw new Error("Image is too large (max ~8 MB)");

    const supabase = await getAdminClient();
    const ext = (data.filename.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext || "jpg"}`;

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, bytes, { contentType: data.contentType || "image/jpeg" });
    if (error) throw new Error(`Could not upload image: ${error.message}`);

    // Served to visitors through the public storage proxy route.
    return { image_url: `/api/public/storage/product-images/${path}` };
  });
