'use client';

import { useMemo, useState } from 'react';
import { enade2025Data } from '@/data/enade-2025-data';
import { grauMap } from '@/data/grau-map';
import { statusConfig } from '@/lib/sinaes/status-config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { statusColors, shortLabels, longLabels } from '@/lib/sinaes/status-config';
import { Users, UserCheck, TrendingUp, AlertTriangle } from 'lucide-react';

const COLORS = [statusColors[1], statusColors[2], statusColors[3], statusColors[4], statusColors[5]];

interface ChartDataItem {
  name: string;
  value: number;
  shortLabel: string;
  concept: number;
}

export function Enade2025Tab() {
  const [filterArea, setFilterArea] = useState('');
  const [filterCampus, setFilterCampus] = useState('');
  const [filterConceito, setFilterConceito] = useState('');
  const [sortCol, setSortCol] = useState<'area' | 'municipio' | 'conceito' | 'percentual'>('conceito');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const uniqueAreas = useMemo(
    () => [...new Set(enade2025Data.map(d => d.area))].sort(),
    []
  );
  const uniqueCampi = useMemo(
    () => [...new Set(enade2025Data.map(d => d.municipio))].sort(),
    []
  );

  const { chartData, counts, total } = useMemo(() => {
    const c: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let t = 0;

    enade2025Data.forEach(d => {
      c[d.conceito]++;
      t++;
    });

    const data: ChartDataItem[] = [1, 2, 3, 4, 5].map(i => ({
      name: longLabels[i - 1],
      value: c[i],
      shortLabel: shortLabels[i - 1],
      concept: i,
    }));

    return { chartData: data, counts: c, total: t };
  }, []);

  const filteredData = useMemo(() => {
    const filtered = enade2025Data.filter(d => {
      const matchArea = !filterArea || d.area === filterArea;
      const matchCampus = !filterCampus || d.municipio === filterCampus;
      const matchConceito = !filterConceito || d.conceito === Number(filterConceito);
      return matchArea && matchCampus && matchConceito;
    });

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortCol === 'area') cmp = a.area.localeCompare(b.area);
      else if (sortCol === 'municipio') cmp = a.municipio.localeCompare(b.municipio);
      else if (sortCol === 'percentual') cmp = a.percentualAcimaPadrao1 - b.percentualAcimaPadrao1;
      else cmp = a.conceito - b.conceito;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [filterArea, filterCampus, filterConceito, sortCol, sortDir]);

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const getSortIndicator = (col: typeof sortCol) => {
    if (col !== sortCol) return <span className="text-slate-400 text-xs ml-0.5">↕</span>;
    return sortDir === 'asc' ? (
      <span className="text-blue-900 text-sm font-black ml-0.5">↑</span>
    ) : (
      <span className="text-blue-900 text-sm font-black ml-0.5">↓</span>
    );
  };

  const resetFilters = () => {
    setFilterArea('');
    setFilterCampus('');
    setFilterConceito('');
  };

  // Summary stats
  const bomCount = counts[4] + counts[5];
  const insuficienteCount = counts[1] + counts[2];
  const bomPct = total > 0 ? Math.round((bomCount / total) * 100) : 0;
  const insuficientePct = total > 0 ? Math.round((insuficienteCount / total) * 100) : 0;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataItem }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = total > 0 ? Math.round((data.value / total) * 100) : 0;
      return (
        <div className="bg-[rgba(11,20,40,0.95)] text-white px-4 py-3 rounded-2xl shadow-lg border border-white/10">
          <p className="text-sm font-bold">
            {data.shortLabel}: {pct}% dos cursos ({data.value})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total courses */}
        <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F5FF] text-[#00338C] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="bg-[#00338C] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              ENADE 2025
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1">
            Cursos Avaliados
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">
              {total}
            </p>
            <p className="text-sm font-semibold text-slate-500 uppercase">cursos</p>
          </div>
        </div>

        {/* Bom/Muito Bom */}
        <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="bg-emerald-600 text-white text-lg font-black px-3 py-1 rounded-full shadow-lg shadow-green-100">
              {bomPct}%
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1">
            Conceitos 4 e 5
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">
              {bomCount}
            </p>
            <p className="text-sm font-semibold text-slate-500 uppercase">cursos</p>
          </div>
        </div>

        {/* Insuficiente */}
        <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm relative">
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="bg-red-600 text-white text-lg font-black px-3 py-1 rounded-full shadow-lg shadow-red-100">
              {insuficientePct}%
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1">
            Conceitos 1 e 2
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-black text-slate-950 tracking-tighter leading-none">
              {insuficienteCount}
            </p>
            <p className="text-sm font-semibold text-slate-500 uppercase">cursos</p>
          </div>
        </div>
      </section>

      {/* Pie Chart + Legend */}
      <section className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="w-full md:w-5/12 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-[#00338C] uppercase tracking-tight mb-2">
            Distribuição ENADE 2025
          </h2>
          <p className="text-sm text-slate-500 font-medium mb-6">
            Conceitos ENADE padronizados (notas inteiras) dos cursos avaliados em 2025.
          </p>
          <div className="space-y-2 w-full">
            {[5, 4, 3, 2, 1].map((i) => {
              const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
              return (
                <div
                  key={i}
                  className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white font-black shadow-inner text-lg transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: COLORS[i - 1] }}
                    >
                      {i}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase leading-tight">
                        {shortLabels[i - 1]}
                      </p>
                    </div>
                  </div>
                  <div className="text-right pl-3">
                    <p className="text-xl font-black text-slate-900 leading-tight">{pct}%</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-wider inline-block">
                      {counts[i]} cursos
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full md:w-7/12 flex justify-center items-center">
          <div className="relative w-64 h-64 lg:w-[22rem] lg:h-[22rem] filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-105">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="0%"
                  outerRadius="85%"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#ffffff"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.concept - 1]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Course Table */}
      <section className="bg-white rounded-[2rem] p-6 md:p-8 bento-shadow border border-gray-100 mb-10 overflow-hidden">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-[#00338C] tracking-tight uppercase">
            Monitoramento ENADE 2025
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Dados oficiais INEP — Conceitos padronizados e indicadores de desempenho dos concluintes.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
          >
            <option value="">Curso (Todos)</option>
            {uniqueAreas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            value={filterCampus}
            onChange={(e) => setFilterCampus(e.target.value)}
            className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
          >
            <option value="">Unidade Universitária (Todas)</option>
            {uniqueCampi.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={filterConceito}
            onChange={(e) => setFilterConceito(e.target.value)}
            className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
          >
            <option value="">Conceito (Todos)</option>
            <option value="5">5 — Muito Bom</option>
            <option value="4">4 — Bom</option>
            <option value="3">3 — Suficiente</option>
            <option value="2">2 — Insuficiente</option>
            <option value="1">1 — Não Atende</option>
          </select>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 text-sm font-black text-white bg-slate-950 hover:bg-black rounded-xl transition-colors uppercase shadow-sm"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <p className="text-sm font-black text-slate-950 uppercase tracking-widest">
            Exibindo <span className="text-[#00338C]">{filteredData.length}</span> de{' '}
            <span>{enade2025Data.length}</span>
          </p>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 text-slate-950 border-b border-gray-200 uppercase font-black text-[10px] tracking-widest">
                <th
                  className="py-4 px-3 cursor-pointer hover:text-blue-900 w-[22%]"
                  onClick={() => handleSort('area')}
                >
                  Curso {getSortIndicator('area')}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-blue-900 w-[12%]"
                  onClick={() => handleSort('municipio')}
                >
                  Unid. Univ. {getSortIndicator('municipio')}
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-blue-900 w-[10%]"
                  onClick={() => handleSort('conceito')}
                >
                  Conceito {getSortIndicator('conceito')}
                </th>
                <th className="py-4 px-3 text-center w-[8%]">Status</th>
                <th className="py-4 px-3 text-center w-[8%]">
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Inscritos
                  </span>
                </th>
                <th className="py-4 px-3 text-center w-[8%]">
                  <span className="inline-flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Partic.
                  </span>
                </th>
                <th className="py-4 px-3 text-center w-[8%]">
                  <span className="inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Acima Básico
                  </span>
                </th>
                <th
                  className="py-4 px-3 text-center cursor-pointer hover:text-blue-900 w-[12%]"
                  onClick={() => handleSort('percentual')}
                >
                  % Acima Padrão 1 {getSortIndicator('percentual')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map(d => {
                const grau = grauMap[d.codigo] ? ` (${grauMap[d.codigo]})` : '';
                const st = statusConfig[d.conceito] || { label: 'S/D', cl: 'bg-slate-400' };
                const statusTextColor =
                  d.conceito >= 3 && d.conceito <= 4 ? 'text-slate-900' : 'text-white';
                const pctFormatted = (d.percentualAcimaPadrao1 * 100).toFixed(1).replace('.', ',');
                const participacaoRate = d.concluintesInscritos > 0 
                  ? ((d.concluintesParticipantes / d.concluintesInscritos) * 100).toFixed(0) 
                  : '0';

                return (
                  <tr
                    key={d.codigo}
                    className="hover:bg-blue-50 transition-colors border-b border-slate-100"
                  >
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-black text-blue-950 text-xs leading-tight">
                          {d.area}{grau}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider mt-0.5">
                          CÓD: {d.codigo} • ÁREA: {d.codigoArea} • {d.modalidade}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-black uppercase text-[10px]">
                      {d.municipio}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div
                        className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-white font-black text-xl shadow-md"
                        style={{ backgroundColor: COLORS[d.conceito - 1] }}
                      >
                        {d.conceito}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-1 ${st.cl} ${statusTextColor} rounded-md text-[9px] font-black uppercase tracking-wider inline-block`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-slate-800 text-sm">{d.concluintesInscritos}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-slate-800 text-sm">{d.concluintesParticipantes}</span>
                        <span className="text-[9px] font-bold text-slate-400">({participacaoRate}%)</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-black text-slate-800 text-sm">{d.concluinteAcimaBasico}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-black text-sm" style={{
                          color: d.percentualAcimaPadrao1 >= 0.7 ? '#16A34A' 
                            : d.percentualAcimaPadrao1 >= 0.5 ? '#EAB308' 
                            : '#DC2626'
                        }}>
                          {pctFormatted}%
                        </span>
                        <div className="w-full max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${d.percentualAcimaPadrao1 * 100}%`,
                              backgroundColor: d.percentualAcimaPadrao1 >= 0.7 ? '#16A34A' 
                                : d.percentualAcimaPadrao1 >= 0.5 ? '#EAB308' 
                                : '#DC2626'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
