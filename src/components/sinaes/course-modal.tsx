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
import { Printer, X } from 'lucide-react';

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

function formatNum(v: number | null | undefined): string {
  return v == null ? '-' : Number(v).toFixed(3).replace('.', ',');
}

function formatConcept(v: number | null | undefined): string {
  if (v == null) return '-';
  const r = convertToRange(v);
  if (r === 1) return '1 - Não atende';
  if (r === 2) return '2 - Insuficiente';
  if (r === 3) return '3 - Suficiente';
  if (r === 4) return '4 - Bom';
  if (r === 5) return '5 - Muito bom';
  return '-';
}

function formatSit(v: number | null, n: number | null | undefined): string {
  if (v == null || n == null) return 'Sem Referência';
  const diff = v - n;
  if (diff >= 0) return `Acima da Média (↑ ${diff.toFixed(2).replace('.', ',')})`;
  return `Abaixo da Média (↓ ${Math.abs(diff).toFixed(2).replace('.', ',')})`;
}

function PrintHistoricalRow({
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

  let varHtml = '-';
  if (values[0] != null && values[4] != null) {
    if (d > 0) varHtml = `↑ +${d.toFixed(3).replace('.', ',')}`;
    else if (d < 0) varHtml = `↓ ${d.toFixed(3).replace('.', ',')}`;
    else varHtml = '= 0,000';
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="p-3 text-left font-semibold">{label}</td>
      {values.map((v, idx) => (
        <td key={idx} className="p-2">
          {v == null ? <span className="text-gray-400">-</span> : formatNum(v)}
        </td>
      ))}
      <td className="p-2 text-right font-bold">{varHtml}</td>
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
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const handlePrint = () => {
    const printArea = document.getElementById('printArea');
    if (printArea) {
      printArea.style.display = 'block';
      window.print();
      setTimeout(() => {
        printArea.style.display = 'none';
      }, 1000);
    }
  };

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
              onClick={handlePrint}
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

      {/* Print Area - Hidden on screen, visible on print */}
      <div id="printArea" style={{ display: 'none' }}>
        <div style={{ padding: '1.5cm', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: '#333', lineHeight: 1.5 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <img
                src="https://www.uems.br/anexos/imagens/conteudo/uems_imagens_2025-06-13_13-31-53.png"
                alt="Logo UEMS"
                style={{ height: '96px', margin: '0 auto' }}
              />
            </div>
            <h1 style={{ color: '#003366', fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 'tight', margin: 0 }}>
              Divisão de Gestão do ENADE e Indicadores da Educação Superior
            </h1>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', margin: '0.5rem 0' }}>
              Relatório de Monitoramento de Curso - SINAES
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Data de Emissão: {dataAtual}
            </p>
          </div>

          {/* 1. Identificação */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 'wide' }}>
              1. Identificação do Curso
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <p><strong>Curso:</strong> {cursoNome}</p>
              <p><strong>Unidade Universitária:</strong> {record.municipio}</p>
              <p><strong>Código INEP:</strong> {codigo}</p>
            </div>
          </section>

          {/* 2. Resultados Consolidados */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.25rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 'wide' }}>
              2. Resultados Consolidados (Último Ciclo Avaliativo)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#003366', color: 'white', fontWeight: 600 }}>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #1a365d' }}>Indicador</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #1a365d' }}>Nota Contínua</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #1a365d' }}>Conceito Final</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #1a365d' }}>Média Nacional</th>
                    <th style={{ padding: '0.75rem', borderBottom: '1px solid #1a365d', textAlign: 'right' }}>Situação vs. Nacional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>ENADE</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>{formatNum(record.en)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{formatConcept(record.en)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{formatNum(b.enade)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatSit(record.en, b.enade)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>IDD</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>{formatNum(record.id)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{formatConcept(record.id)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{formatNum(b.idd)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatSit(record.id, b.idd)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>CPC</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontFamily: 'monospace' }}>{formatNum(record.cp)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{formatConcept(record.cp)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{formatNum(b.cpc)}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatSit(record.cp, b.cpc)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Composição das Notas */}
          <section style={{ marginBottom: '2rem', backgroundColor: '#f9fafb', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 'wide' }}>
              3. Entendendo a Composição das Notas
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#4b5563', fontStyle: 'italic', textAlign: 'justify' }}>
              Para fins de diagnóstico e planejamento de ações da coordenação, detalhamos abaixo o que cada indicador mede e como o CPC é composto:
            </p>
            <ul style={{ fontSize: '0.875rem', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem' }}><strong>ENADE:</strong> Avalia o rendimento dos concluintes em relação aos conteúdos previstos nas diretrizes curriculares.</li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>IDD (Indicador de Diferença entre Desempenhos):</strong> Mede o &quot;valor agregado&quot; pelo curso ao aluno.
                <div style={{ marginTop: '0.5rem', backgroundColor: '#eff6ff', padding: '0.75rem', borderLeft: '4px solid #1e40af', fontSize: '0.75rem', color: '#374151', borderRadius: '0 0.375rem 0.375rem 0' }}>
                  <strong>Exemplo Prático:</strong> Imagine que um aluno ingressou na UEMS com uma nota baixa no ENEM (indicando base escolar frágil). Se, ao se formar, este mesmo aluno obtiver uma nota alta no ENADE, o IDD será elevado. Isso prova que a <strong>UEMS agregou conhecimento</strong> e transformou a trajetória acadêmica do estudante.
                </div>
              </li>
              <li>
                <strong>Composição do CPC:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}><strong>35%</strong> IDD</span>
                  <span style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}><strong>30%</strong> Corpo Docente</span>
                  <span style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}><strong>20%</strong> Nota ENADE</span>
                  <span style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem' }}><strong>15%</strong> Questionário Estudante</span>
                </div>
              </li>
            </ul>
          </section>

          {/* 4. Histórico Detalhado */}
          <section style={{ marginBottom: '2rem', pageBreakAfter: 'always' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', borderBottom: '2px solid #f3f4f6', paddingBottom: '0.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: 'wide' }}>
              4. Histórico Detalhado e Parâmetros de Avaliação
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', fontStyle: 'italic' }}>
                Evolução das Notas (2021-2025)
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'center', fontSize: '0.875rem', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #d1d5db' }}>Indicador</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #d1d5db' }}>2021</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #d1d5db' }}>2022</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #d1d5db' }}>2023</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #d1d5db' }}>2024</th>
                      <th style={{ padding: '0.5rem', borderBottom: '1px solid #d1d5db' }}>2025</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #d1d5db' }}>Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <PrintHistoricalRow label="ENADE" record={record} prefix="enade" />
                    <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb' }}>
                      <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>IDD</td>
                      {[2021,2022,2023,2024,2025].map(y => {
                        const v = (record as unknown as Record<string, unknown>)[`idd${y}`] as number | undefined;
                        return <td key={y} style={{ padding: '0.5rem' }}>{v == null ? <span style={{ color: '#9ca3af' }}>-</span> : formatNum(v)}</td>;
                      })}
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>-</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>CPC</td>
                      {[2021,2022,2023,2024,2025].map(y => {
                        const v = (record as unknown as Record<string, unknown>)[`cpc${y}`] as number | undefined;
                        return <td key={y} style={{ padding: '0.5rem' }}>{v == null ? <span style={{ color: '#9ca3af' }}>-</span> : formatNum(v)}</td>;
                      })}
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div style={{ width: '100%', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', fontStyle: 'italic' }}>
                Legenda Oficial (INEP)
              </h4>
              <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', color: '#4b5563' }}>
                    <th style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Conceito</th>
                    <th style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Faixa de Nota Contínua</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#374151' }}>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ width: '8px', height: '8px', display: 'inline-block', backgroundColor: '#dc2626', marginRight: '0.5rem', borderRadius: '50%' }}></span>1 - Não atende</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>0 a 0.944</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ width: '8px', height: '8px', display: 'inline-block', backgroundColor: '#f97316', marginRight: '0.5rem', borderRadius: '50%' }}></span>2 - Insuficiente</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>0.945 a 1.944</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f0fdf4', fontWeight: 600, color: '#166534' }}>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ width: '8px', height: '8px', display: 'inline-block', backgroundColor: '#eab308', marginRight: '0.5rem', borderRadius: '50%' }}></span>3 - Suficiente</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>1.945 a 2.944</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ width: '8px', height: '8px', display: 'inline-block', backgroundColor: '#22c55e', marginRight: '0.5rem', borderRadius: '50%' }}></span>4 - Bom</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>2.945 a 3.944</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ width: '8px', height: '8px', display: 'inline-block', backgroundColor: '#15803d', marginRight: '0.5rem', borderRadius: '50%' }}></span>5 - Muito bom</td>
                    <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>3.945 a 5.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '0.625rem', color: '#9ca3af', fontStyle: 'italic' }}>
              Documento gerado automaticamente pelo Portal de Indicadores de Ensino (SINAES/UEMS) para fins estritamente institucionais.
            </p>
          </footer>
        </div>
      </div>
    </Dialog>
  );
}
