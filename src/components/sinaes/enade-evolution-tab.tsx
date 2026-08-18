'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarRange, Database, GraduationCap, RefreshCw } from 'lucide-react';

const DEFAULT_API_URL =
  'https://script.google.com/macros/s/AKfycbyL7DBMevXocbkr9izJOaJc7B8LdLJyULxuV2bMSkWPEP4h0iyZYe_MinVL18gOyOl4/exec';
const API_URL = process.env.NEXT_PUBLIC_ENADE_EVOLUTION_API_URL || DEFAULT_API_URL;

interface ApiCourseRow {
  u?: unknown;
  cod?: unknown;
  cur?: unknown;
  g?: unknown;
  n?: unknown;
}

interface EvolutionCourse {
  unidade: string;
  codigo: string;
  curso: string;
  grau: string;
  notas: Record<number, number>;
}

const CONCEPT_COLORS: Record<number, string> = {
  1: '#DC2626',
  2: '#F97316',
  3: '#FACC15',
  4: '#4ADE80',
  5: '#15803D',
};

const CONCEPT_LABELS: Record<number, string> = {
  1: 'Crítico',
  2: 'Atenção',
  3: 'Adequado',
  4: 'Bom',
  5: 'Excelente',
};

function normalizeText(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function normalizeNote(value: unknown): number | null {
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (!Number.isFinite(numeric)) return null;

  const note = Math.round(numeric);
  return note >= 1 && note <= 5 ? note : null;
}

function normalizePayload(payload: unknown): EvolutionCourse[] {
  if (!Array.isArray(payload)) {
    throw new Error('A planilha retornou um formato de dados diferente do esperado.');
  }

  return payload
    .map((rawItem): EvolutionCourse => {
      const item = (rawItem ?? {}) as ApiCourseRow;
      const notes: Record<number, number> = {};
      const rawNotes = item.n;

      if (rawNotes && typeof rawNotes === 'object' && !Array.isArray(rawNotes)) {
        Object.entries(rawNotes as Record<string, unknown>).forEach(([year, value]) => {
          const numericYear = Number(year);
          const note = normalizeNote(value);
          if (Number.isInteger(numericYear) && note !== null) {
            notes[numericYear] = note;
          }
        });
      }

      return {
        unidade: normalizeText(item.u),
        codigo: normalizeText(item.cod),
        curso: normalizeText(item.cur),
        grau: normalizeText(item.g),
        notas: Object.fromEntries(
          Object.entries(notes).sort(([yearA], [yearB]) => Number(yearA) - Number(yearB)),
        ),
      };
    })
    .filter((course) => Object.keys(course.notas).length > 0);
}

function NoteBadge({ note }: { note: number | undefined }) {
  if (!note) {
    return <span className="text-sm font-bold text-slate-300">—</span>;
  }

  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm ring-1 ring-black/5"
      style={{
        backgroundColor: CONCEPT_COLORS[note],
        color: note === 3 || note === 4 ? '#0f172a' : '#ffffff',
      }}
      title={`Nota ${note}: ${CONCEPT_LABELS[note]}`}
    >
      {note}
    </span>
  );
}

export function EnadeEvolutionTab() {
  const [courses, setCourses] = useState<EvolutionCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filterUnit, setFilterUnit] = useState('');
  const [filterCode, setFilterCode] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterDegree, setFilterDegree] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`A planilha respondeu com o status ${response.status}.`);
      }

      const payload: unknown = await response.json();
      setCourses(normalizePayload(payload));
      setLastUpdated(new Date());
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Não foi possível carregar os dados da planilha.';
      setError(`${message} Verifique se a publicação do Apps Script está acessível para qualquer pessoa.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadData]);

  const years = useMemo(
    () =>
      [...new Set(courses.flatMap((course) => Object.keys(course.notas).map(Number)))].sort(
        (yearA, yearB) => yearA - yearB,
      ),
    [courses],
  );

  const units = useMemo(
    () => [...new Set(courses.map((course) => course.unidade).filter(Boolean))].sort(),
    [courses],
  );

  const courseNames = useMemo(
    () => [...new Set(courses.map((course) => course.curso).filter(Boolean))].sort(),
    [courses],
  );

  const degrees = useMemo(
    () => [...new Set(courses.map((course) => course.grau).filter(Boolean))].sort(),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    const normalizedCode = filterCode.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesUnit = !filterUnit || course.unidade === filterUnit;
      const matchesCode = !normalizedCode || course.codigo.toLowerCase().includes(normalizedCode);
      const matchesCourse = !filterCourse || course.curso === filterCourse;
      const matchesDegree = !filterDegree || course.grau === filterDegree;
      return matchesUnit && matchesCode && matchesCourse && matchesDegree;
    });
  }, [courses, filterCode, filterCourse, filterDegree, filterUnit]);

  const latestYear = years.at(-1);
  const latestNotes = latestYear
    ? courses.map((course) => course.notas[latestYear]).filter((note): note is number => Boolean(note))
    : [];
  const latestAverage = latestNotes.length
    ? (latestNotes.reduce((sum, note) => sum + note, 0) / latestNotes.length).toFixed(1).replace('.', ',')
    : '—';

  const resetFilters = () => {
    setFilterUnit('');
    setFilterCode('');
    setFilterCourse('');
    setFilterDegree('');
  };

  const columnCount = 4 + years.length;

  return (
    <div className="animate-fade-in space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-10px_rgba(0,34,85,0.08)] md:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0F5FF] text-[#00338C]">
                <CalendarRange className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[#00338C] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                Série histórica
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#00338C] md:text-3xl">
              Evolução de notas ENADE
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
              Acompanhe a trajetória dos conceitos ENADE por curso e unidade universitária. Os dados são
              carregados diretamente da planilha publicada pelo Google Apps Script.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadData(true)}
            disabled={loading || refreshing}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#00338C] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar notas'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <GraduationCap className="h-4 w-4 text-[#00338C]" /> Cursos exibidos
            </div>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{filteredCourses.length}</p>
            <p className="text-xs font-semibold text-slate-400">de {courses.length} registros carregados</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <CalendarRange className="h-4 w-4 text-[#00338C]" /> Anos disponíveis
            </div>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{years.length}</p>
            <p className="text-xs font-semibold text-slate-400">
              {years.length ? `${years[0]} a ${years.at(-1)}` : 'Aguardando dados'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Database className="h-4 w-4 text-[#00338C]" /> Média do último ano
            </div>
            <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{latestAverage}</p>
            <p className="text-xs font-semibold text-slate-400">{latestYear ? `conceito ${latestYear}` : 'Sem referência'}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-10px_rgba(0,34,85,0.08)] md:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-bold text-slate-600">
          <span className="mr-1 uppercase tracking-widest text-slate-500">Legenda</span>
          {[1, 2, 3, 4, 5].map((note) => (
            <span key={note} className="inline-flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: CONCEPT_COLORS[note] }}
              />
              {note} — {CONCEPT_LABELS[note]}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Unidade
            <select
              value={filterUnit}
              onChange={(event) => setFilterUnit(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition focus:border-[#00338C] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todas</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Código
            <input
              type="search"
              value={filterCode}
              onChange={(event) => setFilterCode(event.target.value)}
              placeholder="Buscar código..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#00338C] focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Curso
            <select
              value={filterCourse}
              onChange={(event) => setFilterCourse(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition focus:border-[#00338C] focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Todos</option>
              {courseNames.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col justify-end gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Grau
              <select
                value={filterDegree}
                onChange={(event) => setFilterDegree(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition focus:border-[#00338C] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Todos</option>
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-950 active:scale-[0.98]"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-10px_rgba(0,34,85,0.08)] md:p-6">
        <div className="mb-4 flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#00338C]">Histórico por curso</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Cada círculo representa o conceito publicado para aquele curso no ano correspondente.
            </p>
          </div>
          {lastUpdated && !loading && (
            <p className="text-[11px] font-semibold text-slate-400">
              Atualizado em {lastUpdated.toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-semibold text-slate-500">
            <RefreshCw className="h-5 w-5 animate-spin text-[#00338C]" /> Carregando dados da planilha...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8 text-center text-sm font-semibold text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void loadData(true)}
              className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-red-800 active:scale-[0.98]"
            >
              Tentar novamente
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-8 text-center text-sm font-semibold text-slate-500">
            Nenhum dado de evolução foi retornado pela planilha.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  <th className="w-[15%] px-3 py-3">Unidade</th>
                  <th className="w-[8%] px-3 py-3 text-center">Cód.</th>
                  <th className="w-[19%] px-3 py-3">Curso</th>
                  <th className="w-[8%] px-3 py-3 text-center">Grau</th>
                  {years.map((year) => (
                    <th key={year} className="min-w-14 border-l border-slate-200 px-2 py-3 text-center" title={`ENADE ${year}`}>
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-4 py-10 text-center text-sm font-semibold text-slate-400">
                      Nenhum registro encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr
                      key={`${course.codigo}-${course.unidade}`}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} transition-colors hover:bg-blue-50`}
                    >
                      <td className="px-3 py-2.5 font-bold leading-tight text-slate-800">{course.unidade || '—'}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-slate-500">{course.codigo || '—'}</td>
                      <td className="px-3 py-2.5 font-bold leading-tight text-slate-800">{course.curso || '—'}</td>
                      <td className="px-3 py-2.5 text-center text-[10px] font-semibold text-slate-500" title={course.grau}>
                        {course.grau || '—'}
                      </td>
                      {years.map((year) => (
                        <td key={year} className="border-l border-slate-50 px-2 py-2 text-center">
                          <NoteBadge note={course.notas[year]} />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
