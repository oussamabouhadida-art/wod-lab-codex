import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

async function login(formData: FormData) {
  "use server";

  const locale = String(formData.get("locale") || "en");
  const key = String(formData.get("admin_key") || "");
  if (!process.env.ADMIN_SECRET_KEY) throw new Error("Missing ADMIN_SECRET_KEY");

  if (key === process.env.ADMIN_SECRET_KEY) {
    const cookieStore = await cookies();
    cookieStore.set("admin_key", key, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect(`/${locale}/admin`);
  }

  redirect(`/${locale}/admin/login?error=1`);
}

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-4 font-display text-5xl uppercase text-heading">Enter the Lab</h1>
      <form action={login} className="space-y-3 rounded-[4px] border border-divider bg-surface-1 p-4">
        <input type="hidden" name="locale" value={locale} />
        <Input name="admin_key" type="password" placeholder="Admin key" required />
        <Button type="submit" className="w-full">Enter</Button>
      </form>
    </section>
  );
}
