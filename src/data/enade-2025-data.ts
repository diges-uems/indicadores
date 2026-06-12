export interface Enade2025Entry {
  area: string;
  codigoArea: number;
  codigo: string;
  municipio: string;
  modalidade: string;
  conceito: number; // Integer concept 1-5
  concluintesInscritos: number;
  concluintesParticipantes: number;
  concluinteAcimaBasico: number;
  percentualAcimaPadrao1: number; // 0-1 range, e.g., 0.833 = 83.3%
}

// Only the courses with 2025 ENADE results — official INEP data
export const enade2025Data: Enade2025Entry[] = [
  { area: 'Matemática', codigoArea: 702, codigo: '45701', municipio: 'Cassilândia', modalidade: 'Presencial', conceito: 4, concluintesInscritos: 7, concluintesParticipantes: 6, concluinteAcimaBasico: 5, percentualAcimaPadrao1: 0.833 },
  { area: 'Geografia', codigoArea: 3002, codigo: '150104', municipio: 'Campo Grande', modalidade: 'Presencial', conceito: 4, concluintesInscritos: 40, concluintesParticipantes: 26, concluinteAcimaBasico: 22, percentualAcimaPadrao1: 0.846 },
  { area: 'Ciências Sociais', codigoArea: 5402, codigo: '123588', municipio: 'Paranaíba', modalidade: 'Presencial', conceito: 4, concluintesInscritos: 7, concluintesParticipantes: 6, concluinteAcimaBasico: 5, percentualAcimaPadrao1: 0.833 },
  { area: 'Medicina', codigoArea: 12, codigo: '1313341', municipio: 'Campo Grande', modalidade: 'Presencial', conceito: 4, concluintesInscritos: 35, concluintesParticipantes: 35, concluinteAcimaBasico: 27, percentualAcimaPadrao1: 0.771 },
  { area: 'Matemática', codigoArea: 702, codigo: '45703', municipio: 'Nova Andradina', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 7, concluintesParticipantes: 7, concluinteAcimaBasico: 5, percentualAcimaPadrao1: 0.714 },
  { area: 'Letras-Português e Espanhol', codigoArea: 906, codigo: '150105', municipio: 'Campo Grande', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 32, concluintesParticipantes: 22, concluinteAcimaBasico: 15, percentualAcimaPadrao1: 0.682 },
  { area: 'Química', codigoArea: 1502, codigo: '51044', municipio: 'Naviraí', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 12, concluintesParticipantes: 6, concluinteAcimaBasico: 4, percentualAcimaPadrao1: 0.667 },
  { area: 'Ciências Biológicas', codigoArea: 1602, codigo: '45715', municipio: 'Mundo Novo', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 17, concluintesParticipantes: 17, concluinteAcimaBasico: 11, percentualAcimaPadrao1: 0.647 },
  { area: 'Ciências Biológicas', codigoArea: 1602, codigo: '50933', municipio: 'Dourados', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 27, concluintesParticipantes: 23, concluinteAcimaBasico: 17, percentualAcimaPadrao1: 0.739 },
  { area: 'Pedagogia', codigoArea: 2001, codigo: '113052', municipio: 'Campo Grande', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 28, concluintesParticipantes: 23, concluinteAcimaBasico: 17, percentualAcimaPadrao1: 0.739 },
  { area: 'Pedagogia', codigoArea: 2001, codigo: '113056', municipio: 'Paranaíba', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 29, concluintesParticipantes: 26, concluinteAcimaBasico: 19, percentualAcimaPadrao1: 0.731 },
  { area: 'Pedagogia', codigoArea: 2001, codigo: '113058', municipio: 'Dourados', modalidade: 'Presencial', conceito: 3, concluintesInscritos: 26, concluintesParticipantes: 23, concluinteAcimaBasico: 17, percentualAcimaPadrao1: 0.739 },
  { area: 'Letras-Português e Inglês', codigoArea: 905, codigo: '89029', municipio: 'Jardim', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 23, concluintesParticipantes: 16, concluinteAcimaBasico: 7, percentualAcimaPadrao1: 0.438 },
  { area: 'Letras-Português e Inglês', codigoArea: 905, codigo: '150106', municipio: 'Campo Grande', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 37, concluintesParticipantes: 27, concluinteAcimaBasico: 11, percentualAcimaPadrao1: 0.407 },
  { area: 'Física', codigoArea: 1402, codigo: '105928', municipio: 'Dourados', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 15, concluintesParticipantes: 12, concluinteAcimaBasico: 5, percentualAcimaPadrao1: 0.417 },
  { area: 'Química', codigoArea: 1502, codigo: '50935', municipio: 'Dourados', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 5, concluintesParticipantes: 4, concluinteAcimaBasico: 2, percentualAcimaPadrao1: 0.5 },
  { area: 'Ciências Biológicas', codigoArea: 1602, codigo: '45713', municipio: 'Ivinhema', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 8, concluintesParticipantes: 7, concluinteAcimaBasico: 4, percentualAcimaPadrao1: 0.571 },
  { area: 'Pedagogia', codigoArea: 2001, codigo: '113054', municipio: 'Maracaju', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 19, concluintesParticipantes: 17, concluinteAcimaBasico: 10, percentualAcimaPadrao1: 0.588 },
  { area: 'História', codigoArea: 2402, codigo: '68265', municipio: 'Amambaí', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 13, concluintesParticipantes: 12, concluinteAcimaBasico: 6, percentualAcimaPadrao1: 0.5 },
  { area: 'Geografia', codigoArea: 3002, codigo: '105780', municipio: 'Jardim', modalidade: 'Presencial', conceito: 2, concluintesInscritos: 19, concluintesParticipantes: 7, concluinteAcimaBasico: 4, percentualAcimaPadrao1: 0.571 },
  { area: 'Ciências Sociais', codigoArea: 5402, codigo: '1642682', municipio: 'EaD', modalidade: 'EaD', conceito: 2, concluintesInscritos: 20, concluintesParticipantes: 15, concluinteAcimaBasico: 8, percentualAcimaPadrao1: 0.533 },
  { area: 'Matemática', codigoArea: 702, codigo: '68313', municipio: 'Dourados', modalidade: 'Presencial', conceito: 1, concluintesInscritos: 6, concluintesParticipantes: 5, concluinteAcimaBasico: 1, percentualAcimaPadrao1: 0.2 },
  { area: 'Letras-Português e Inglês', codigoArea: 905, codigo: '89018', municipio: 'Dourados', modalidade: 'Presencial', conceito: 1, concluintesInscritos: 22, concluintesParticipantes: 20, concluinteAcimaBasico: 7, percentualAcimaPadrao1: 0.35 },
  { area: 'Letras-Português e Inglês', codigoArea: 905, codigo: '89024', municipio: 'Cassilândia', modalidade: 'Presencial', conceito: 1, concluintesInscritos: 16, concluintesParticipantes: 13, concluinteAcimaBasico: 3, percentualAcimaPadrao1: 0.231 },
  { area: 'Letras-Português e Espanhol', codigoArea: 906, codigo: '89022', municipio: 'Dourados', modalidade: 'Presencial', conceito: 1, concluintesInscritos: 13, concluintesParticipantes: 10, concluinteAcimaBasico: 3, percentualAcimaPadrao1: 0.3 },
  { area: 'Pedagogia', codigoArea: 2001, codigo: '1104085', municipio: 'EaD', modalidade: 'EaD', conceito: 1, concluintesInscritos: 8, concluintesParticipantes: 6, concluinteAcimaBasico: 2, percentualAcimaPadrao1: 0.333 },
  { area: 'Ciências Sociais', codigoArea: 5402, codigo: '113050', municipio: 'Amambaí', modalidade: 'Presencial', conceito: 1, concluintesInscritos: 23, concluintesParticipantes: 11, concluinteAcimaBasico: 4, percentualAcimaPadrao1: 0.364 },
];
