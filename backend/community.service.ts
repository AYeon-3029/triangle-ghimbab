import { prisma } from "./prisma";

export async function getCommunityPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}

export async function createCommunityPost(input: {
  title: string;
  content: string;
  authorId: string;
  imageUrls?: string[];
}) {
  return prisma.post.create({
    data: input,
    include: { author: { select: { nickname: true } } },
  });
}
