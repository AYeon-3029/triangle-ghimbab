import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { createCommunityComment, getCommunityPost } from "@/backend/community.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "댓글 작성은 로그인이 필요합니다." }, { status: 401 });
  }

  const { postId } = await params;
  const post = await getCommunityPost(postId);
  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  const { content } = await req.json();
  const safeContent = String(content ?? "").trim();
  if (safeContent.length < 1) {
    return NextResponse.json({ error: "댓글 내용을 입력해주세요." }, { status: 400 });
  }

  const comment = await createCommunityComment({
    postId,
    authorId: user.id,
    content: safeContent.slice(0, 300),
  });

  return NextResponse.json({
    id: comment.id,
    content: comment.content,
    authorName: comment.author.nickname,
    createdAt: comment.createdAt.toISOString(),
  }, { status: 201 });
}
