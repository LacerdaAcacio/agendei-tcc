import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ServiceCard as GlobalServiceCard } from '@/components/home/ServiceCard';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types';

interface MyServiceCardProps {
  service: Service;
  onDelete: (id: string) => void;
}

export function MyServiceCard({ service, onDelete }: MyServiceCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="group relative">
      <GlobalServiceCard service={service} />

      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          className="w-full gap-2 border-gray-300 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => navigate(`/services/${service.id}/edit`)}
        >
          <Pencil className="h-4 w-4" /> {t('my_services.edit')}
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-gray-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/20"
          onClick={() => onDelete(service.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
