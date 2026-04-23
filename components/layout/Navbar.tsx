import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

export async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <header className="sticky top-0 z-30 border-b border-divider bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" locale={locale} className="font-display text-3xl uppercase tracking-wide text-lime">
          WodLab
        </Link>
        <nav className="flex items-center gap-6 text-sm text-body">
          <Link href="/wods" locale={locale} className="hover:text-heading">{t("wods")}</Link>
          <Link href="/admin" locale={locale} className="hover:text-heading">{t("admin")}</Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
