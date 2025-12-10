import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useRouteLoaderData,
} from "react-router";

import { Moon, Sun } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";

type Theme = "light" | "dark";

// Cookie からテーマを取得
function getThemeFromCookie(cookieHeader: string | null): Theme {
  if (!cookieHeader) return "light";
  const match = cookieHeader.match(/theme=(light|dark)/);
  return (match?.[1] as Theme) ?? "light";
}

// Cookie 文字列を生成
function createThemeCookie(theme: Theme): string {
  return `theme=${theme}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
}

export function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const theme = getThemeFromCookie(cookieHeader);
  return { theme };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme");

  // バリデーション: light または dark のみ許可
  if (theme !== "light" && theme !== "dark") {
    return data({ error: "Invalid theme" }, { status: 400 });
  }

  return data(
    { theme },
    { headers: { "Set-Cookie": createThemeCookie(theme) } }
  );
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
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const fetcher = useFetcher<typeof action>();

  // fetcher のレスポンスがあればそれを優先、なければ loader のデータを使用
  const theme =
    fetcher.data && "theme" in fetcher.data
      ? fetcher.data.theme
      : (loaderData?.theme ?? "light");
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <html lang="ja" className={theme === "dark" ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="fixed top-4 right-4 z-50">
          <fetcher.Form method="post" action="/">
            <input type="hidden" name="theme" value={nextTheme} />
            <button
              type="submit"
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${nextTheme} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </fetcher.Form>
        </header>
        {children}
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
