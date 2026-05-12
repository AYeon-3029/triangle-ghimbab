import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/backend/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const user = await loginUser(String(email ?? ""), String(password ?? ""));
    return NextResponse.json({
      user: { id: user.id, email: user.email, nickname: user.nickname },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "로그인에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
