export function buildWodUrl(locale: string, slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://wod-lab-codex.vercel.app";
  return `${base}/${locale}/wods/${slug}`;
}

export function buildWhatsappShareUrl(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

export function buildInstagramShareUrl() {
  return "https://www.instagram.com/";
}
