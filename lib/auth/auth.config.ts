import type { NextAuthConfig } from "next-auth";

// 型拡張を適用
import "@/types/auth";

/**
 * Edge Runtime互換のNextAuth設定
 * middleware.tsで使用される
 * 注意: authorize callbackやDB接続を含めないこと
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Credentialsはconfig.tsで追加
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // 公開ルート
      const publicRoutes = ["/", "/login", "/register"];
      const isPublicRoute =
        publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");

      if (isPublicRoute) {
        // ログイン済みユーザーがログインページにアクセスした場合
        if (isLoggedIn && pathname === "/login") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // 認証が必要なルート
      if (!isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
  trustHost: true,
};
