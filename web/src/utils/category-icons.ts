import {
  Sparkles,
  Hammer,
  Heart,
  GraduationCap,
  Bus,
  Plane,
  Trophy,
  Camera,
  LayoutGrid,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const getCategoryIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    hammer: Hammer,
    heart: Heart,
    'graduation-cap': GraduationCap,
    bus: Bus,
    plane: Plane,
    trophy: Trophy,
    camera: Camera,
    // Map slugs as well just in case
    faxina: Sparkles,
    'obras-reparos': Hammer,
    'saude-bem-estar': Heart,
    aulas: GraduationCap,
    transporte: Bus,
    turismo: Plane,
    'esportes-lazer': Trophy,
    eventos: Camera,
  };

  return icons[iconName?.toLowerCase()] || LayoutGrid;
};
