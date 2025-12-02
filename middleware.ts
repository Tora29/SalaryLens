import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Edge Runtime互換のmiddleware
 * 認証チェックはauth.config.tsのauthorizedコールバックで処理
 */
export default auth;

export const config = {
  matcher: [
    /*
     * 以下のパスを除くすべてのリクエストにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (ファビコン)
     * - public フォルダ内のファイル
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};
