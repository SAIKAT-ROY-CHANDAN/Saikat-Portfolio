import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";

function isAdmin(req: NextRequest) {
  return req.cookies.get("userRole")?.value === "admin";
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const [total, unique, daySeries, topProjects, topBlogs, topSocials, recent] =
      await Promise.all([
        AnalyticsEvent.countDocuments({ type: "pageview" }),
        AnalyticsEvent.distinct("visitorId", { type: "pageview" }),
        AnalyticsEvent.aggregate([
          { $match: { type: "pageview", createdAt: { $gte: daysAgo(30) } } },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              views: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "click", kind: "project" } },
          {
            $group: {
              _id: "$label",
              clicks: { $sum: 1 },
              target: { $first: "$target" },
            },
          },
          { $sort: { clicks: -1 } },
          { $limit: 10 },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "click", kind: "blog-out" } },
          {
            $group: {
              _id: "$label",
              clicks: { $sum: 1 },
              target: { $first: "$target" },
            },
          },
          { $sort: { clicks: -1 } },
          { $limit: 10 },
        ]),
        AnalyticsEvent.aggregate([
          { $match: { type: "click", kind: "social" } },
          { $group: { _id: "$label", clicks: { $sum: 1 } } },
          { $sort: { clicks: -1 } },
          { $limit: 10 },
        ]),
        AnalyticsEvent.find({})
          .sort({ createdAt: -1 })
          .limit(20)
          .lean(),
      ]);

    const series = (daySeries ?? []).map((d: any) => ({
      date: d._id,
      views: d.views,
      visitors: d.visitors?.length ?? 0,
    }));

    const mapClicks = (rows: any[]) =>
      rows
        .filter((r) => r._id)
        .map((r) => ({ label: r._id, clicks: r.clicks, target: r.target ?? "" }));

    const recentEvents = (recent ?? []).map((e: any) => ({
      type: e.type,
      page: e.page,
      kind: e.kind ?? "",
      label: e.label ?? "",
      target: e.target ?? "",
      createdAt: e.createdAt,
    }));

    return NextResponse.json({
      totalViews: total,
      totalUniqueVisitors: unique?.length ?? 0,
      series,
      topProjects: mapClicks(topProjects ?? []),
      topBlogs: mapClicks(topBlogs ?? []),
      topSocials: mapClicks(topSocials ?? []),
      recentEvents,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}