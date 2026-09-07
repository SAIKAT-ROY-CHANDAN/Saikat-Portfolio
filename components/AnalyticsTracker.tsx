"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SKIP_PREFIXES = ["/dashboard", "/login"];

function getVisitorId() {
  try {
    let id = localStorage.getItem("analytics_visitor_id");
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("analytics_visitor_id", id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({ visitorId: getVisitorId(), ...payload });
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    }
  } catch {
    // tracking must never break browsing
  }
}

const AnalyticsTracker = () => {
  const pathname = usePathname();
  const lastRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return;
    if (lastRef.current === pathname) return;
    lastRef.current = pathname;
    send({ type: "pageview", page: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        "a[data-track]"
      ) as HTMLAnchorElement | null;
      if (!el) return;

      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(el.dataset.track ?? "{}");
      } catch {
        parsed = {};
      }

      send({
        type: "click",
        page: window.location.pathname,
        kind: typeof parsed.kind === "string" ? parsed.kind : "link",
        label: typeof parsed.label === "string" ? parsed.label : undefined,
        target: el.href,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
};

export default AnalyticsTracker;