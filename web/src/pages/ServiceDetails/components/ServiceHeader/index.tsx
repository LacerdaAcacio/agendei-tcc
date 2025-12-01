import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Star, MapPin, Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ServiceHeaderProps } from '../../types';

export function ServiceHeader({
  service,
  isFavorited,
  onToggleFavorite,
  onShare,
  scrollToSection,
}: ServiceHeaderProps) {
  return (
    <div className="mb-6">
      <Typography variant="h1" className="mb-2">
        {service.title}
      </Typography>
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 font-medium text-black dark:text-white">
            <Star className="h-4 w-4 fill-black dark:fill-white" />
            <span>{service.rating?.toFixed(1) || 'New'}</span>
            <span className="mx-1">·</span>
            <button
              onClick={() => scrollToSection('reviews-section')}
              className="cursor-pointer underline hover:text-black dark:hover:text-white"
            >
              {service.reviewCount || 0} comentários
            </button>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <button
              onClick={() => scrollToSection('location-section')}
              className="cursor-pointer underline hover:text-black dark:hover:text-white"
            >
              {service.location}
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onShare}>
            <Share2 className="h-4 w-4" /> Compartilhar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-2', isFavorited && 'text-rose-500 hover:text-rose-600')}
            onClick={onToggleFavorite}
          >
            <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
            {isFavorited ? 'Salvo' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
