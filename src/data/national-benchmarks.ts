export interface NationalBenchmark {
  enade: number;
  cpc: number;
  idd: number;
}

export const nationalBenchmarks: Record<string, NationalBenchmark> = {
  'Administração': { enade: 2.63, cpc: 3.23, idd: 2.83 },
  'Agronomia': { enade: 2.81, cpc: 3.50, idd: 3.04 },
  'Ciência da Computação': { enade: 2.20, cpc: 3.35, idd: 3.09 },
  'Ciências Biológicas': { enade: 2.57, cpc: 3.51, idd: 2.98 },
  'Ciências Contábeis': { enade: 2.69, cpc: 3.27, idd: 3.03 },
  'Ciências Econômicas': { enade: 2.28, cpc: 3.29, idd: 2.80 },
  'Ciências Sociais': { enade: 2.68, cpc: 3.52, idd: 2.97 },
  'Direito': { enade: 2.69, cpc: 3.27, idd: 3.07 },
  'Enfermagem': { enade: 2.63, cpc: 3.38, idd: 3.09 },
  'Engenharia Ambiental e Sanitária': { enade: 2.77, cpc: 3.50, idd: 3.04 },
  'Engenharia de Alimentos': { enade: 2.40, cpc: 3.35, idd: 2.88 },
  'Engenharia Florestal': { enade: 2.66, cpc: 3.66, idd: 3.08 },
  'Física': { enade: 2.40, cpc: 3.40, idd: 3.05 },
  'Geografia': { enade: 2.45, cpc: 3.45, idd: 2.95 },
  'História': { enade: 2.50, cpc: 3.51, idd: 3.13 },
  'Letras-Português e Espanhol': { enade: 2.22, cpc: 3.26, idd: 2.66 },
  'Letras-Português e Inglês': { enade: 2.66, cpc: 3.40, idd: 3.01 },
  'Matemática': { enade: 2.24, cpc: 3.34, idd: 3.00 },
  'Medicina': { enade: 2.88, cpc: 3.36, idd: 2.88 },
  'Pedagogia': { enade: 2.35, cpc: 3.33, idd: 3.02 },
  'Química': { enade: 2.41, cpc: 3.52, idd: 3.04 },
  'Sistemas de Informação': { enade: 2.25, cpc: 3.29, idd: 2.98 },
  'Tecnologia em Gestão Ambiental': { enade: 2.74, cpc: 3.32, idd: 2.76 },
  'Turismo': { enade: 2.69, cpc: 3.24, idd: 2.65 },
  'Zootecnia': { enade: 2.64, cpc: 3.55, idd: 2.99 },
};
