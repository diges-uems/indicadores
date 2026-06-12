'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { processCourseData } from '@/lib/sinaes/use-course-data';
import { convertToRange } from '@/lib/sinaes/converters';
import { statusColors, shortLabels, longLabels } from '@/lib/sinaes/status-config';

const COLORS = [statusColors[1], statusColors[2], statusColors[3], statusColors[4], statusColors[5]];

interface ChartDataItem {
  name: string;
  value: number;
  shortLabel: string;
  concept: number;
}

interface EnadePieChartProps {
  maxYear?: number;
}

export function EnadePieChart({ maxYear = 2025 }: EnadePieChartProps) {
  const { chartData, totalCounts } = useMemo(() => {
    const allData = processCourseData(maxYear);
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    allData.forEach(r => {
      if (!r.area.includes('extinto') && !r.area.includes('extinção')) {
        const range = convertToRange(r.en);
        if (range) {
          counts[range]++;
          total++;
        }
      }
    });

    const data: ChartDataItem[] = [1, 2, 3, 4, 5].map(i => ({
      name: longLabels[i - 1],
      value: counts[i],
      shortLabel: shortLabels[i - 1],
      concept: i,
    }));

    return { chartData: data, totalCounts: { counts, total } };
  }, [maxYear]);

  const { counts, total } = totalCounts;

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
    <section className="bg-white rounded-[2rem] p-8 bento-shadow border border-gray-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
      <div className="w-full md:w-5/12 flex flex-col justify-center">
        <h2 className="text-2xl font-black text-[#00338C] uppercase tracking-tight mb-2">
          Desempenho ENADE
        </h2>
        <p className="text-sm text-slate-500 font-medium mb-6">
          Distribuição percentual dos conceitos oficiais obtidos pelos cursos na prova do ENADE.
        </p>
        <div className="space-y-2.5 w-full">
          {[5, 4, 3, 2, 1].map((i) => {
            const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
            return (
              <div
                key={i}
                className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white font-black shadow-inner text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: COLORS[i - 1] }}
                  >
                    {i}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase leading-tight">
                      {shortLabels[i - 1]}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                      {longLabels[i - 1].split('(')[1]?.replace(')', '')}
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
        <div className="relative w-64 h-64 lg:w-[24rem] lg:h-[24rem] filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-105">
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
  );
}
