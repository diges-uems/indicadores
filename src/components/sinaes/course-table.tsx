'use client';

import { useState, useMemo } from 'react';
import { processCourseData, getCourseName, getCleanArea, getUniqueCourses, getUniqueCampi, type ProcessedCourseData } from '@/lib/sinaes/use-course-data';
import { grauMap } from '@/data/grau-map';
import { nationalBenchmarks } from '@/data/national-benchmarks';
import { statusConfig } from '@/lib/sinaes/status-config';
import { CreateBadge } from './badge-components';

interface CourseTableProps {
  onCourseClick: (codigo: string) => void;
  maxYear?: number;
}

type SortColumn = 'en' | 'id' | 'cp';
type SortDirection = 'asc' | 'desc';

export function CourseTable({ onCourseClick, maxYear = 2025 }: CourseTableProps) {
  const allData = useMemo(() => processCourseData(maxYear), [maxYear]);

  const [filterCourse, setFilterCourse] = useState('');
  const [filterGrau, setFilterGrau] = useState('');
  const [filterCampus, setFilterCampus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortCol, setSortCol] = useState<SortColumn>('cp');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const uniqueCourses = useMemo(() => getUniqueCourses(allData), [allData]);
  const uniqueCampi = useMemo(() => getUniqueCampi(allData), [allData]);

  const filteredData = useMemo(() => {
    const filtered = allData.filter(r => {
      const grauReal = grauMap[r.codigo] || '';
      const courseFullName = getCourseName(r.area, r.codigo);

      const matchCourse = !filterCourse || courseFullName === filterCourse;
      const matchGrau = !filterGrau || grauReal === filterGrau;
      const matchCampus = !filterCampus || r.municipio === filterCampus;
      const matchStatus =
        !filterStatus ||
        (r.fn != null && r.fn >= 4 && filterStatus === 'BOM') ||
        (r.fn === 3 && filterStatus === 'SUFICIENTE') ||
        (r.fn != null && r.fn <= 2 && filterStatus === 'INSUFICIENTE');

      return matchCourse && matchGrau && matchCampus && matchStatus;
    });

    filtered.sort((a, b) => {
      const valA = a[sortCol] ?? -1;
      const valB = b[sortCol] ?? -1;
      if (valA !== valB) return (sortDir === 'desc' ? -1 : 1) * (valA - valB);
      return a.area.localeCompare(b.area);
    });

    return filtered;
  }, [allData, filterCourse, filterGrau, filterCampus, filterStatus, sortCol, sortDir]);

  const handleSort = (c: SortColumn) => {
    if (sortCol === c) {
      setSortDir(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortCol(c);
      setSortDir('desc');
    }
  };

  const getSortIndicator = (c: SortColumn) => {
    if (c !== sortCol) return <span className="text-slate-500 text-xs">↕</span>;
    return sortDir === 'desc' ? (
      <span className="text-blue-900 text-sm font-black">↓</span>
    ) : (
      <span className="text-blue-900 text-sm font-black">↑</span>
    );
  };

  const resetFilters = () => {
    setFilterCourse('');
    setFilterGrau('');
    setFilterCampus('');
    setFilterStatus('');
  };

  return (
    <section className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 mb-10 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-[#00338C] tracking-tight uppercase">
          Monitoramento de Cursos (2021-2023)
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
        >
          <option value="">Curso (Todos)</option>
          {uniqueCourses.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterGrau}
          onChange={(e) => setFilterGrau(e.target.value)}
          className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
        >
          <option value="">Grau (Todos)</option>
          <option value="Licenciatura">Licenciatura</option>
          <option value="Bacharelado">Bacharelado</option>
          <option value="Tecnológico">Tecnológico</option>
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 text-sm font-black text-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 outline-none cursor-pointer uppercase shadow-sm"
        >
          <option value="">Status (Todos)</option>
          <option value="BOM">Bom / Muito bom (4-5)</option>
          <option value="SUFICIENTE">Suficiente (3)</option>
          <option value="INSUFICIENTE">Não atende / Insuficiente (1-2)</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <p className="text-sm font-black text-slate-950 uppercase tracking-widest">
          Exibindo <span className="text-[#00338C]">{filteredData.length}</span> de{' '}
          <span>{allData.length}</span>
        </p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-xs font-black text-white bg-slate-950 hover:bg-black rounded-lg transition-colors uppercase shadow-sm"
        >
          Limpar Filtros
        </button>
      </div>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-950 border-b border-gray-200 uppercase font-black text-xs tracking-widest">
              <th className="py-4 px-5 w-[35%]">Curso</th>
              <th className="py-4 px-5 text-center w-[15%]">Unid. Universitária</th>
              <th
                className="text-center py-4 px-2 cursor-pointer hover:text-blue-900"
                onClick={() => handleSort('en')}
              >
                ENADE {getSortIndicator('en')}
              </th>
              <th
                className="text-center py-4 px-2 cursor-pointer hover:text-blue-900"
                onClick={() => handleSort('id')}
              >
                IDD {getSortIndicator('id')}
              </th>
              <th
                className="text-center py-4 px-2 cursor-pointer hover:text-blue-900"
                onClick={() => handleSort('cp')}
              >
                CPC {getSortIndicator('cp')}
              </th>
              <th className="text-center py-4 px-5 w-[14%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.map(r => {
              const ac = getCleanArea(r.area);
              const b = nationalBenchmarks[ac] || ({} as Record<string, number>);
              const gs = grauMap[r.codigo] ? ` (${grauMap[r.codigo]})` : '';
              const st = statusConfig[r.fn ?? 0] || { label: 'S/D', cl: 'bg-slate-400' };
              const statusTextColor =
                r.fn != null && r.fn >= 3 && r.fn <= 4 ? 'text-slate-900' : 'text-white';

              return (
                <tr
                  key={r.codigo}
                  className="hover:bg-blue-50 transition-colors cursor-pointer border-b border-slate-100"
                  onClick={() => onCourseClick(r.codigo)}
                >
                  <td className="py-3 px-5">
                    <div className="flex flex-col">
                      <span className="font-black text-blue-950 text-sm">
                        {r.area}{gs}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mt-0.5">
                        CÓD: {r.codigo}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center font-black uppercase text-xs">
                    {r.municipio}
                  </td>
                  <td className="py-3 px-1 text-center">
                    <CreateBadge v={r.en} nV={b.enade} />
                  </td>
                  <td className="py-3 px-1 text-center">
                    <CreateBadge v={r.id} nV={b.idd} />
                  </td>
                  <td className="py-3 px-1 text-center">
                    <CreateBadge v={r.cp} nV={b.cpc} />
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`px-2.5 py-1 ${st.cl} ${statusTextColor} rounded-lg text-[10px] font-black uppercase tracking-wider inline-block`}
                    >
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
