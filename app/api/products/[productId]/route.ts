import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/backend/product.service";
import type { Tag } from "@/app/lib/data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  try {
    const p = await getProductById(productId);
    return NextResponse.json({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      avgRating: p.avgRating,
      score: p.score,
      tier: p.tier,
      reviewCount: p.reviews.length,
      tags: Object.entries(p.tagCounts as Record<string, number>)
        .filter(([, n]) => n > 0)
        .map(([t]) => t as Tag),
      imageUrl: p.imageUrl,
      isNew: p.isNew,
      allergens: p.allergens ? p.allergens.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    });
  } catch {
    return NextResponse.json({ error: "제품을 찾을 수 없습니다." }, { status: 404 });
  }
}
