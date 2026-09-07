import { projects, testimonials, workExperience } from "@/data";

function baseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * Fetch from local API first, fall back to external API, then static data.
 * - Local empty array => static seed (no wait on cold external backend in dev).
 * - External fetch has a short timeout so one cold backend can't stall the page.
 */
async function safeFetch<T>(localPath: string, remotePath: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${baseUrl()}${localPath}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length > 0) return data as T;
        // Empty DB: in dev return seed immediately; in prod try remote once.
        if (isDev) return fallback;
      } else if (data && Array.isArray((data as { items?: unknown }).items)) {
        return (data as { items: unknown }).items as T;
      } else if (data && typeof data === "object") {
        return data as T;
      }
    }
  } catch {
    // fall through to remote
  }

  try {
    const res = await fetch(remotePath, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    if (Array.isArray(data)) {
      if (data.length === 0) return fallback;
      return data as T;
    }
    if (data && Array.isArray((data as { items?: unknown }).items))
      return (data as { items: unknown }).items as T;
    if (data && typeof data === "object") return data as T;
  } catch {
    // remote cold/down => static seed
  }
  return fallback;
}

const externalBase =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://portfolio-backend-tawny-gamma.vercel.app";

export async function getBlogs(): Promise<any[]> {
  return safeFetch("/api/blogs", `${externalBase}/api/blogs`, []);
}

export async function getProjects(): Promise<any[]> {
  return safeFetch("/api/projects", `${externalBase}/api/projects`, projects);
}

export async function getExperience(): Promise<any[]> {
  return safeFetch(
    "/api/experience",
    `${externalBase}/api/experience`,
    workExperience
  );
}

export async function getTestimonials(): Promise<any[]> {
  return safeFetch(
    "/api/testimonials",
    `${externalBase}/api/testimonials`,
    testimonials
  );
}

export async function getEducation(): Promise<any[]> {
  return safeFetch("/api/education", `${externalBase}/api/education`, []);
}

export async function getProfile(): Promise<any> {
  return safeFetch("/api/profile", `${externalBase}/api/profile`, null);
}
