'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/sinaes/header';
import { TabNavigation } from '@/components/sinaes/tab-navigation';
import { TopCards } from '@/components/sinaes/top-cards';
import { EnadePieChart } from '@/components/sinaes/enade-pie-chart';
import { CampusCharts } from '@/components/sinaes/campus-charts';
import { StateComparison } from '@/components/sinaes/state-comparison';
import { CourseTable } from '@/components/sinaes/course-table';
import { ForecastTab } from '@/components/sinaes/forecast-tab';
import { CourseModal } from '@/components/sinaes/course-modal';
import { SectionModal } from '@/components/sinaes/section-modal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'results' | 'forecast'>('results');
  const [courseModalCodigo, setCourseModalCodigo] = useState<string | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionModalConfig, setSectionModalConfig] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    isDark: false,
    content: null as React.ReactNode,
  });

  const handleCourseClick = useCallback((codigo: string) => {
    setCourseModalCodigo(codigo);
    setCourseModalOpen(true);
  }, []);

  const openSectionModal = useCallback(
    (title: string, subtitle: string, badgeText: string, isDark: boolean, content: React.ReactNode) => {
      setSectionModalConfig({ title, subtitle, badgeText, isDark, content });
      setSectionModalOpen(true);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Background texture */}
      <div className="fixed-bg-texture" />

      <div id="main-wrapper" className="min-h-full w-full transition-all duration-500 flex-1">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="animate-fade-in space-y-10">
              <TopCards />
              <EnadePieChart />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CampusCharts
                  onExpand={() =>
                    openSectionModal(
                      'Qualidade por Unidade Universitária',
                      'Média Institucional (1 a 5)',
                      'CAMPUS',
                      true,
                      <CampusCharts />
                    )
                  }
                />
                <StateComparison
                  onExpand={() =>
                    openSectionModal(
                      'Comparativo Estadual',
                      'IES Públicas de MS',
                      'COMPARATIVO',
                      false,
                      <StateComparison />
                    )
                  }
                />
              </div>

              <CourseTable onCourseClick={handleCourseClick} />
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && <ForecastTab />}
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mt-10 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00338C] flex items-center justify-center text-white font-black text-sm">
                U
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Portal de Indicadores de Ensino — SINAES / UEMS
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Dados oficiais INEP/MEC • Última atualização: 2025
            </p>
          </div>
        </footer>
      </div>

      {/* Course Modal */}
      <CourseModal
        codigo={courseModalCodigo}
        open={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
      />

      {/* Section Modal */}
      <SectionModal
        open={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        title={sectionModalConfig.title}
        subtitle={sectionModalConfig.subtitle}
        badgeText={sectionModalConfig.badgeText}
        isDarkThemeSource={sectionModalConfig.isDark}
      >
        {sectionModalConfig.content}
      </SectionModal>
    </div>
  );
}
