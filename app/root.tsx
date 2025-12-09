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
import DataProgressMarquee from "./components/data-progress-marquee";
import BackToTopButton from "./components/back-to-top-button";
import { STATIC_ASSETS_PREFIX } from "./constants/config";
// Create a client
const queryClient = new QueryClient();
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
        <link rel="icon" href={`${STATIC_ASSETS_PREFIX}/favicon.ico`} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
            <div>
              <BudgetHeader />
              <DataProgressMarquee />
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
