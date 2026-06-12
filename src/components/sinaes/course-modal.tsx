'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { processCourseData, getCourseName, getCleanArea, type ProcessedCourseData } from '@/lib/sinaes/use-course-data';
import { grauMap } from '@/data/grau-map';
import { nationalBenchmarks } from '@/data/national-benchmarks';
import { convertToRange } from '@/lib/sinaes/converters';
import { statusConfig } from '@/lib/sinaes/status-config';
import { ArrowUp, ArrowDown, Printer, X } from 'lucide-react';

interface CourseModalProps {
  codigo: string | null;
  open: boolean;
  onClose: () => void;
}

function ComparisonCard({
  title,
  v,
  n,
}: {
  title: string;
  v: number | null;
  n: number | null | undefined;
}) {
  if (v == null) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 border text-center text-xs font-black uppercase text-slate-500 flex items-center justify-center break-inside-avoid">
        {title} Indisponível
      </div>
    );
  }

  const d = n != null ? v - n : 0;
  const isP = d >= 0;
  const faixa = convertToRange(v);
  const faixaClass = statusConfig[faixa ?? 0]?.cl || 'bg-slate-400';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm relative overflow-hidden break-inside-avoid">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest">
          {title}
        </h4>
        {n != null ? (
          <span
            className={`inline-block ${
              isP ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'
            } px-2 py-0.5 rounded shadow-sm border font-black text-[10px] uppercase`}
          >
            {isP ? '↑' : '↓'} {Math.abs(d).toFixed(2)} vs Nac.
          </span>
        ) : (
          <span className="text-[10px] font-black text-slate-500 uppercase">
            Sem Ref.
          </span>
        )}
      </div>
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Contínuo
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900" title="Nota Contínua">
              {v.toFixed(3)}
            </span>
            <span className="text-sm font-black text-slate-400">/ 5.0</span>
          </div>
        </div>
        <div className="text-right flex flex-col items-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
            Conceito
          </p>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-2xl text-white font-black text-2xl shadow-lg border border-white/20 ${faixaClass}`}
          >
            {faixa}
          </div>
        </div>
      </div>
      <div className="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden relative w-full">
        <div
          className={`absolute top-0 left-0 h-full ${faixaClass}`}
          style={{ width: `${(v / 5) * 100}%` }}
        />
        {n != null && (
          <div
            className="absolute top-[-2px] bottom-[-2px] w-1.5 bg-slate-900 rounded-full shadow-md z-10 border border-white"
            style={{ left: `${(n / 5) * 100}%` }}
          />
        )}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-black text-slate-500 uppercase">
          Seu Curso
        </span>
        {n != null && (
          <span className="text-[10px] font-black text-slate-500 uppercase">
            Média Nac. ({n.toFixed(2)})
          </span>
        )}
      </div>
    </div>
  );
}

function HistoricalRow({
  label,
  record,
  prefix,
}: {
  label: string;
  record: ProcessedCourseData;
  prefix: string;
}) {
  const years = [2021, 2022, 2023, 2024, 2025];
  const values = years.map(y => (record as unknown as Record<string, unknown>)[`${prefix}${y}`] as number | undefined);
  const d = values[0] != null && values[4] != null ? values[4]! - values[0]! : 0;

  return (
    <tr>
      <td className="font-black py-5 px-10 uppercase text-sm text-slate-950 text-left">
        {label}
      </td>
      {values.map((v, idx) => {
        const faixa = v != null ? convertToRange(v) : null;
        const faixaClass = faixa != null ? statusConfig[faixa]?.cl || '' : '';
        const textColor =
          faixa === 3 || faixa === 4 ? 'text-slate-950' : 'text-white';

        return (
          <td
            key={idx}
            className={`py-3 px-1 sm:py-5 sm:px-3 ${idx >= 3 ? 'bg-slate-200' : ''}`}
          >
            <span
              className={`inline-block px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-black text-sm border border-slate-300 ${
                v != null
                  ? `${faixaClass} ${textColor} shadow-md`
                  : 'bg-slate-100 text-slate-950'
              }`}
            >
              {v == null ? '-' : Number(v).toFixed(3)}
            </span>
          </td>
        );
      })}
      <td
        className={`text-center py-3 px-1 sm:py-5 sm:px-3 font-black text-sm ${
          d > 0
            ? 'text-green-800'
            : d < 0
            ? 'text-red-800'
            : 'text-slate-950'
        }`}
      >
        {d ? (d > 0 ? '+' : '') + d.toFixed(3) : '-'}
      </td>
    </tr>
  );
}

export function CourseModal({ codigo, open, onClose }: CourseModalProps) {
  const allData = useMemo(() => processCourseData(), []);
  const record = useMemo(
    () => allData.find(x => x.codigo === codigo),
    [allData, codigo]
  );

  if (!record) return null;

  const ac = getCleanArea(record.area);
  const b = nationalBenchmarks[ac] || ({} as Record<string, number>);
  const cursoNome = getCourseName(record.area, record.codigo);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-300 w-full max-w-[98vw] sm:max-w-[98vw] md:max-w-[98vw] h-[96vh] p-0 gap-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{cursoNome}</DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes do curso {cursoNome}
        </DialogDescription>

        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-100 z-10 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest mb-2 shadow-sm border border-blue-200">
              CÓD: {codigo}
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              {cursoNome}
            </h2>
            <p className="text-slate-700 font-black mt-1 uppercase text-sm tracking-widest">
              Unidade Universitária: {record.municipio}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#00338C] hover:bg-blue-50 hover:text-blue-800 border-2 border-blue-100 shadow-sm transition-transform hover:scale-105 shrink-0"
              title="Gerar Relatório em PDF"
            >
              <Printer className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-100 shadow-sm transition-transform hover:rotate-90 shrink-0"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-50 relative overflow-y-auto overflow-x-hidden p-8">
          <h3 className="text-base font-black text-slate-950 uppercase tracking-widest mb-6">
            Comparativo Institucional vs. Média Nacional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <ComparisonCard title="ENADE" v={record.en} n={b.enade} />
            <ComparisonCard title="IDD" v={record.id} n={b.idd} />
            <ComparisonCard title="CPC" v={record.cp} n={b.cpc} />
          </div>
          <h3 className="text-base font-black text-slate-950 uppercase tracking-widest mb-6 text-center mt-4">
            Histórico Detalhado
          </h3>
          <div className="history-wrapper w-full overflow-x-auto overflow-y-visible rounded-[2rem] border border-slate-300 shadow-sm break-inside-avoid bg-white mb-8">
            <table className="w-full text-sm text-center min-w-[800px]">
              <thead>
                <tr className="bg-slate-200 text-slate-950 text-sm font-black border-b border-slate-400 uppercase tracking-widest">
                  <th className="text-left py-6 px-10">Indicador</th>
                  <th>21</th>
                  <th>22</th>
                  <th>23</th>
                  <th>24</th>
                  <th>25</th>
                  <th className="px-10">Var</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 bg-white">
                <HistoricalRow label="ENADE" record={record} prefix="enade" />
                <HistoricalRow label="IDD" record={record} prefix="idd" />
                <HistoricalRow label="CPC" record={record} prefix="cpc" />
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
