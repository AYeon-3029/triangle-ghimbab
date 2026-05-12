import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getCommunityPost, toggleCommunityPostLike } from "@/backend/community.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "좋아요는 로그인이 필요합니다." }, { status: 401 });
  }

  const { postId } = await params;
  const post = await getCommunityPost(postId);
  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(await toggleCommunityPostLike(postId, user.id));
}
