import { NextRequest, NextResponse } from "next/server";
import { getReviewsByProduct, createReview } from "@/backend/review.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const reviews = await getReviewsByProduct(productId);
  return NextResponse.json(
    reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      tags: r.tags,
      comment: r.comment,
      imageUrl: r.imageUrl,
      createdAt: r.createdAt.toISOString(),
      isPurchase: r.isPurchase,
    }))
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const body = await req.json();
  const { rating, tags, comment, isPurchase, imageUrl } = body;

  if (typeof rating !== "number" || rating < 0.5 || rating > 5) {
    return NextResponse.json({ error: "유효하지 않은 별점입니다." }, { status: 400 });
  }

  try {
    const review = await createReview(productId, { rating, tags, comment, isPurchase, imageUrl });
    return NextResponse.json(
      {
        id: review.id,
        rating: review.rating,
        tags: review.tags,
        comment: review.comment,
        imageUrl: review.imageUrl,
        createdAt: review.createdAt.toISOString(),
        isPurchase: review.isPurchase,
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
