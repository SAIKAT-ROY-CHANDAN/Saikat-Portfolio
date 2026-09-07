import type { SourcePlatform } from "@/types";

export function detectPlatform(url: string): SourcePlatform {
  const u = url.toLowerCase();
  if (u.includes("linkedin.com")) return "linkedin";
  if (u.includes("facebook.com") || u.includes("fb.watch")) return "facebook";
  if (
    u.includes("x.com") ||
    u.includes("twitter.com") ||
    u.includes("nitter.net")
  )
    return "x";
  return "native";
}

export function platformLabel(platform?: string) {
  switch (platform) {
    case "linkedin":
      return "LinkedIn";
    case "facebook":
      return "Facebook";
    case "x":
      return "X";
    default:
      return "Blog";
  }
}

export function isSocialUrl(url?: string | null) {
  if (!url) return false;
  return detectPlatform(url) !== "native";
}
