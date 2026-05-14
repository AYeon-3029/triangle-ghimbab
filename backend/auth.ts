import "server-only";

import bcrypt from "bcryptjs";
import { createHash } from "crypto"; // signUserId에서 세션 서명용으로만 사용
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "triangle_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

function secret() {
  const s = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET 환경변수가 설정되지 않았습니다.");
  return s;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  return bcrypt.compare(password, stored);
}

function signUserId(userId: string) {
  const signature = createHash("sha256").update(`${userId}:${secret()}`).digest("hex");
  return `${userId}.${signature}`;
}

function readSignedUserId(value?: string) {
  if (!value) return null;
  const [userId] = value.split(".");
  return userId && signUserId(userId) === value ? userId : null;
}

export async function createUser(input: { email: string; nickname: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const nickname = input.nickname.trim();
  if (!email.includes("@")) throw new Error("이메일 형식을 확인해주세요.");
  if (nickname.length < 2) throw new Error("닉네임은 2자 이상이어야 합니다.");
  if (input.password.length < 6) throw new Error("비밀번호는 6자 이상이어야 합니다.");

  return prisma.user.create({
    data: { email, nickname, password: await hashPassword(input.password) },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !await verifyPassword(password, user.password)) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  await setSession(user.id);
  return user;
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, signUserId(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const store = await cookies();
  const userId = readSignedUserId(store.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nickname: true },
  });
}
