import { NextResponse } from "next/server";

/**
 * POST /api/login — local, self-contained admin login.
 * Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD env vars
 * (see .env.local). Sets userEmail/userRole cookies for middleware.
 */
export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const adminEmail = (process.env.ADMIN_EMAIL ?? "saikotroydev@gmail.com")
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  const matches =
    adminPassword.length > 0 &&
    email === adminEmail &&
    password === adminPassword;

  if (!matches) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({
    message: "Login successful",
    email: adminEmail,
    role: "admin",
  });

  res.cookies.set("userEmail", adminEmail, { path: "/", httpOnly: true, sameSite: "lax" });
  res.cookies.set("userRole", "admin", { path: "/", httpOnly: true, sameSite: "lax" });

  return res;
}
