import { useApp } from '@/context/AppContext';
import { Home, Plane, Map, Settings } from 'lucide-react';
import RelaxTab from '@/pages/RelaxTab';
import TripsTab from '@/pages/TripsTab';
import MapTab from '@/pages/MapTab';
import SettingsTab from '@/pages/SettingsTab';
import StressModal from '@/components/StressModal';
import GateChangeModal from '@/components/GateChangeModal';

const TABS = [
  { id: 'relax', label: 'Relax', icon: Home },
  { id: 'trips', label: 'Trips', icon: Plane },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const MainApp = () => {
  const { activeTab, setActiveTab, showStressModal, showGateChangeModal, showSupportCard } = useApp();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
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
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
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
