import { NextRequest, NextResponse } from "next/server";
import { createCommunityPost, getCommunityPosts } from "@/backend/community.service";
import { getCurrentUser } from "@/backend/auth";

type CommunityPostWithAuthor = Awaited<ReturnType<typeof getCommunityPosts>>[number];

export function serializePost(post: CommunityPostWithAuthor) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    authorName: post.author.nickname,
    imageUrls: post.imageUrls,
    createdAt: post.createdAt.toISOString(),
    commentCount: post._count.comments,
    likeCount: post._count.likes,
    viewerHasLiked: post.likes.length > 0,
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorName: comment.author.nickname,
      createdAt: comment.createdAt.toISOString(),
    })),
  };
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const query = req.nextUrl.searchParams.get("q") ?? "";
  const posts = await getCommunityPosts(query, user?.id);
  return NextResponse.json(posts.map(serializePost));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "커뮤니티 글 작성은 로그인이 필요합니다." }, { status: 401 });
  }

  const { title, content, imageUrls } = await req.json();
  const safeTitle = String(title ?? "").trim();
  const safeContent = String(content ?? "").trim();
  const safeImageUrls = Array.isArray(imageUrls)
    ? imageUrls
        .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
        .slice(0, 3)
    : [];

  if (safeTitle.length < 2 || safeContent.length < 5) {
    return NextResponse.json({ error: "제목과 내용을 조금 더 작성해주세요." }, { status: 400 });
  }

  const post = await createCommunityPost({
    title: safeTitle.slice(0, 80),
    content: safeContent.slice(0, 600),
    authorId: user.id,
    imageUrls: safeImageUrls,
  });

  return NextResponse.json(serializePost(post), { status: 201 });
}
