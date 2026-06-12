export interface StatusConfigItem {
  label: string;
  cl: string;
}

export const statusConfig: Record<number, StatusConfigItem> = {
  1: { label: 'Não atende', cl: 'bg-[#DC2626]' },
  2: { label: 'Insuficiente', cl: 'bg-[#F87171]' },
  3: { label: 'Suficiente', cl: 'bg-[#EAB308]' },
  4: { label: 'Bom', cl: 'bg-[#4ADE80]' },
  5: { label: 'Muito bom', cl: 'bg-[#16A34A]' },
};

export const statusColors: Record<number, string> = {
  1: '#DC2626',
  2: '#F87171',
  3: '#EAB308',
  4: '#4ADE80',
  5: '#16A34A',
};

export const statusLabels: Record<number, string> = {
  1: 'Não atende',
  2: 'Insuficiente',
  3: 'Suficiente',
  4: 'Bom',
  5: 'Muito bom',
};

export const statusRanges: Record<number, string> = {
  1: '0,000 a 0,944',
  2: '0,945 a 1,944',
  3: '1,945 a 2,944',
  4: '2,945 a 3,944',
  5: '3,945 a 5,000',
};

export const shortLabels = ['Não atende', 'Insuficiente', 'Suficiente', 'Bom', 'Muito bom'];
export const longLabels = [
  'Não atende (0,000 a 0,944)',
  'Insuficiente (0,945 a 1,944)',
  'Suficiente (1,945 a 2,944)',
  'Bom (2,945 a 3,944)',
  'Muito bom (3,945 a 5,000)',
];
