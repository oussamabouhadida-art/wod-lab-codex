import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-divider py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-xs uppercase tracking-wider text-muted sm:px-6 lg:px-8">
        <p>WodLab. Forge your limits. One WoD at a time.</p>
        <div className="flex gap-4 tracking-normal normal-case">
          <Link href="/sitemap.xml" className="hover:text-heading">
            Sitemap
          </Link>
          <Link href="/robots.txt" className="hover:text-heading">
            Robots
          </Link>
        </div>
      </div>
    </footer>
  );
}
