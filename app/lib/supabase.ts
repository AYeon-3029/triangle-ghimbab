import { createClient } from "@supabase/supabase-js";
import type { Product, Tag } from "./data";

// Supabase 클라이언트는 Storage(이미지 업로드) 전용
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

export type ReviewRow = {
  id: string;
  rating: number;
  tags: Tag[];
  comment: string | null;
  imageUrl: string | null;
  createdAt: string;
  isPurchase: boolean;
  authorName: string;
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
  const supabase = getSupabaseClient();
  if (!supabase) return null;
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

export async function fetchMe() {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
}
