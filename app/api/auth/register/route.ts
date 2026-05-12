import { NextRequest, NextResponse } from "next/server";
import { createUser, setSession } from "@/backend/auth";

export async function POST(req: NextRequest) {
  const { email, nickname, password } = await req.json();
  try {
    const user = await createUser({
      email: String(email ?? ""),
      nickname: String(nickname ?? ""),
      password: String(password ?? ""),
    });
    await setSession(user.id);
    return NextResponse.json(
      { user: { id: user.id, email: user.email, nickname: user.nickname } },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "회원가입에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
