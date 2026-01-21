import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect, useState } from "react";

import type { Route } from "./+types/root";
import appStylesHref from "./app.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Footer from "./components/footer";
import BudgetHeader from "./components/budget-header";
import BackToTopButton from "./components/back-to-top-button";
import { STATIC_ASSETS_PREFIX } from "./constants/config";

const DEFAULT_TITLE = "【持續更新】中央政府總預算案審查監督平台";
const DEFAULT_DESCRIPTION =
  "收錄歷年及最新中央政府預算審議情形，包含立委提案刪減和凍結的緣由和金額，便於搜尋及比較，更能即時追蹤最新審議進度。還可透過視覺化方式瀏覽，一目暸然。除了已數位化的資料，此平台也透過群眾協力（crowdsourcing）辨識提案掃描檔，歡迎至協作區加入合作行列。";
const DEFAULT_CANONICAL_URL =
  "https://readr-media.github.io/congress-budget-watch-platform/";
const DEFAULT_OG_IMAGE_URL = `${DEFAULT_CANONICAL_URL}image/og.png`;
const DEFAULT_TWITTER_CARD = "summary_large_image";
const DEFAULT_TWITTER_DOMAIN = "readr-media.github.io";

/**
 * NOTE：這裡設定了全域的 staleTime: 60秒。
 * 若未來有需要即時性的資料（例如：即時聊天、即時開票數據），
 * 請務必在該特定的 useQuery 中覆寫 staleTime: 0。
 * 對於 Mutation (如投票)，需確保成功後有正確 Invalidate 相關 Queries 以更新畫面。
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const MOBILE_BREAKPOINT = 768;
const DESKTOP_THRESHOLD_MULTIPLIER = 1;
const MOBILE_THRESHOLD_MULTIPLIER = 1.5;

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: appStylesHref,
    as: "style",
  },
  {
    rel: "stylesheet",
    href: appStylesHref,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const computeThreshold = () => {
      const multiplier =
        window.innerWidth < MOBILE_BREAKPOINT
          ? MOBILE_THRESHOLD_MULTIPLIER
          : DESKTOP_THRESHOLD_MULTIPLIER;
      return window.innerHeight * multiplier;
    };

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > computeThreshold());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${STATIC_ASSETS_PREFIX}favicon.svg`}
        />
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={DEFAULT_CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={DEFAULT_OG_IMAGE_URL} />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1260" />
        <meta name="twitter:card" content={DEFAULT_TWITTER_CARD} />
        <meta property="twitter:domain" content={DEFAULT_TWITTER_DOMAIN} />
        <meta property="twitter:url" content={DEFAULT_CANONICAL_URL} />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE_URL} />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-146517224-1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-146517224-1', {'page_type': 'home', 'content_group1': 'home'});
            `,
          }}
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
          <div>
            <BudgetHeader />
          </div>
            <main>{children}</main>
            <Footer />
          </div>
          <BackToTopButton visible={showBackToTop} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
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
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
