import { redirect } from "next/navigation";
import { auth } from "./index";
import type { AuthUser } from "@/types/auth";

/**
 * 認証が必要なページで使用するガード関数
 * 未認証の場合はログインページにリダイレクト
 */
export async function requireAuth(): Promise<AuthUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

/**
 * 認証済みユーザーがアクセスできないページで使用するガード関数
 * 認証済みの場合はダッシュボードにリダイレクト
 */
export async function requireGuest(): Promise<void> {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }
}

/**
 * 認証状態を取得する（リダイレクトなし）
 */
export async function getAuthUser(): Promise<AuthUser | null> {
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

/**
 * 認証済みかどうかを確認する
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}
