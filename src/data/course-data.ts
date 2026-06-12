export interface CourseDataRaw {
  area: string;
  codigo: string;
  municipio: string;
  idd2021?: number;
  cpc2021?: number;
  enade2021?: number;
  idd2022?: number;
  cpc2022?: number;
  enade2022?: number;
  idd2023?: number;
  cpc2023?: number;
  enade2023?: number;
  idd2024?: number;
  cpc2024?: number;
  enade2024?: number;
  idd2025?: number;
  cpc2025?: number;
  enade2025?: number;
}

export const courseDataRaw: CourseDataRaw[] = [
  { area: 'Ciências Biológicas (extinto)', codigo: '45711', municipio: 'Coxim', idd2021: 2.819, cpc2021: 2.574, enade2021: 2.265 },
  { area: 'Ciências Sociais (em extinção)', codigo: '113050', municipio: 'Amambai', idd2021: 0.603, cpc2021: 1.589, enade2021: 0 },
  { area: 'História (em extinção)', codigo: '68265', municipio: 'Amambai', idd2021: 2.447, cpc2021: 2.863, enade2021: 0.886 },
  { area: 'Ciência da Computação', codigo: '68321', municipio: 'Dourados', idd2021: 2.728, cpc2021: 3.035, enade2021: 2.053 },
  { area: 'Ciência da Computação', codigo: '150102', municipio: 'Nova Andradina', idd2021: 0, cpc2021: 1.569, enade2021: 1.42 },
  { area: 'Ciências Biológicas', codigo: '45713', municipio: 'Ivinhema', idd2021: 2.272, cpc2021: 2.398, enade2021: 1.737 },
  { area: 'Ciências Biológicas', codigo: '45715', municipio: 'Mundo Novo', idd2021: 2.297, cpc2021: 2.837, enade2021: 1.814 },
  { area: 'Ciências Biológicas', codigo: '50933', municipio: 'Dourados', idd2021: 2.067, cpc2021: 2.940, enade2021: 2.305 },
  { area: 'Ciências Biológicas', codigo: '1190630', municipio: 'Ivinhema', idd2021: 2.283, cpc2021: 2.866, enade2021: 1.972 },
  { area: 'Ciências Biológicas', codigo: '1190631', municipio: 'Dourados', idd2021: 1.911, cpc2021: 2.662, enade2021: 1.625 },
  { area: 'Ciências Sociais', codigo: '123588', municipio: 'Paranaíba', idd2021: 3.101, cpc2021: 2.991, enade2021: 2.598 },
  { area: 'Ciências Sociais', codigo: '1265863', municipio: 'Paranaíba', idd2021: 2.978, cpc2021: 2.604, enade2021: 0.788 },
  { area: 'Física', codigo: '105928', municipio: 'Dourados', idd2021: 2.774, cpc2021: 2.909, enade2021: 1.993 },
  { area: 'Geografia', codigo: '105780', municipio: 'Jardim', idd2021: 2.421, cpc2021: 2.670, enade2021: 1.870 },
  { area: 'Geografia', codigo: '150104', municipio: 'Campo Grande', idd2021: 2.049, cpc2021: 2.975, enade2021: 2.532 },
  { area: 'Geografia', codigo: '1313326', municipio: 'Campo Grande', idd2021: 2.523, cpc2021: 3.062, enade2021: 2.042 },
  { area: 'Letras-Português e Espanhol', codigo: '89022', municipio: 'Dourados', idd2021: 1.237, cpc2021: 2.078, enade2021: 0.840 },
  { area: 'Letras-Português e Espanhol', codigo: '150105', municipio: 'Campo Grande', idd2021: 1.370, cpc2021: 2.199, enade2021: 1.657 },
  { area: 'Letras-Português e Inglês', codigo: '89018', municipio: 'Dourados', idd2021: 1.484, cpc2021: 2.295, enade2021: 1.190 },
  { area: 'Letras-Português e Inglês', codigo: '89024', municipio: 'Cassilândia', idd2021: 0.210, cpc2021: 1.580, enade2021: 1.406 },
  { area: 'Letras-Português e Inglês', codigo: '89029', municipio: 'Jardim', idd2021: 2.029, cpc2021: 2.389, enade2021: 1.873 },
  { area: 'Letras-Português e Inglês', codigo: '150106', municipio: 'Campo Grande', idd2021: 1.344, cpc2021: 2.410, enade2021: 2.855 },
  { area: 'Matemática', codigo: '45701', municipio: 'Cassilândia', idd2021: 1.128, cpc2021: 1.959, enade2021: 1.584 },
  { area: 'Matemática', codigo: '45703', municipio: 'Nova Andradina', idd2021: 1.502, cpc2021: 2.155, enade2021: 1.181 },
  { area: 'Matemática', codigo: '68313', municipio: 'Dourados', idd2021: 1.372, cpc2021: 2.368, enade2021: 1.358 },
  { area: 'Pedagogia', codigo: '113052', municipio: 'Campo Grande', idd2021: 2.562, cpc2021: 3.135, enade2021: 3.397 },
  { area: 'Pedagogia', codigo: '113054', municipio: 'Maracaju', idd2021: 2.030, cpc2021: 2.354, enade2021: 1.732 },
  { area: 'Pedagogia', codigo: '113056', municipio: 'Paranaíba', idd2021: 2.260, cpc2021: 3.112, enade2021: 2.527 },
  { area: 'Pedagogia', codigo: '113058', municipio: 'Dourados', idd2021: 2.632, cpc2021: 3.133, enade2021: 2.656 },
  { area: 'Química', codigo: '50935', municipio: 'Dourados', idd2021: 4.045, cpc2021: 3.554, enade2021: 3.142 },
  { area: 'Química', codigo: '51044', municipio: 'Naviraí', idd2021: 2.303, cpc2021: 2.323, enade2021: 1.629 },
  { area: 'Sistemas de Informação', codigo: '95706', municipio: 'Dourados', idd2021: 3.848, cpc2021: 3.602, enade2021: 3.564 },
  { area: 'Direito', codigo: '17762', municipio: 'Paranaíba', idd2022: 1.540, cpc2022: 2.320, enade2022: 2.571 },
  { area: 'Direito', codigo: '17766', municipio: 'Dourados', idd2022: 2.345, cpc2022: 2.509, enade2022: 3.286 },
  { area: 'Turismo', codigo: '45605', municipio: 'Dourados', idd2022: 3.328, cpc2022: 3.281, enade2022: 2.686 },
  { area: 'Direito', codigo: '68315', municipio: 'Naviraí', idd2022: 3.111, cpc2022: 2.887, enade2022: 3.241 },
  { area: 'Ciências Econômicas', codigo: '68319', municipio: 'Ponta Porã', idd2022: 2.161, cpc2022: 2.437, enade2022: 1.292 },
  { area: 'Ciências Contábeis', codigo: '95708', municipio: 'Ponta Porã', idd2022: 1.823, cpc2022: 2.437, enade2022: 2.442 },
  { area: 'Administração', codigo: '113045', municipio: 'Ponta Porã', idd2022: 1.946, cpc2022: 2.208, enade2022: 2.024 },
  { area: 'Administração', codigo: '113047', municipio: 'Maracaju', idd2022: 0.128, cpc2022: 1.755, enade2022: 1.409 },
  { area: 'Turismo', codigo: '5000476', municipio: 'Campo Grande', idd2022: 0.900, cpc2022: 2.169, enade2022: 2.284 },
  { area: 'Engenharia Florestal', codigo: '123562', municipio: 'Aquidauana', idd2023: 1.891, cpc2023: 2.182, enade2023: 1.399 },
  { area: 'Zootecnia', codigo: '17735', municipio: 'Aquidauana', idd2023: 0.150, cpc2023: 1.574, enade2023: 0.401 },
  { area: 'Agronomia', codigo: '45598', municipio: 'Aquidauana', idd2023: 1.491, cpc2023: 2.539, enade2023: 2.099 },
  { area: 'Agronomia', codigo: '51042', municipio: 'Cassilândia', idd2023: 1.699, cpc2023: 2.578, enade2023: 2.301 },
  { area: 'Engenharia Ambiental e Sanitária', codigo: '1117933', municipio: 'Dourados', idd2023: 0.857, cpc2023: 2.180, enade2023: 1.806 },
  { area: 'Medicina', codigo: '1313341', municipio: 'Campo Grande', idd2023: 2.897, cpc2023: 3.215, enade2023: 3.774 },
  { area: 'Engenharia de Alimentos', codigo: '1314210', municipio: 'Naviraí', idd2023: 2.924, cpc2023: 2.656, enade2023: 0.942 },
  { area: 'Tecnologia em Gestão Ambiental', codigo: '5000475', municipio: 'Mundo Novo', idd2023: 2.994, cpc2023: 3.516, enade2023: 3.101 },
  { area: 'Enfermagem', codigo: '17768', municipio: 'Dourados', idd2023: 2.408, cpc2023: 2.789, enade2023: 2.770 },
];
