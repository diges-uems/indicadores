'use client';

import { useMemo } from 'react';
import { processCourseData } from '@/lib/sinaes/use-course-data';
import { convertToRange } from '@/lib/sinaes/converters';
import { Maximize2 } from 'lucide-react';

interface CampusDataItem {
  m: string;
  v: number;
  c: number;
}

export function CampusCharts({ onExpand }: { onExpand?: () => void }) {
  const campusData = useMemo(() => {
    const allData = processCourseData();
    const map: Record<string, { s: number; c: number }> = {};

    allData.forEach(r => {
      if (!r.area.includes('extinto') && !r.area.includes('extinção') && r.municipio !== 'Amambai') {
        if (!map[r.municipio]) map[r.municipio] = { s: 0, c: 0 };
        const er = convertToRange(r.en);
        if (er) {
          map[r.municipio].s += er;
          map[r.municipio].c++;
        }
      }
    });

    return Object.keys(map)
      .map(m => ({
        m,
        v: map[m].c > 0 ? map[m].s / map[m].c : 0,
        c: map[m].c,
      }))
      .sort((a, b) => b.v - a.v);
  }, []);

  return (
    <section className="bg-white rounded-[2.5rem] p-10 bento-shadow border border-gray-100 h-full relative group transition-transform duration-300">
      {onExpand && (
        <button
          onClick={onExpand}
          className="btn-zoom absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-md border border-slate-200 z-10"
          title="Ampliar Secção"
        >
          <Maximize2 className="w-6 h-6" />
        </button>
      )}

      <div className="mb-8 pr-12">
        <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase">
          Qualidade por Unidade Universitária
        </h3>
        <p className="text-base text-slate-950 font-black mt-1 uppercase">
          Média Institucional (1 a 5)
        </p>
      </div>
      <div className="space-y-4 pr-4">
        {campusData.map((item) => (
          <div key={item.m} className="flex items-center gap-4 break-inside-avoid">
            <div className="w-40 text-right shrink-0">
              <p className="text-sm font-black uppercase leading-none truncate" title={item.m}>
                {item.m}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1">
                {item.c} cursos
              </p>
            </div>
            <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center justify-end pr-3 bar-animate"
                style={{ width: `${(item.v / 5) * 100}%` }}
              >
                <span className="text-sm text-white font-black leading-none">
                  {item.v.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
