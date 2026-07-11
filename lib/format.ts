export function inr(n: number | null | undefined): string {
  if (n == null) return "—";
  return "₹" + new Intl.NumberFormat("en-IN").format(n);
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export const PROJECT_TYPES = [
  "Sanitation & Washrooms",
  "Patient Wards",
  "Waiting Areas",
  "Drinking Water",
  "Ambulance Support",
  "Nutrition",
  "Medical Infrastructure",
  "Disaster Relief",
  "Other",
];

export const REQUEST_STATUSES = [
  "submitted","under_review","more_info_requested","assessment_scheduled",
  "assessment_completed","approved","waitlisted","declined","converted_to_project","closed",
] as const;

export function statusLabel(s: string): string {
  return s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
