import { useState, useMemo } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { MobileHeader } from "./shared/layout/sidebar/components/MobileHeader";
import { Sidebar } from "./shared/layout/sidebar/Sidebar";
import type { Theme } from "./shared/layout/sidebar/schema";
import { getActiveNavigationItems } from "./shared/layout/sidebar/server";
import { mapNavigationItemsWithIcons } from "./shared/layout/sidebar/service";

// Cookie からテーマを取得
function getThemeFromCookie(cookieHeader: string | null): Theme {
  if (!cookieHeader) return "light";
  const match = cookieHeader.match(/theme=(light|dark)/);
  return (match?.[1] as Theme) ?? "light";
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const theme = getThemeFromCookie(cookieHeader);
  const navigationItems = await getActiveNavigationItems();
  return { theme, navigationItems };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const initialTheme = data?.theme ?? "light";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ナビゲーション項目にアイコンをマッピング（クライアント側で実行）
  const navigationItemsWithIcons = useMemo(
    () => mapNavigationItemsWithIcons(data?.navigationItems ?? []),
    [data?.navigationItems]
  );

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* SSR 時のテーマフラッシュ防止用スクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var cookieTheme = document.cookie.match(/theme=(light|dark)/);
                var theme = cookieTheme
                  ? cookieTheme[1]
                  : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* モバイルヘッダー */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* サイドバー */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          initialTheme={initialTheme}
          navigationItems={navigationItemsWithIcons}
        />

        {/* メインコンテンツ */}
        <main className="pt-16 lg:pt-0 lg:pl-72 min-h-screen">
          <div className="p-4 lg:p-6">{children}</div>
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
