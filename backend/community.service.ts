import { prisma } from "./prisma";

export async function getCommunityPosts() {
  return prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { nickname: true } } },
  });
}

export async function createCommunityPost(input: {
  title: string;
  content: string;
  authorId: string;
}) {
  return prisma.communityPost.create({
    data: input,
    include: { author: { select: { nickname: true } } },
  });
}
