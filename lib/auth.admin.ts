import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function requireAdmin(locale: string) {
  const cookieStore = await cookies();
  const key = cookieStore.get("admin_key")?.value;

  if (!process.env.ADMIN_SECRET_KEY || key !== process.env.ADMIN_SECRET_KEY) {
    redirect(`/${locale}/admin/login`);
  }
}

export function isAdminRequest(request: NextRequest) {
  const key = request.cookies.get("admin_key")?.value;
  return Boolean(process.env.ADMIN_SECRET_KEY && key === process.env.ADMIN_SECRET_KEY);
}
