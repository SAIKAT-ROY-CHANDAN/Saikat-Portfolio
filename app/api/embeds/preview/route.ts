import { NextRequest, NextResponse } from "next/server";
import { detectPlatform, platformLabel } from "@/lib/social";

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function authorHandleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "";
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("linkedin")) {
      // linkedin.com/in/handle or linkedin.com/in/handle-123/...
      const idx = parts.findIndex((p) => p === "in");
      const handle = idx >= 0 ? parts[idx + 1] : "";
      return handle && !/^\d+$/.test(handle) ? `@${handle}` : "";
    }
    if (host.includes("facebook")) {
      const h = parts[0];
      if (!h || /^(posts|photo|reel|watch|story|groups|profile\.php)/.test(h))
        return "";
      return `@${h}`;
    }
    if (host.includes("x.com") || host.includes("twitter.com")) {
      const h = parts[0];
      if (!h || /^(posts|status|i)/.test(h)) return "";
      return `@${h}`;
    }
    return "";
  } catch {
    return "";
  }
}

function isProfileUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("linkedin")) return parts.includes("in") || parts.includes("company");
    if (host.includes("facebook"))
      return (
        parts.length === 1 &&
        !/^(posts|photo|reel|watch|story|groups|profile\.php)/.test(parts[0])
      );
    if (host.includes("x.com") || host.includes("twitter.com"))
      return parts.length === 1 && parts[0] !== "status";
    return false;
  } catch {
    return false;
  }
}

/** "Name (@handle) on X" / "Name (@handle) on Twitter" -> "Name" */
function authorNameFromTitle(title: string, platform: string): string {
  if (!(platform === "x" || platform === "twitter" || platform === "linkedin"))
    return "";
  const m = title.match(/^(.+?)\s+\(@[^)]+\)\s+on\s+(?:X|Twitter)$/i);
  if (m) return m[1].trim();
  const m2 = title.match(/^(.+?)\s*\|\s*LinkedIn$/i);
  if (m2) return m2[1].trim();
  return "";
}

function extractPublishedTime(html: string): string {
  const pick = (prop: string) => {
    const m =
      html.match(
        new RegExp(
          `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
          "i"
        )
      ) ||
      html.match(
        new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
          "i"
        )
      );
    return m?.[1] ?? "";
  };
  const fromMeta =
    pick("article:published_time") ||
    pick("og:published_time") ||
    pick("book:release_date") ||
    pick("date");
  if (fromMeta) {
    const d = new Date(fromMeta);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1];
  if (timeTag) {
    const d = new Date(timeTag);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const ldBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (ldBlocks) {
    for (const block of ldBlocks) {
      const raw = block.replace(/<script[^>]*>|<\/script>/gi, "").trim();
      const candidates = raw.match(/"datePublished"\s*:\s*"([^"]+)"/gi);
      if (candidates) {
        const iso = candidates[0].match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1] ?? "";
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d.toISOString();
      }
      const created = raw.match(/"@type"\s*:\s*"(?:Article|SocialMediaPosting)"/gi);
      if (created && created.length) {
        const c2 = raw.match(/"(?:dateCreated|uploadDate|dateModified)"\s*:\s*"([^"]+)"/i)?.[1];
        if (c2) {
          const d = new Date(c2);
          if (!isNaN(d.getTime())) return d.toISOString();
        }
      }
    }
  }
  return "";
}

/**
 * In-page text extraction: social platforms (X/FB) and normal articles embed
 * the full text in <meta> tags / JSON-LD. We grab the LONGEST candidate so the
 * post's actual content shows up in the card, not just a 160-char clip.
 */
function parsePostText(html: string): string {
  const pickMeta = (name: string) => {
    for (const pat of [
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)`,
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
    ]) {
      const m = html.match(new RegExp(pat, "i"));
      if (m?.[1]) return m[1];
    }
    return "";
  };
  const candidates: string[] = [
    pickMeta("og:description"),
    pickMeta("twitter:description"),
    pickMeta("description"),
    pickMeta("og:title"),
  ];
  // JSON-LD: articleBody / text from Article + SocialMediaPosting
  const ldBlocks = html.match(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (ldBlocks) {
    for (const block of ldBlocks) {
      const raw = block.replace(/<script[^>]*>|<\/script>/gi, "").trim();
      for (const key of ["articleBody", "text", "caption"]) {
        const m = raw.match(
          new RegExp(`"${key}"\\s*:\\s*"([^"]{20,})`, "i")
        );
        if (m?.[1]) candidates.push(m[1]);
      }
    }
  }
  // X / Twitter: the tweet text lives in __NEXT_DATA__ as "full_text"
  const xFull = html.match(/"full_text"\s*:\s*"((?:\\.|[^"\\]){20,})"/i);
  if (xFull?.[1]) candidates.push(xFull[1].replace(/\\(.)/g, "$1"));

  let text = "";
  for (const c of candidates) {
    const clean = c.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
    if (clean.length > text.length) text = clean;
  }
  return text.slice(0, 4000);
}

/**
 * Best-effort OpenGraph/date preview for a pasted social URL (post OR profile).
 * LinkedIn/FB/X often block scrapers, so we always return a usable fallback.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url).searchParams.get("url") ?? "";
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const platform = detectPlatform(url);
  const profile = isProfileUrl(url);
  const fallback = {
    url,
    platform,
    platformLabel: platformLabel(platform),
    isProfile: profile,
    title: "",
    description: "",
    content: "",
    image: "",
    authorName: "",
    authorHandle: authorHandleFromUrl(url),
    publishedTime: "",
  };

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://saikat-portfolio)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    const html = await res.text();
    const pick = (prop: string) => {
      const m =
        html.match(
          new RegExp(
            `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
            "i"
          )
        ) ||
        html.match(
          new RegExp(
            `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
            "i"
          )
        );
      return m?.[1] ?? "";
    };
    const title =
      pick("og:title") ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
      "";
    const description = pick("og:description");
    const publishedTime = extractPublishedTime(html);
    const titleOut = title.trim();

    return NextResponse.json({
      ...fallback,
      title: titleOut,
      description,
      content: parsePostText(html),
      image: pick("og:image"),
      authorName: authorNameFromTitle(titleOut, platform) || pick("og:site_name"),
      publishedTime,
      ...(publishedTime ? { publishedAt: ymd(new Date(publishedTime)) } : {}),
    });
  } catch {
    // Direct scrape failed (typical for LinkedIn/FB/X) — nothing more we can
    // read server-side; the editor handles these fields with manual entry.
    return NextResponse.json(fallback);
  }
}