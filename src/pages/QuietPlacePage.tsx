import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { t } from '@/lib/i18n';

const PLACES = [
  {
    icon: '🙏',
    name: 'CPH Chapel',
    location: 'Landside, near check-in',
    distance: '4 min walk',
    description: 'Quiet interfaith space, open to all',
    color: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    icon: '🤫',
    name: 'Quiet Zone',
    location: 'Pier C, Gate C32 area',
    distance: '6 min walk',
    description: 'Low-noise seating, no announcements',
    color: 'bg-accent/10',
  },
  {
    icon: '🛋️',
    name: 'CPH Relax Lounge',
    location: 'Pier A, near Gate A15',
    distance: '2 min walk',
    description: 'Soft seating, dimmed lighting',
    color: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: 'ℹ️',
    name: 'Service Center',
    location: 'Main Terminal, center',
    distance: '3 min walk',
    description: 'Staff help, accessibility assistance',
    color: 'bg-primary/10',
  },
  {
    icon: '🔌',
    name: 'Charging Lounge',
    location: 'Pier A, near Gate A10',
    distance: '3 min walk',
    description: 'Free charging, quiet corner',
    color: 'bg-warning/10',
  },
];

const QuietPlacePage = () => {
  const navigate = useNavigate();
  const { language } = useApp();

  return (
    <div className="min-h-[100dvh] bg-background px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t('quiet.title', language)}</h1>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        {t('quiet.intro', language)}
      </p>

      <div className="space-y-3">
        {PLACES.map(place => (
          <Card key={place.name} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${place.color}`}>
                <span className="text-2xl">{place.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{place.name}</p>
                <p className="text-sm text-muted-foreground">{place.location}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{place.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-primary">{place.distance}</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-secondary/50 p-5 text-center">
        <p className="text-sm text-foreground font-medium mb-1">{t('quiet.helpNow', language)}</p>
        <p className="text-xs text-muted-foreground mb-3">{t('quiet.showStaff', language)}</p>
        <Button variant="outline" className="rounded-xl" onClick={() => navigate('/support-card')}>
          {t('quiet.showCard', language)}
        </Button>
      </div>
    </div>
  );
};

export default QuietPlacePage;
