import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations/auth.schema";
import { getUserByEmail, verifyPassword } from "./utils";
import { authConfig } from "./auth.config";

/**
 * フルNextAuth設定（Node.js Runtime用）
 * API routesで使用される
 * auth.configを拡張してCredentials providerを追加
 */
export const fullAuthConfig: NextAuthConfig = {
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 入力バリデーション
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // ユーザー取得
        const user = await getUserByEmail(email);
        if (!user || !user.hashedPassword) {
          return null;
        }

        // パスワード検証
        const isValid = await verifyPassword(password, user.hashedPassword);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      const typedToken = token as JWT;
      session.user.id = typedToken.id;
      session.user.email = typedToken.email;
      session.user.name = typedToken.name;
      return session;
    },
  },
};
