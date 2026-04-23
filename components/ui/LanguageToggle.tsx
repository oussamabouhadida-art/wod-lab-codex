"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";

const locales = ["en", "fr", "es"] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-body">
      {locales.map((item) => {
        const isActive = item === locale;
        return (
          <button
            key={item}
            onClick={() => router.replace(pathname, { locale: item })}
            className="relative pb-1"
          >
            {item}
            {isActive ? <motion.span layoutId="locale-indicator" className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-lime" /> : null}
          </button>
        );
      })}
    </div>
  );
}
