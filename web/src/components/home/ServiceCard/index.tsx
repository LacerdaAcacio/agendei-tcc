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
    <Link to={`/services/${service.id}`} className="block group cursor-pointer bg-white dark:bg-slate-900 rounded-xl p-3 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800 mb-3">
        <img 
          src={service.images?.[0] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'} 
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-colors", 
                isFavorited ? "fill-rose-500 text-rose-500" : "text-gray-600 dark:text-gray-300"
              )} 
            />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-indigo-950 dark:text-slate-100 truncate text-base leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-medium shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="dark:text-slate-200">{(service.rating || 5.0).toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400 text-xs">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{service.location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold tracking-wider">A partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
              </span>
              <span className="text-gray-400 dark:text-slate-500 text-xs">/{t(`price_unit.${service.priceUnit || 'PER_PERSON'}`)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
