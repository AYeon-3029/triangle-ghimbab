import { createClient } from "@supabase/supabase-js";
import type { Product, Tag } from "./data";

// Supabase 클라이언트는 Storage(이미지 업로드) 전용
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ReviewRow = {
  id: string;
  rating: number;
  tags: Tag[];
  comment: string | null;
  imageUrl: string | null;
  createdAt: string;
  isPurchase: boolean;
};

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) return [];
  return res.json();
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchReviews(productId: string): Promise<ReviewRow[]> {
  const res = await fetch(`/api/products/${productId}/reviews`);
  if (!res.ok) return [];
  return res.json();
}

export async function uploadReviewImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("review-images").upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from("review-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function insertReview(input: {
  productId: string;
  rating: number;
  tags: Tag[];
  comment: string | null;
  isPurchase: boolean;
  imageUrl: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/products/${input.productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error };
  }
  return { ok: true };
}
