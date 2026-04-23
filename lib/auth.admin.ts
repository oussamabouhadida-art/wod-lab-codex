import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin(locale: string) {
  const cookieStore = await cookies();
  const key = cookieStore.get("admin_key")?.value;

  if (!process.env.ADMIN_SECRET_KEY || key !== process.env.ADMIN_SECRET_KEY) {
    redirect(`/${locale}/admin/login`);
  }
}
