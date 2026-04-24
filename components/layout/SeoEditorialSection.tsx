import Link from "next/link";

const content = {
  en: {
    title: "Train Smarter With Structured CrossFit Workouts",
    intro:
      "WodLab is built for athletes who want clear and effective CrossFit training. Every workout follows a practical 60-minute structure you can run in your box or open gym.",
    bullets: [
      "Mobility block to unlock range of motion and prevent injury",
      "Warm-up block to elevate heart rate and prep movement patterns",
      "Main WoD block with scalable RX and scaled pathways",
      "Short strength finisher to build resilience under fatigue",
      "Targeted stretching block for better recovery",
    ],
    faqTitle: "FAQ: CrossFit, WoD, and Workout Planning",
    faq: [
      {
        q: "What is a WoD in CrossFit?",
        a: "A WoD means Workout of the Day. It is the main training session programmed for the day, often mixing gymnastics, weightlifting, and conditioning.",
      },
      {
        q: "Can beginners use these workouts?",
        a: "Yes. WodLab workouts are designed to be scalable with adjusted loads, movement substitutions, and pacing recommendations.",
      },
      {
        q: "How can I generate workout ideas fast?",
        a: "Use the WodLab library as a generator of structured workout ideas. Pick a format like AMRAP or EMOM, then adapt volume and loads to your level.",
      },
    ],
    cta: "Explore all WoDs",
  },
  fr: {
    title: "Progresse Plus Vite Avec des WoD Structures",
    intro:
      "WodLab est pense pour les athletes qui veulent un entrainement CrossFit clair et efficace. Chaque seance suit une structure pratique de 60 minutes.",
    bullets: [
      "Bloc mobilite pour preparer les amplitudes",
      "Bloc echauffement pour activer le cardio et les patterns",
      "Bloc WoD principal avec options RX et scaled",
      "Bloc renforcement court pour la robustesse",
      "Bloc stretching cible pour mieux recuperer",
    ],
    faqTitle: "FAQ: CrossFit, WoD et planification",
    faq: [
      {
        q: "Qu'est-ce qu'un WoD en CrossFit ?",
        a: "WoD signifie Workout of the Day. C'est la seance principale du jour, souvent melangee entre gymnastique, haltéro et conditioning.",
      },
      {
        q: "Les debutants peuvent-ils suivre ces seances ?",
        a: "Oui. Les WoD sont adaptables avec des charges, variantes de mouvements et volumes ajustes.",
      },
      {
        q: "Comment generer vite des idees de workout ?",
        a: "Utilise la bibliotheque WodLab comme generateur. Choisis un format AMRAP, EMOM ou For Time, puis adapte selon ton niveau.",
      },
    ],
    cta: "Voir tous les WoD",
  },
  es: {
    title: "Mejora tu nivel con WoDs estructurados",
    intro:
      "WodLab esta creado para atletas que quieren entrenar CrossFit con claridad y resultados. Cada sesion sigue un formato util de 60 minutos.",
    bullets: [
      "Bloque de movilidad para preparar el rango de movimiento",
      "Bloque de calentamiento para subir pulsaciones",
      "Bloque principal con opciones RX y scaled",
      "Bloque corto de fuerza para reforzar puntos debiles",
      "Bloque de estiramiento para mejorar recuperacion",
    ],
    faqTitle: "FAQ: CrossFit, WoD y planificacion",
    faq: [
      {
        q: "Que significa WoD en CrossFit?",
        a: "WoD significa Workout of the Day. Es la sesion principal del dia con combinaciones de gimnasia, pesas y acondicionamiento.",
      },
      {
        q: "Los principiantes pueden hacer estos workouts?",
        a: "Si. Los WoDs se pueden escalar con cargas adaptadas y sustituciones de movimientos.",
      },
      {
        q: "Como generar ideas de workout rapidamente?",
        a: "Usa la biblioteca de WodLab como generador de sesiones. Elige un formato y ajusta volumen e intensidad.",
      },
    ],
    cta: "Explorar todos los WoDs",
  },
} as const;

export function SeoEditorialSection({ locale }: { locale: string }) {
  const t = content[(locale as keyof typeof content) ?? "en"] ?? content.en;

  return (
    <section className="mx-auto mt-12 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-[4px] border border-divider bg-surface-1 p-6 sm:p-8">
        <h2 className="font-display text-4xl uppercase text-heading sm:text-5xl">{t.title}</h2>
        <p className="mt-4 max-w-4xl text-sm text-body/90 sm:text-base">{t.intro}</p>
        <ul className="mt-5 grid gap-2 text-sm text-body/85 sm:grid-cols-2">
          {t.bullets.map((item) => (
            <li key={item} className="rounded-[4px] border border-divider bg-background/60 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-3xl uppercase text-heading">{t.faqTitle}</h3>
        <div className="mt-4 space-y-4">
          {t.faq.map((qa) => (
            <div key={qa.q} className="rounded-[4px] border border-divider bg-background/60 p-4">
              <p className="text-sm font-semibold text-heading">{qa.q}</p>
              <p className="mt-2 text-sm text-body/85">{qa.a}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}/wods`}
          className="mt-7 inline-flex rounded-[4px] border border-lime/60 px-4 py-2 text-xs uppercase tracking-[0.16em] text-lime hover:bg-lime/10"
        >
          {t.cta}
        </Link>
      </div>
    </section>
  );
}

