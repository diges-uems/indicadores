'use client';

import { convertToRange } from '@/lib/sinaes/converters';
import { statusConfig } from '@/lib/sinaes/status-config';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface BadgeHtmlProps {
  faixa: number | null;
  valor: number | null;
  size?: 'sm' | 'lg';
}

export function BadgeHtml({ faixa, valor, size = 'sm' }: BadgeHtmlProps) {
  if (valor == null) {
    return (
      <div className="px-3 py-1 bg-slate-100 rounded-md border text-slate-950 text-base font-black">
        -
      </div>
    );
  }

  const st = statusConfig[faixa ?? 0] || { label: 'S/D', cl: 'bg-slate-400' };
  const txtColor =
    faixa === 3 || faixa === 4 ? 'text-slate-950' : 'text-white';
  const v = Number(valor);

  if (size === 'lg') {
    return (
      <div className="inline-flex rounded-xl overflow-hidden border border-slate-300 shadow-md">
        <div
          className={`flex items-center justify-center min-w-[60px] px-6 py-4 font-black text-5xl ${txtColor} ${st.cl}`}
        >
          {faixa}
        </div>
        <div className="flex items-center justify-center min-w-[90px] px-6 py-4 font-black text-5xl bg-[#fffcf0] text-slate-900">
          {v.toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-slate-300 shadow-sm">
      <div
        className={`flex items-center justify-center min-w-[40px] px-3 py-2 font-black text-lg ${txtColor} ${st.cl}`}
      >
        {faixa}
      </div>
      <div className="flex items-center justify-center min-w-[64px] px-3 py-2 font-black text-lg bg-[#fffcf0] text-slate-900">
        {v.toFixed(2)}
      </div>
    </div>
  );
}

interface CreateBadgeProps {
  v: number | null;
  nV?: number | null;
}

export function CreateBadge({ v, nV }: CreateBadgeProps) {
  if (v == null) {
    return (
      <div className="inline-flex rounded-md border border-slate-400 bg-slate-50">
        <div className="px-3 py-1 font-black text-sm">-</div>
      </div>
    );
  }

  const r = convertToRange(v);
  const st = statusConfig[r ?? 0] || { label: 'S/D', cl: 'bg-slate-400' };
  const txtColor =
    r === 3 || r === 4 ? 'text-slate-900' : 'text-white';

  let iconEl: React.ReactNode = null;
  if (nV != null) {
    const diff = v - nV;
    if (diff > 0) {
      iconEl = (
        <ArrowUp className="w-2.5 h-2.5 ml-1 inline text-green-700" />
      );
    } else if (diff < 0) {
      iconEl = (
        <ArrowDown className="w-2.5 h-2.5 ml-1 inline text-red-700" />
      );
    } else {
      iconEl = <span className="ml-1 text-xs font-black">=</span>;
    }
  }

  const tooltip =
    nV != null ? `Média Nacional: ${nV.toFixed(2)}` : 'Sem Referência';

  return (
    <div
      title={tooltip}
      className="inline-flex rounded-lg overflow-hidden border border-slate-400 cursor-help"
    >
      <div
        className={`flex items-center justify-center min-w-[32px] px-2 py-1.5 font-black text-base ${txtColor} ${st.cl}`}
      >
        {r}
      </div>
      <div className="flex items-center justify-center min-w-[50px] px-2 py-1.5 font-black text-base bg-[#fffcf0] text-slate-900">
        {v.toFixed(3)}
        {iconEl}
      </div>
    </div>
  );
}
