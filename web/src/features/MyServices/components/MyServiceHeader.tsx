import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export function MyServiceHeader() {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <Typography variant="h1">{t('my_services.title')}</Typography>
        <Typography variant="muted" className="mt-1">
          {t('my_services.subtitle')}
        </Typography>
      </div>

      <Link to="/services/new">
        <Button className="gap-2 border-transparent bg-indigo-600 text-white hover:bg-indigo-700 dark:text-white">
          <Plus className="h-4 w-4" />
          {t('my_services.new_button')}
        </Button>
      </Link>
    </div>
  );
}
