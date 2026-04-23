export const wodTypeOptions = ["for_time", "amrap", "emom", "chipper", "ladder", "benchmark_hero"] as const;
export const objectiveOptions = ["strength", "endurance", "power", "agility", "conditioning"] as const;
export const componentOptions = ["gymnastics", "weightlifting", "cardio"] as const;
export const intensityOptions = ["low", "moderate", "high", "extreme"] as const;

export type WodType = (typeof wodTypeOptions)[number];
export type WodObjective = (typeof objectiveOptions)[number];
export type WodComponent = (typeof componentOptions)[number];
export type WodIntensity = (typeof intensityOptions)[number];

export const wodTypeColors: Record<WodType, string> = {
  for_time: "#FF4D00",
  amrap: "#FF4D00",
  emom: "#00C2FF",
  chipper: "#C8FF00",
  ladder: "#C8FF00",
  benchmark_hero: "#FFD700",
};

export const wodTypeLabel: Record<WodType, string> = {
  for_time: "For Time",
  amrap: "AMRAP",
  emom: "EMOM",
  chipper: "Chipper",
  ladder: "Ladder",
  benchmark_hero: "Benchmark",
};

export interface Wod {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string;
  title_es: string;
  description_en: string | null;
  description_fr: string | null;
  description_es: string | null;
  content_en: string;
  content_fr: string;
  content_es: string;
  wod_type: WodType;
  objective: WodObjective;
  published_at: string | null;
  is_published: boolean;
}

export interface WodImage {
  id: string;
  wod_id: string;
  url: string;
  alt_en: string | null;
  alt_fr: string | null;
  alt_es: string | null;
  sort_order: number;
}

export interface WodKpi {
  id: string;
  wod_id: string;
  estimated_duration_min: number | null;
  avg_heart_rate: number | null;
  max_heart_rate: number | null;
  estimated_calories: number | null;
  training_effect: string | null;
  intensity_level: WodIntensity | null;
  recovery_time_hours: number | null;
  training_load: number | null;
}
