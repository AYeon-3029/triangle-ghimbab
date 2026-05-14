import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/backend/product.service";
import type { Brand } from "@prisma/client";
import type { Tag } from "@/app/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand") as Brand | null;
  const tagLimit = Number(searchParams.get("tagLimit") ?? 10);

  const products = await getAllProducts(brand ?? undefined, tagLimit);

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      avgRating: p.avgRating,
      score: p.score,
      tier: p.tier,
      reviewCount: p._count.reviews,
      tags: Object.entries(p.tagCounts as Record<string, number>)
        .filter(([, n]) => n > 0)
        .map(([t]) => t as Tag),
      imageUrl: p.imageUrl,
      isNew: p.isNew,
      allergens: p.allergens,
    }))
  );
}
