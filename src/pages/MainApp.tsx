import { useApp } from '@/context/AppContext';
import { Home, Plane, Map, Settings } from 'lucide-react';
import RelaxTab from '@/pages/RelaxTab';
import TripsTab from '@/pages/TripsTab';
import MapTab from '@/pages/MapTab';
import SettingsTab from '@/pages/SettingsTab';
import StressModal from '@/components/StressModal';
import GateChangeModal from '@/components/GateChangeModal';
import { t } from '@/lib/i18n';

const TABS = [
  { id: 'relax', labelKey: 'tab.relax' as const, icon: Home },
  { id: 'trips', labelKey: 'tab.trips' as const, icon: Plane },
  { id: 'map', labelKey: 'tab.map' as const, icon: Map },
  { id: 'settings', labelKey: 'tab.settings' as const, icon: Settings },
];

function boardingColor(min: number) {
  if (min > 30) return 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400';
  if (min > 15) return 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400';
  return 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400';
}

const MainApp = () => {
  const { activeTab, setActiveTab, showStressModal, showGateChangeModal, flightInfo, boardingMinutes, language } = useApp();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Persistent flight header */}
      <div className={`flex items-center justify-between px-4 py-2 text-xs font-medium border-b ${boardingColor(boardingMinutes)}`}>
        <span>CPH Terminal {flightInfo.terminal} · {flightInfo.flightNumber}</span>
        <span>{t('header.boarding', language)} {boardingMinutes} {t('header.min', language)}</span>
      </div>

      <div className="flex-1 overflow-auto pb-24">
        {activeTab === 'relax' && <RelaxTab />}
        {activeTab === 'trips' && <TripsTab />}
        {activeTab === 'map' && <MapTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-lg safe-area-bottom z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-5 py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{t(tab.labelKey, language)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showStressModal && <StressModal />}
      {showGateChangeModal && <GateChangeModal />}
    </div>
  );
};

export default MainApp;
