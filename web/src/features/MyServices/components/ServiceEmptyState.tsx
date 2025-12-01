import { Link } from 'react-router-dom';
import { PackageOpen, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export function ServiceEmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 rounded-full bg-gray-50 p-4">
        <PackageOpen className="h-12 w-12 text-gray-400" />
      </div>
      <Typography variant="h3" className="mb-2">
        {t('my_services.empty_title')}
      </Typography>
      <Typography variant="muted" className="mb-6 max-w-md">
        {t('my_services.empty_description')}
      </Typography>
      <Link to="/services/new">
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('my_services.empty_action')}
        </Button>
      </Link>
    </div>
  );
}
