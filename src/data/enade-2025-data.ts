export interface Enade2025Entry {
  area: string;
  codigo: string;
  municipio: string;
  conceito: number; // Integer concept 1-5
}

// Only the courses with 2025 ENADE results provided by the user
export const enade2025Data: Enade2025Entry[] = [
  { area: 'Ciências Biológicas', codigo: '50933', municipio: 'Dourados', conceito: 3 },
  { area: 'Ciências Biológicas', codigo: '45713', municipio: 'Ivinhema', conceito: 2 },
  { area: 'Ciências Biológicas', codigo: '45716', municipio: 'Mundo Novo', conceito: 3 },
  { area: 'Ciências Sociais', codigo: '1642682', municipio: 'EaD', conceito: 2 },
  { area: 'Ciências Sociais', codigo: '113050', municipio: 'Amambaí', conceito: 1 },
  { area: 'Ciências Sociais', codigo: '123588', municipio: 'Paranaíba', conceito: 4 },
  { area: 'Física', codigo: '105928', municipio: 'Dourados', conceito: 2 },
  { area: 'Geografia', codigo: '150104', municipio: 'Campo Grande', conceito: 4 },
  { area: 'Geografia', codigo: '105780', municipio: 'Jardim', conceito: 2 },
  { area: 'História', codigo: '68265', municipio: 'Amambaí', conceito: 2 },
  { area: 'Letras-Português e Espanhol', codigo: '150105', municipio: 'Campo Grande', conceito: 3 },
  { area: 'Letras-Português e Espanhol', codigo: '89022', municipio: 'Dourados', conceito: 1 },
  { area: 'Letras-Português e Inglês', codigo: '150106', municipio: 'Campo Grande', conceito: 2 },
  { area: 'Letras-Português e Inglês', codigo: '89024', municipio: 'Cassilândia', conceito: 1 },
  { area: 'Letras-Português e Inglês', codigo: '89018', municipio: 'Dourados', conceito: 1 },
  { area: 'Letras-Português e Inglês', codigo: '89029', municipio: 'Jardim', conceito: 2 },
  { area: 'Matemática', codigo: '45701', municipio: 'Cassilândia', conceito: 4 },
  { area: 'Matemática', codigo: '68313', municipio: 'Dourados', conceito: 1 },
  { area: 'Matemática', codigo: '45703', municipio: 'Nova Andradina', conceito: 3 },
  { area: 'Medicina', codigo: '1313341', municipio: 'Campo Grande', conceito: 4 },
  { area: 'Pedagogia', codigo: '1104085', municipio: 'EaD', conceito: 1 },
  { area: 'Pedagogia', codigo: '113052', municipio: 'Campo Grande', conceito: 3 },
  { area: 'Pedagogia', codigo: '113058', municipio: 'Dourados', conceito: 3 },
  { area: 'Pedagogia', codigo: '113054', municipio: 'Maracaju', conceito: 2 },
  { area: 'Pedagogia', codigo: '113056', municipio: 'Paranaíba', conceito: 3 },
  { area: 'Química', codigo: '50935', municipio: 'Dourados', conceito: 2 },
  { area: 'Química', codigo: '51044', municipio: 'Naviraí', conceito: 3 },
];
