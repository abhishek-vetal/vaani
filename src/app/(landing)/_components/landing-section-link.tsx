"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

type LandingSectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  id: string;
  children: ReactNode;
};

export function LandingSectionLink({ id, children, onClick, ...props }: LandingSectionLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onClick?.(event);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    event.currentTarget.closest("details")?.removeAttribute("open");
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  return (
    <a href={`#${id}`} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}