import { courseDataRaw, type CourseDataRaw } from '@/data/course-data';
import { grauMap } from '@/data/grau-map';
import { nationalBenchmarks } from '@/data/national-benchmarks';
import { getLatestValue, convertToRange } from './converters';

export interface ProcessedCourseData extends CourseDataRaw {
  en: number | null;
  cp: number | null;
  id: number | null;
  fn: number | null;
}

export function processCourseData(): ProcessedCourseData[] {
  return courseDataRaw.map(r => {
    const en = getLatestValue(r as unknown as Record<string, unknown>, 'enade');
    const cp = getLatestValue(r as unknown as Record<string, unknown>, 'cpc');
    const id = getLatestValue(r as unknown as Record<string, unknown>, 'idd');
    const fn = convertToRange(cp) ?? convertToRange(en);
    return { ...r, en, cp, id, fn };
  });
}

export function getCourseName(area: string, codigo: string): string {
  const g = grauMap[codigo];
  return `${area}${g ? ` (${g})` : ''}`;
}

export function getCleanArea(area: string): string {
  return area.replace(' (extinto)', '').replace(' (em extinção)', '').trim();
}

export function getBenchmark(area: string) {
  return nationalBenchmarks[getCleanArea(area)] || {};
}

export function getUniqueCourses(data: ProcessedCourseData[]): string[] {
  return [...new Set(data.map(r => getCourseName(r.area, r.codigo)))].sort();
}

export function getUniqueCampi(data: ProcessedCourseData[]): string[] {
  return [...new Set(data.map(r => r.municipio))].sort();
}
