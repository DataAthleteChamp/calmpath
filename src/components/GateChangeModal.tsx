import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, ShieldCheck } from 'lucide-react';

const GateChangeModal = () => {
  const { setShowGateChangeModal } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="mx-6 w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
        <div className="flex justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">Gate changed</h2>

        <div className="flex items-center justify-center gap-3 my-5">
          <div className="rounded-xl bg-muted px-4 py-2">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-muted-foreground line-through">A12</p>
          </div>
          <span className="text-xl text-primary">→</span>
          <div className="rounded-xl bg-primary/10 px-4 py-2 ring-2 ring-primary/20">
            <p className="text-xs text-primary">To</p>
            <p className="text-lg font-bold text-primary">A18</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-2 text-sm">I updated your route</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>This adds about 4 minutes</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Passport control still required</span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full rounded-2xl py-7 text-base font-semibold"
          onClick={() => setShowGateChangeModal(false)}
        >
          Continue calmly
        </Button>
      </div>
    </div>
  );
};

export default GateChangeModal;
