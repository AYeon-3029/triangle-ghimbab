import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/auth";
import { getCommunityPost } from "@/backend/community.service";
import { serializePost } from "../route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const user = await getCurrentUser();
  const post = await getCommunityPost(postId, user?.id);

  if (!post) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(serializePost(post));
}
