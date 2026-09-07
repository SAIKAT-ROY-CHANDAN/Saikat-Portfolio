"use client";
import { useCallback, useEffect, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaChartLine,
  FaEye,
  FaUserGroup,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { LuChartBar, LuMousePointerClick, LuRefreshCw } from "react-icons/lu";

interface DayPoint {
  date: string;
  views: number;
  visitors: number;
}

interface ClickRow {
  label: string;
  clicks: number;
  target: string;
}

interface AnalyticsData {
  totalViews: number;
  totalUniqueVisitors: number;
  series: DayPoint[];
  topProjects: ClickRow[];
  topBlogs: ClickRow[];
  topSocials: ClickRow[];
  recentEvents: {
    type: string;
    page: string;
    kind: string;
    label: string;
    target: string;
    createdAt: string;
  }[];
}

function shortDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function EventIcon({ kind }: { kind: string }) {
  if (kind === "project") return <FaArrowUpRightFromSquare className="text-purple-300" size={13} />;
  if (kind === "blog-out") return <FaArrowUpRightFromSquare className="text-cyan-300" size={13} />;
  if (kind === "social") return <FaUserGroup className="text-fuchsia-300" size={13} />;
  return <LuMousePointerClick className="text-white-200" size={13} />;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized — log in as admin to view analytics.");
        } else {
          setError("Failed to load analytics.");
        }
        return;
      }
      setData(await res.json());
    } catch {
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-white-200 py-16 justify-center">
        <LuRefreshCw className="animate-spin text-purple" size={18} />
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return <p className="text-red-300 py-12 text-center">{error}</p>;
  }

  if (!data) return null;

  const series = data.series ?? [];
  const maxViews = Math.max(1, ...series.map((s) => s.views));
  const totalClicks =
    (data.topProjects?.reduce((a, r) => a + r.clicks, 0) ?? 0) +
    (data.topBlogs?.reduce((a, r) => a + r.clicks, 0) ?? 0) +
    (data.topSocials?.reduce((a, r) => a + r.clicks, 0) ?? 0);

  const statCards = [
    { label: "Total page views", value: data.totalViews ?? 0, icon: FaEye, tint: "text-cyan-300" },
    { label: "Unique visitors", value: data.totalUniqueVisitors ?? 0, icon: FaUserGroup, tint: "text-purple-300" },
    { label: "Outbound clicks", value: totalClicks, icon: LuMousePointerClick, tint: "text-fuchsia-300" },
    { label: "Days tracked", value: series.filter((s) => s.views > 0).length, icon: FaClockRotateLeft, tint: "text-blue-300" },
  ];

  const renderClickTable = (title: string, rows: ClickRow[], empty: string) => (
    <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-5">
      <h3 className="font-bold text-white text-sm mb-3">{title}</h3>
      {rows.length ? (
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3">
              <span className="min-w-0 flex-1 truncate text-sm text-white-100">{r.label}</span>
              <span className="text-xs text-white-200 font-mono">{r.clicks}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-white-200">{empty}</p>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <FaChartLine className="text-purple" /> Analytics
      </h2>
      <p className="text-sm text-white-200 mt-1">
        Site visits and outbound link clicks tracked from your own MongoDB.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {statCards.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-2xl bg-black-200 border border-white/10 p-5">
            <Icon className={tint} size={20} />
            <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-white-200 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-6 mt-4">
        <h3 className="font-bold text-white text-sm inline-flex items-center gap-2">
          <LuChartBar className="text-purple" size={15} /> Page views — last 30 days
        </h3>
        {series.filter((s) => s.views > 0).length ? (
          <div className="flex items-end gap-1 mt-5 h-44">
            {series.map((s) => (
              <div
                key={s.date}
                className="flex-1 flex flex-col items-center justify-end h-full group"
                title={`${shortDate(s.date)} — ${s.views} views, ${s.visitors} visitors`}
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-purple-600/70 to-cyan-400/80 transition-all duration-300 group-hover:from-purple-500 group-hover:to-cyan-300"
                  style={{ height: `${Math.max(2, Math.round((s.views / maxViews) * 100))}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white-200 mt-5">
            No page views recorded yet — visit your site and they&apos;ll appear here.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {renderClickTable("Top project clicks", data.topProjects ?? [], "No project clicks yet.")}
        {renderClickTable("Top blog outbound clicks", data.topBlogs ?? [], "No blog outbound clicks yet.")}
        {renderClickTable("Top social clicks", data.topSocials ?? [], "No social clicks yet.")}
      </div>

      <div className="rounded-2xl bg-black-200 border border-white/10 p-4 sm:p-5 mt-4">
        <h3 className="font-bold text-white text-sm mb-3">Recent activity</h3>
        {data.recentEvents?.length ? (
          <ul className="divide-y divide-white/5 max-h-80 overflow-auto">
            {data.recentEvents.map((e, i) => (
              <li key={i} className="flex items-center gap-3 py-2 text-sm">
                <EventIcon kind={e.kind} />
                <span className="min-w-0 flex-1 truncate text-white-100">
                  {e.type === "pageview" ? (
                    <>Visited <span className="font-mono text-cyan-200">{e.page}</span></>
                  ) : (
                    <>
                      Clicked{" "}
                      <span className="text-white">{e.label || e.target || "link"}</span>
                      {e.target ? (
                        <a
                          href={e.target}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 inline-flex items-center gap-0.5 text-xs text-purple-300 hover:underline"
                        >
                          (open)
                        </a>
                      ) : null}
                    </>
                  )}
                </span>
                <span className="shrink-0 text-xs text-white-200">
                  {shortDate(e.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white-200">No events recorded yet.</p>
        )}
      </div>
    </div>
  );
}