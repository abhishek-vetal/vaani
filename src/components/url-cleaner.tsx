"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const SENSITIVE_PARAMS = [
  "customer_session_token",
  "checkout_id",
  "token",
  "session_id",
];

function cleanCurrentUrl(router?: ReturnType<typeof useRouter>, pathname?: string) {
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.href);
    let modified = false;

    for (const param of SENSITIVE_PARAMS) {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        modified = true;
      }
    }

    if (modified) {
      const cleanSearch = url.searchParams.toString();
      const cleanUrl =
        url.pathname + (cleanSearch ? `?${cleanSearch}` : "") + url.hash;

      window.history.replaceState(window.history.state, "", cleanUrl);

      if (router && pathname) {
        router.replace(cleanUrl, { scroll: false });
      }
    }
  } catch {
    // Ignore URL parsing errors
  }
}

export function UrlCleaner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    cleanCurrentUrl(router, pathname);

    const handlePopState = () => {
      cleanCurrentUrl(router, pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, searchParams, router]);

  return null;
}
