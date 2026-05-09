import { Tag } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { recalcProduct } from "./product.service";

export type CreateReviewInput = {
  rating: number;
  comment?: string;
  imageUrl?: string;
  tags?: Tag[];
  isPurchase?: boolean;
};

export type UpdateReviewInput = Partial<CreateReviewInput>;

export async function getReviewsByProduct(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewById(id: string) {
  return prisma.review.findUniqueOrThrow({ where: { id } });
}

export async function createReview(productId: string, data: CreateReviewInput) {
  // 제품 존재 여부 확인
  await prisma.product.findUniqueOrThrow({ where: { id: productId } });

  const review = await prisma.review.create({
    data: { ...data, productId },
  });

  await recalcProduct(productId);
  return review;
}

export async function updateReview(id: string, data: UpdateReviewInput) {
  const review = await prisma.review.update({ where: { id }, data });
  await recalcProduct(review.productId);
  return review;
}

export async function deleteReview(id: string) {
  const review = await prisma.review.delete({ where: { id } });
  await recalcProduct(review.productId);
  return review;
}
