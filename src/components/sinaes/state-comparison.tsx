'use client';

import { stateComparisonData } from '@/data/state-comparison';
import { BadgeHtml } from './badge-components';
import { Maximize2 } from 'lucide-react';

export function StateComparison({ onExpand }: { onExpand?: () => void }) {
  return (
    <section className="bg-white rounded-[2.5rem] p-10 bento-shadow border border-gray-100 h-full overflow-hidden relative group transition-transform duration-300">
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
          Comparativo Estadual
        </h3>
        <p className="text-base text-slate-950 font-black mt-1 uppercase">
          IES Públicas de MS
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-[1.5rem] border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100 uppercase font-black text-sm text-slate-950 tracking-wider">
              <th className="py-5 px-6">IES</th>
              <th className="py-5 px-2 text-center">ENADE</th>
              <th className="py-5 px-2 text-center">IDD</th>
              <th className="py-5 px-2 text-center">CPC</th>
              <th className="py-5 px-6 text-center">IGC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {stateComparisonData.map((d) => (
              <tr
                key={d.ies}
                className="hover:bg-slate-50 border-b border-slate-50 break-inside-avoid"
              >
                <td className="py-5 px-6 font-black text-2xl text-slate-900">
                  {d.ies}
                </td>
                <td className="py-5 px-2 text-center">
                  <BadgeHtml faixa={d.en[0]} valor={d.en[1]} />
                </td>
                <td className="py-5 px-2 text-center">
                  <BadgeHtml faixa={d.idd[0]} valor={d.idd[1]} />
                </td>
                <td className="py-5 px-2 text-center">
                  <BadgeHtml faixa={d.cp[0]} valor={d.cp[1]} />
                </td>
                <td className="py-5 px-6 text-center">
                  <BadgeHtml faixa={d.ig[0]} valor={d.ig[1]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
