import { Sparkles, Hammer, Heart, GraduationCap, Bus, Plane, Trophy, Camera } from 'lucide-react';

export const CATEGORIES = [
  { id: 'faxina', slug: 'faxina', label: 'Faxina', icon: Sparkles, type: 'presential' },
  {
    id: 'obras-reparos',
    slug: 'obras-reparos',
    label: 'Reformas',
    icon: Hammer,
    type: 'presential',
  },
  {
    id: 'saude-bem-estar',
    slug: 'saude-bem-estar',
    label: 'Saúde',
    icon: Heart,
    type: 'presential',
  },
  { id: 'aulas', slug: 'aulas', label: 'Aulas', icon: GraduationCap, type: 'digital' },
  { id: 'aulas-p', slug: 'aulas', label: 'Aulas', icon: GraduationCap, type: 'presential' },
  { id: 'transporte', slug: 'transporte', label: 'Transporte', icon: Bus, type: 'presential' },
  { id: 'turismo', slug: 'turismo', label: 'Turismo', icon: Plane, type: 'presential' },
  {
    id: 'esportes-lazer',
    slug: 'esportes-lazer',
    label: 'Esportes',
    icon: Trophy,
    type: 'presential',
  },
  { id: 'eventos', slug: 'eventos', label: 'Eventos', icon: Camera, type: 'presential' },
  { id: 'favoritos', slug: 'favoritos', label: 'Favoritos', icon: Heart, type: 'presential' },
] as const;
