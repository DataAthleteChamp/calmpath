import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

const SupportCardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-primary text-primary-foreground p-6 print:p-10 print:bg-white print:text-black" id="support-card">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-white/10 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-white/10 rounded-full gap-1.5"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 px-4">
        <p className="text-xs font-medium uppercase tracking-widest opacity-60 print:text-gray-500">
          Please show this to any airport staff member
        </p>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              I may need a little extra help
            </h1>
            <p className="text-lg opacity-70 mt-1 italic">
              Jeg har brug for lidt ekstra hjaelp
            </p>
          </div>

          <div className="w-16 h-0.5 bg-white/30 mx-auto print:bg-gray-300" />

          <div>
            <p className="text-xl leading-relaxed opacity-90">
              Please give me simple,<br />
              step-by-step instructions.
            </p>
            <p className="text-base opacity-60 mt-1 italic">
              Giv mig venligst enkle trin-for-trin instruktioner.
            </p>
          </div>

          <div>
            <p className="text-xl leading-relaxed opacity-90">
              I may need extra time.
            </p>
            <p className="text-base opacity-60 mt-1 italic">
              Jeg har muligvis brug for ekstra tid.
            </p>
          </div>

          <div>
            <p className="text-xl leading-relaxed opacity-90">
              Too much information at once<br />
              can be difficult for me.
            </p>
            <p className="text-base opacity-60 mt-1 italic">
              For meget information pa en gang kan vaere svaert for mig.
            </p>
          </div>
        </div>

        <div className="w-16 h-0.5 bg-white/30 mx-auto print:bg-gray-300" />

        <p className="text-sm opacity-60 print:text-gray-500">
          Copenhagen Airport · Accessibility Support
        </p>
      </div>
    </div>
  );
};

export default SupportCardPage;
