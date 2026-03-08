import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SupportCardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-primary text-primary-foreground p-6">
      <Button
        variant="ghost"
        size="icon"
        className="self-start mb-6 text-primary-foreground hover:bg-white/10 rounded-full"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 px-4">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold leading-tight">
            I may need a little extra help
          </h1>

          <div className="w-16 h-0.5 bg-white/30 mx-auto" />

          <p className="text-xl leading-relaxed opacity-90">
            Please give me simple,<br />
            step-by-step instructions.
          </p>

          <p className="text-xl leading-relaxed opacity-90">
            I may need extra time.
          </p>

          <p className="text-xl leading-relaxed opacity-90">
            Too much information at once<br />
            can be difficult for me.
          </p>
        </div>

        <div className="w-16 h-0.5 bg-white/30 mx-auto" />

        <p className="text-sm opacity-60">
          CalmPath — Accessibility Support Card
        </p>
      </div>
    </div>
  );
};

export default SupportCardPage;
