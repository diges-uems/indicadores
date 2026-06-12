'use client';

import { useState, useMemo } from 'react';
import { forecastData } from '@/data/forecast-data';

export function ForecastTab() {
  const [filterYear, setFilterYear] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { Anual: 0, '2026': 0, '2027': 0, '2028': 0 };
    forecastData.forEach(f => {
      const key = f.ano.toString();
      if (c[key] !== undefined) c[key]++;
    });
    return c;
  }, []);

  const filteredForecast = useMemo(() => {
    if (!filterYear) return forecastData;
    return forecastData.filter(d => d.ano.toString() === filterYear);
  }, [filterYear]);

  const getYearBadgeClass = (ano: string | number) => {
    const key = ano.toString();
    if (key === 'Anual') return 'bg-purple-100 text-purple-950';
    if (key === '2026') return 'bg-blue-100 text-blue-950';
    if (key === '2027') return 'bg-emerald-100 text-emerald-950';
    return 'bg-amber-100 text-amber-950';
  };

  return (
    <div className="animate-fade-in space-y-10">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#00338C] tracking-tight uppercase">
          Calendário de Avaliação (2026 - 2028)
        </h2>
        <p className="text-slate-950 mt-2 font-black uppercase tracking-wide italic text-base">
          Ciclo Trienal INEP/CineBrasil
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-purple-100 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="bg-purple-100 text-purple-950 text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider">
              Contínuo
            </span>
            <p className="text-3xl font-black text-purple-900 mt-4">Anual</p>
            <p className="text-sm font-black text-slate-800 mt-1 uppercase">
              Licenciaturas e Medicina
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-purple-100 flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter">
              {counts.Anual}
            </p>
            <p className="text-sm font-black text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-blue-100 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="bg-blue-100 text-blue-950 text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider">
              Ano II
            </span>
            <p className="text-3xl font-black text-[#00338C] mt-4">2026</p>
            <p className="text-sm font-black text-slate-800 mt-1 uppercase">
              Naturais, Tecnologia da Informação e Comunicação e Engenharias
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-blue-100 flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter">
              {counts['2026']}
            </p>
            <p className="text-sm font-black text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-emerald-100 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="bg-emerald-100 text-emerald-950 text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider">
              Ano III
            </span>
            <p className="text-3xl font-black text-emerald-700 mt-4">2027</p>
            <p className="text-sm font-black text-slate-800 mt-1 uppercase">
              Agrárias, Saúde e Serviços
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-emerald-100 flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-950 tracking-tighter">
              {counts['2027']}
            </p>
            <p className="text-sm font-black text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-amber-100 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="bg-amber-100 text-amber-950 text-xs font-black px-3 py-1.5 rounded-md uppercase tracking-wider">
              Ano I
            </span>
            <p className="text-3xl font-black text-amber-800 mt-4">2028</p>
            <p className="text-sm font-black text-slate-800 mt-1 uppercase">
              Sociais Aplicadas e Humanas
            </p>
          </div>
          <div className="mt-8 pt-5 border-t border-amber-100 flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter">
              {counts['2028']}
            </p>
            <p className="text-sm font-black text-slate-950 uppercase">cursos</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-[2.5rem] p-12 bento-shadow border border-gray-100 mb-10 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-black text-slate-950 tracking-tight uppercase">
            Lista de Cursos Previstos
          </h3>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-slate-50 text-base font-black text-slate-950 px-5 py-3 rounded-xl border border-gray-200 outline-none uppercase cursor-pointer shadow-sm w-full md:w-auto"
          >
            <option value="">Todos os Anos</option>
            <option value="Anual">Anual</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>
        <div className="w-full overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white">
          <table className="w-full text-base text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-950 border-b border-gray-200 uppercase font-black text-sm tracking-widest">
                <th className="py-5 px-8">Curso</th>
                <th className="py-5 px-6">Unidade Universitária</th>
                <th className="py-5 px-6">Área (CineBrasil)</th>
                <th className="text-center py-5 px-8">Ano Previsto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredForecast.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-50 border-b border-slate-100">
                  <td className="py-5 px-8 font-black text-blue-950">{f.curso}</td>
                  <td className="py-5 px-6 font-black uppercase text-sm">{f.campus}</td>
                  <td className="py-5 px-6 font-black text-sm">{f.area}</td>
                  <td className="py-5 px-8 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest inline-block ${getYearBadgeClass(f.ano)}`}
                    >
                      {f.ano.toString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
