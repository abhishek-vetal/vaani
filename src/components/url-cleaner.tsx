"use client";

import { useEffect } from "react";

export function UrlCleaner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const sensitiveParams = [
        "customer_session_token",
        "checkout_id",
        "token",
        "session_id",
      ];

      let modified = false;
      for (const param of sensitiveParams) {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          modified = true;
        }
      }

      if (modified) {
        const cleanSearch = url.searchParams.toString();
        const cleanUrl =
          url.pathname + (cleanSearch ? `?${cleanSearch}` : "") + url.hash;
        window.history.replaceState(null, "", cleanUrl);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  return null;
}
