import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const FallbackGuidePage = () => {
  const navigate = useNavigate();
  const { gateChanged } = useApp();

  return (
    <div className="min-h-[100dvh] bg-background px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Fallback Guide</h1>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl gap-2">
          <Printer className="h-3.5 w-3.5" /> Print
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        A printable backup in case your phone runs out of battery or you need a paper guide.
      </p>

      {/* Page 1: Map */}
      <div className="rounded-2xl border bg-card p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Page 1 — Airport Map</h3>
          <span className="text-xs text-muted-foreground">CPH Copenhagen</span>
        </div>
        <div className="rounded-xl bg-muted/50 p-6 flex flex-col items-center justify-center h-48">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span>← Pier A</span>
              <span>Pier B ↑</span>
              <span>Pier C →</span>
            </div>
            <div className="w-48 h-12 rounded-lg bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-medium">Main Terminal</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs">🚪</span>
              <span className="text-xs text-muted-foreground">Entrance</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-success inline-block" /> Calm route</span>
          <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-warning inline-block" /> Busy area</span>
          <span>🤫 Quiet zone</span>
        </div>
      </div>

      {/* Page 2: Steps */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h3 className="font-semibold text-foreground text-sm mb-4">Page 2 — Step-by-Step Guide</h3>

        <ol className="space-y-3 text-sm">
          {[
            { step: 'Enter Terminal 3', note: 'Main entrance, ground floor' },
            { step: 'Go to Check-in Counter B', note: 'Follow signs to the left' },
            { step: 'Visit Bathroom', note: 'Near Pier A entrance' },
            { step: 'Pass through Security', note: 'Have boarding pass ready' },
            { step: 'Get a snack at Café', note: 'Right after security, on the left' },
            { step: `Go to ${gateChanged ? 'Gate A18' : 'Gate A12'}`, note: 'Walk along Pier A' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-foreground">{item.step}</p>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 pt-4 border-t space-y-2 text-xs text-muted-foreground">
          <p>🤫 <strong>Quiet area:</strong> Pier A, near Gate A15</p>
          <p>ℹ️ <strong>Help desk:</strong> Main Terminal, center</p>
          <p>🔌 <strong>Charging:</strong> Pier A, near Gate A12</p>
          <p>✈️ <strong>Gate:</strong> {gateChanged ? 'A18 (changed from A12)' : 'A12'}</p>
        </div>
      </div>
    </div>
  );
};

export default FallbackGuidePage;
