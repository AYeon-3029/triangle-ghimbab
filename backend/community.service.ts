import { prisma } from "./prisma";

function postInclude(viewerId?: string) {
  return {
    author: { select: { nickname: true } },
    comments: {
      orderBy: { createdAt: "asc" as const },
      include: { author: { select: { nickname: true } } },
    },
    likes: viewerId
      ? { where: { authorId: viewerId }, select: { id: true } }
      : { select: { id: true }, take: 0 },
    _count: { select: { comments: true, likes: true } },
  };
}

export async function getCommunityPosts(query?: string, viewerId?: string) {
  const keyword = query?.trim();
  return prisma.post.findMany({
    where: keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { content: { contains: keyword, mode: "insensitive" } },
            { author: { nickname: { contains: keyword, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: postInclude(viewerId),
  });
}

export async function getCommunityPost(postId: string, viewerId?: string) {
  return prisma.post.findUnique({
    where: { id: postId },
    include: postInclude(viewerId),
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
    include: postInclude(input.authorId),
  });
}

export async function createCommunityComment(input: {
  postId: string;
  authorId: string;
  content: string;
}) {
  return prisma.comment.create({
    data: input,
    include: { author: { select: { nickname: true } } },
  });
}

export async function toggleCommunityPostLike(postId: string, authorId: string) {
  const existing = await prisma.postLike.findUnique({
    where: { authorId_postId: { authorId, postId } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({ data: { authorId, postId } });
  }

  const likeCount = await prisma.postLike.count({ where: { postId } });
  return { likeCount, viewerHasLiked: !existing };
}
