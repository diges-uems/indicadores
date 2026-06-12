export interface StateComparisonItem {
  ies: string;
  en: [number, number];
  idd: [number, number];
  cp: [number, number];
  ig: [number, number];
}

export const stateComparisonData: StateComparisonItem[] = [
  { ies: 'UEMS', en: [3, 2.01], idd: [3, 2.02], cp: [3, 2.57], ig: [3, 2.87] },
  { ies: 'UFGD', en: [3, 2.56], idd: [3, 2.72], cp: [4, 3.20], ig: [4, 3.65] },
  { ies: 'UFMS', en: [3, 2.59], idd: [3, 2.36], cp: [4, 3.16], ig: [4, 3.58] },
];
