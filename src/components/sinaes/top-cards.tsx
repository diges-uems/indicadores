'use client';

import { useMemo } from 'react';
import { processCourseData, getCourseName, type ProcessedCourseData } from '@/lib/sinaes/use-course-data';
import { convertToRange } from '@/lib/sinaes/converters';
import { institutionalData } from '@/data/institutional-data';
import { BadgeHtml } from './badge-components';
import { TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

export function TopCards() {
  const allData = useMemo(() => processCourseData(), []);

  const { highlightCount, criticalCount, highlightPercentage, criticalPercentage, highlightMap, criticalMap } = useMemo(() => {
    let hl = 0;
    let cr = 0;
    const hlMap: Record<string, string[]> = {};
    const crMap: Record<string, string[]> = {};

    allData.forEach(r => {
      const cn = getCourseName(r.area, r.codigo);

      if (r.fn != null && r.fn >= 4) {
        hl++;
        if (!hlMap[cn]) hlMap[cn] = [];
        hlMap[cn].push(r.municipio);
      }
      if (r.fn != null && r.fn <= 2) {
        cr++;
        if (!crMap[cn]) crMap[cn] = [];
        crMap[cn].push(r.municipio);
      }
    });

    return {
      highlightCount: hl,
      criticalCount: cr,
      highlightPercentage: allData.length > 0 ? Math.round((hl / allData.length) * 100) : 0,
      criticalPercentage: allData.length > 0 ? Math.round((cr / allData.length) * 100) : 0,
      highlightMap: hlMap,
      criticalMap: crMap,
    };
  }, [allData]);

  const igRange = convertToRange(institutionalData.ig);
  const enadeRange = convertToRange(institutionalData.enade);
  const iddRange = convertToRange(institutionalData.idd);
  const cpcRange = convertToRange(institutionalData.cpc);

  const renderTags = (mapObj: Record<string, string[]>, colorClass: string) => {
    return Object.keys(mapObj)
      .sort()
      .map((course) => {
        const campuses = [...new Set(mapObj[course])].join(', ');
        return (
          <span
            key={course}
            title={`Unidade Universitária: ${campuses}`}
            className={`inline-block px-3 py-1.5 bg-white ${colorClass} text-[11px] font-black rounded-lg border border-slate-200 shadow-sm uppercase truncate max-w-[200px] cursor-help hover:bg-slate-50 transition-colors`}
          >
            {course}
          </span>
        );
      });
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Média Institucional */}
      <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-[1rem] bg-[#F0F5FF] text-[#2563EB] flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="bg-[#F0F5FF] text-[#2563EB] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-50">
              Média Oficial UEMS
            </span>
          </div>
          <p className="text-sm font-black text-slate-950 uppercase tracking-widest mb-4">
            Índice Geral de Cursos (IGC)
          </p>
          <BadgeHtml faixa={igRange} valor={institutionalData.ig} size="lg" />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-2xl py-3 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1.5">
            <p className="text-xs text-slate-950 font-black uppercase tracking-widest mb-0.5">ENADE</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={enadeRange} valor={institutionalData.enade} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl py-3 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1.5">
            <p className="text-xs text-slate-950 font-black uppercase tracking-widest mb-0.5">IDD</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={iddRange} valor={institutionalData.idd} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl py-3 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1.5">
            <p className="text-xs text-slate-950 font-black uppercase tracking-widest mb-0.5">CPC</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={cpcRange} valor={institutionalData.cpc} />
            </div>
          </div>
        </div>
      </div>

      {/* CONCEITOS 4 E 5 */}
      <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-[1rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="bg-[#16A34A] text-white text-lg font-black px-4 py-1.5 rounded-full shadow-lg shadow-green-100">
              {highlightPercentage}%
            </span>
          </div>
          <p className="text-sm font-black text-slate-950 uppercase tracking-widest mb-1 leading-tight">
            CONCEITOS 4 E 5 CPC
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-7xl font-black text-slate-950 tracking-tighter leading-none">
              {highlightCount}
            </p>
            <p className="text-base font-semibold text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-gray-100">
          <p className="text-xs text-slate-950 font-black uppercase mb-3 tracking-widest">
            Cursos na faixa
          </p>
          <div className="flex flex-wrap gap-2">
            {renderTags(highlightMap, 'text-emerald-700')}
          </div>
        </div>
      </div>

      {/* CONCEITOS 1 E 2 */}
      <div className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-[1rem] bg-red-50 text-red-600 flex items-center justify-center shadow-inner relative">
              <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="bg-[#DC2626] text-white text-lg font-black px-4 py-1.5 rounded-full shadow-lg shadow-red-100">
              {criticalPercentage}%
            </span>
          </div>
          <p className="text-sm font-black text-slate-950 uppercase tracking-widest mb-1 leading-tight">
            CONCEITOS 1 E 2 CPC
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-7xl font-black text-slate-950 tracking-tighter leading-none">
              {criticalCount}
            </p>
            <p className="text-base font-semibold text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t border-gray-100">
          <p className="text-xs text-red-700 font-black uppercase mb-3 tracking-widest">
            Cursos na faixa
          </p>
          <div className="flex flex-wrap gap-2">
            {renderTags(criticalMap, 'text-red-700')}
          </div>
        </div>
      </div>
    </section>
  );
}
