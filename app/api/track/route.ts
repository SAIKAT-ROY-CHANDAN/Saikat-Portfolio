import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";

const MAX_LEN = 500;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: true });
    }

    const type = body.type === "click" ? "click" : "pageview";
    const page =
      typeof body.page === "string" && body.page.startsWith("/")
        ? body.page.slice(0, MAX_LEN)
        : "/";
    const kind =
      typeof body.kind === "string" ? body.kind.slice(0, 50) : undefined;
    const label =
      typeof body.label === "string" ? body.label.slice(0, MAX_LEN) : undefined;
    const target =
      typeof body.target === "string" ? body.target.slice(0, MAX_LEN) : undefined;
    const visitorId =
      typeof body.visitorId === "string" ? body.visitorId.slice(0, 100) : undefined;

    await connectToDatabase();
    await AnalyticsEvent.create({ type, page, kind, label, target, visitorId });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}