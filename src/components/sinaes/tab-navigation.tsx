'use client';

interface TabNavigationProps {
  activeTab: 'results' | 'enade2025' | 'forecast';
  onTabChange: (tab: 'results' | 'enade2025' | 'forecast') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex gap-8 border-b border-gray-200 overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''} pb-3 text-base md:text-lg text-slate-950 hover:text-[#00338C] uppercase tracking-wider font-semibold`}
          onClick={() => onTabChange('results')}
        >
          Resultados Oficiais (2021-2023)
        </button>
        <button
          className={`tab-btn ${activeTab === 'enade2025' ? 'active' : ''} pb-3 text-base md:text-lg text-slate-950 hover:text-[#00338C] uppercase tracking-wider font-semibold`}
          onClick={() => onTabChange('enade2025')}
        >
          ENADE 2025
        </button>
        <button
          className={`tab-btn ${activeTab === 'forecast' ? 'active' : ''} pb-3 text-base md:text-lg text-slate-950 hover:text-[#00338C] uppercase tracking-wider font-semibold`}
          onClick={() => onTabChange('forecast')}
        >
          Previsão ENADE (2026-2028)
        </button>
      </div>
    </div>
  );
}
