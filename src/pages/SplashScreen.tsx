import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';

const DEMO_URL = 'https://calmpath.vercel.app';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-primary/5 via-background to-secondary px-6">
      <div className="flex flex-col items-center gap-6 text-center animate-fade-in-up">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 shadow-lg shadow-primary/10">
            <Plane className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs">✈️</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">CalmPath</h1>
          <p className="text-sm font-medium text-primary">Copenhagen Airport · Terminal 3</p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Inclusive Navigation for Copenhagen Airport
          </p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
          <Button
            size="lg"
            className="w-full rounded-2xl py-7 text-lg font-semibold shadow-md shadow-primary/20"
            onClick={() => navigate('/setup')}>
            Get Started
          </Button>
        </div>


        <p className="text-xs text-muted-foreground pt-1">✈️ CPH Kastrup</p>
      </div>
    </div>
  );
};

export default SplashScreen;
