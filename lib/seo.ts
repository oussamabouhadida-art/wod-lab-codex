export const supportedLocales = ["en", "fr", "es"] as const;
export type AppLocale = (typeof supportedLocales)[number];

export const defaultLocale: AppLocale = "en";
export const siteName = "WodLab";

function normalize(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getBaseUrl() {
  return normalize(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.crossdatafit.space");
}

export function getLocalePath(locale: AppLocale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function getAlternates(path = "/") {
  const base = getBaseUrl();
  const languages = Object.fromEntries(
    supportedLocales.map((locale) => [locale, `${base}${getLocalePath(locale, path)}`]),
  ) as Record<AppLocale, string>;

  return {
    canonical: languages[defaultLocale],
    languages: {
      ...languages,
      "x-default": languages[defaultLocale],
    },
  };
}

export function getLocaleCopy(locale: string) {
  const copy = {
    en: {
      homeTitle: "WodLab | CrossFit WoD Workouts, Fitness Programming & Training",
      homeDescription:
        "WodLab is a CrossFit WoD platform with structured 60-minute workout blocks: mobility, warm-up, main WoD, strength finisher, and stretching.",
      wodsTitle: "All CrossFit WoDs | WodLab Workout Library",
      wodsDescription:
        "Browse CrossFit WoDs by type, objective, and movement patterns. Find AMRAP, EMOM, For Time, Chipper, Ladder, and Benchmark sessions.",
      aboutTitle: "About WodLab | CrossFit Programming for Everyday Athletes",
      aboutDescription:
        "Discover WodLab's training approach: smart CrossFit programming with performance metrics and scalable workouts for all levels.",
      keywords: [
        "crossfit",
        "wod",
        "workout",
        "fitness",
        "generate workout",
        "crossfit workout of the day",
        "amrap",
        "emom",
        "for time workout",
      ],
    },
    fr: {
      homeTitle: "WodLab | WoD CrossFit, Workouts Fitness et Programmation",
      homeDescription:
        "WodLab propose des WoD CrossFit structures en 60 minutes: mobilite, echauffement, WoD principal, renforcement, stretching.",
      wodsTitle: "Tous les WoD CrossFit | Bibliotheque WodLab",
      wodsDescription:
        "Explore des WoD CrossFit par type, objectif et composantes. Retrouve AMRAP, EMOM, For Time, Chipper, Ladder et Benchmark.",
      aboutTitle: "A propos de WodLab | Programmation CrossFit",
      aboutDescription:
        "Decouvre l'approche WodLab: programmation CrossFit claire, scalable et orientee performance pour tous les niveaux.",
      keywords: [
        "crossfit",
        "wod",
        "workout",
        "fitness",
        "generer workout",
        "seance crossfit",
        "amrap",
        "emom",
        "entrainement for time",
      ],
    },
    es: {
      homeTitle: "WodLab | WoDs CrossFit, Workouts Fitness y Programacion",
      homeDescription:
        "WodLab ofrece WoDs CrossFit en bloques de 60 minutos: movilidad, calentamiento, WoD principal, fuerza corta y estiramiento.",
      wodsTitle: "Todos los WoDs CrossFit | Biblioteca WodLab",
      wodsDescription:
        "Explora WoDs por tipo, objetivo y componente. Encuentra AMRAP, EMOM, For Time, Chipper, Ladder y Benchmark.",
      aboutTitle: "Sobre WodLab | Programacion CrossFit para atletas",
      aboutDescription:
        "Conoce el enfoque de WodLab: programacion CrossFit escalable con metricas de rendimiento para todos los niveles.",
      keywords: [
        "crossfit",
        "wod",
        "workout",
        "fitness",
        "generar workout",
        "entrenamiento crossfit",
        "amrap",
        "emom",
        "for time",
      ],
    },
  } as const;

  return copy[(locale as AppLocale) ?? defaultLocale] ?? copy[defaultLocale];
}

