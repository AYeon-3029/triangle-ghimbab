import { Brand, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { calcScore, calcTagCounts, calcTier, getTopTags, sortByTierThenScore } from "../utils/scoring";

export type CreateProductInput = {
  name: string;
  brand: Brand;
  imageUrl: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export async function getAllProducts(brand?: Brand, tagLimit = 3) {
  const products = await prisma.product.findMany({
    where: brand ? { brand } : undefined,
    include: { _count: { select: { reviews: true } } },
  });

  const sorted = sortByTierThenScore(products);

  return sorted.map((p) => ({
    ...p,
    topTags: getTopTags(p.tagCounts as Record<string, number>, tagLimit),
  }));
}

export async function getProductById(id: string) {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    include: { reviews: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createProduct(data: CreateProductInput) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

/**
 * 리뷰가 추가/수정/삭제될 때마다 호출해서
 * avgRating, score, tier, tagCounts 를 재계산해 Product에 반영한다.
 */
export async function recalcProduct(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true, imageUrl: true, tags: true },
  });

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
  const imageCount = reviews.filter((r) => r.imageUrl !== null).length;
  const score = calcScore(avgRating, reviewCount, imageCount);
  const tier = calcTier(score, reviewCount);
  const tagCounts = calcTagCounts(reviews.map((r) => r.tags));

  return prisma.product.update({
    where: { id: productId },
    data: {
      avgRating,
      score,
      tier,
      tagCounts: tagCounts as Prisma.InputJsonValue,
    },
  });
}
