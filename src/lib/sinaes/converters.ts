export function getLatestValue(r: Record<string, unknown>, prefix: string, maxYear: number = 2025): number | null {
  for (const y of [2025, 2024, 2023, 2022, 2021]) {
    if (y > maxYear) continue;
    const key = `${prefix}${y}`;
    const val = r[key];
    if (val != null) return val as number;
  }
  return null;
}

export function convertToRange(v: number | null | undefined): number | null {
  if (v === null || v === undefined) return null;
  if (v < 0.945) return 1;
  if (v < 1.945) return 2;
  if (v < 2.945) return 3;
  if (v < 3.945) return 4;
  return 5;
}
