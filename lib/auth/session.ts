import { auth } from "./index";
import type { Session } from "next-auth";

/**
 * 現在のセッションを取得する
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}

/**
 * セッションからユーザーIDを取得する
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * セッションからユーザー情報を取得する
 */
export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
