import { Star, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ServiceCardProps } from './types';
import { useServiceCard } from './useServiceCard';

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation();
  const { isFavorited, handleFavoriteClick } = useServiceCard(service);

  return (
    <Link
      to={`/services/${service.id}`}
      className="group block cursor-pointer rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800">
        <img
          src={
            service.images?.[0] ||
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'
          }
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={handleFavoriteClick}
            className="rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-300',
              )}
            />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-bold leading-tight text-indigo-950 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {service.title}
          </h3>
          <div className="flex shrink-0 items-center gap-1 rounded bg-gray-50 px-1.5 py-0.5 text-xs font-medium dark:bg-slate-800">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="dark:text-slate-200">{(service.rating || 5.0).toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{service.location}</span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-gray-50 pt-2 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              A partir de
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  service.price,
                )}
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                /{t(`price_unit.${service.priceUnit || 'PER_PERSON'}`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
