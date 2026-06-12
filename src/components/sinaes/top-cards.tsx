'use client';

import { useMemo } from 'react';
import { processCourseData, getCourseName, type ProcessedCourseData } from '@/lib/sinaes/use-course-data';
import { convertToRange } from '@/lib/sinaes/converters';
import { institutionalData } from '@/data/institutional-data';
import { BadgeHtml } from './badge-components';
import { TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface TopCardsProps {
  maxYear?: number;
}

export function TopCards({ maxYear = 2025 }: TopCardsProps) {
  const allData = useMemo(() => processCourseData(maxYear), [maxYear]);

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
            className={`inline-block px-2.5 py-1 bg-white ${colorClass} text-[10px] font-black rounded-lg border border-slate-200 shadow-sm uppercase truncate max-w-[180px] cursor-help hover:bg-slate-50 transition-colors`}
          >
            {course}
          </span>
        );
      });
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Média Institucional */}
      <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-[0.8rem] bg-[#F0F5FF] text-[#2563EB] flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-[#F0F5FF] text-[#2563EB] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-50">
              Média Oficial UEMS
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-3">
            Índice Geral de Cursos (IGC)
          </p>
          <BadgeHtml faixa={igRange} valor={institutionalData.ig} size="lg" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-xl py-2.5 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1">
            <p className="text-[10px] text-slate-950 font-black uppercase tracking-widest">ENADE</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={enadeRange} valor={institutionalData.enade} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1">
            <p className="text-[10px] text-slate-950 font-black uppercase tracking-widest">IDD</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={iddRange} valor={institutionalData.idd} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5 px-1 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1">
            <p className="text-[10px] text-slate-950 font-black uppercase tracking-widest">CPC</p>
            <div className="w-full flex justify-center">
              <BadgeHtml faixa={cpcRange} valor={institutionalData.cpc} />
            </div>
          </div>
        </div>
      </div>

      {/* CONCEITOS 4 E 5 */}
      <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-[0.8rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="bg-[#16A34A] text-white text-base font-black px-3 py-1 rounded-full shadow-lg shadow-green-100">
              {highlightPercentage}%
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1 leading-tight">
            CONCEITOS 4 E 5 CPC
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-6xl font-black text-slate-950 tracking-tighter leading-none">
              {highlightCount}
            </p>
            <p className="text-sm font-semibold text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-slate-950 font-black uppercase mb-2 tracking-widest">
            Cursos na faixa
          </p>
          <div className="flex flex-wrap gap-1.5">
            {renderTags(highlightMap, 'text-emerald-700')}
          </div>
        </div>
      </div>

      {/* CONCEITOS 1 E 2 */}
      <div className="bg-white rounded-[2rem] p-6 bento-shadow border border-gray-100 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-[0.8rem] bg-red-50 text-red-600 flex items-center justify-center shadow-inner relative">
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="bg-[#DC2626] text-white text-base font-black px-3 py-1 rounded-full shadow-lg shadow-red-100">
              {criticalPercentage}%
            </span>
          </div>
          <p className="text-xs font-black text-slate-950 uppercase tracking-widest mb-1 leading-tight">
            CONCEITOS 1 E 2 CPC
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-6xl font-black text-slate-950 tracking-tighter leading-none">
              {criticalCount}
            </p>
            <p className="text-sm font-semibold text-slate-950 uppercase">cursos</p>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-red-700 font-black uppercase mb-2 tracking-widest">
            Cursos na faixa
          </p>
          <div className="flex flex-wrap gap-1.5">
            {renderTags(criticalMap, 'text-red-700')}
          </div>
        </div>
      </div>
    </section>
  );
}
