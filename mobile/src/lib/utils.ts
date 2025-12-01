import {
    Briefcase,
    Bus,
    Camera,
    Dumbbell,
    GraduationCap,
    Hammer,
    Heart,
    Home,
    Palette,
    Plane,
    Scissors,
    Sparkles,
    Trophy,
    Wrench,
    type LucideIcon
} from 'lucide-react-native';

const categoryIconMap: Record<string, LucideIcon> = {
  faxina: Sparkles,
  'obras-reparos': Hammer,
  manutencao: Wrench,
  beleza: Scissors,
  arte: Palette,
  fitness: Dumbbell,
  'saude-bem-estar': Heart,
  aulas: GraduationCap,
  educacao: GraduationCap,
  fotografia: Camera,
  eventos: Camera, // User requested Camera for eventos
  transporte: Bus,
  turismo: Plane,
  'esportes-lazer': Trophy,
  consultoria: Briefcase,
  default: Home,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIconMap[slug.toLowerCase()] || categoryIconMap.default;
}

export function translatePriceUnit(priceUnit?: string): string {
  const translations: Record<string, string> = {
    HOURLY: 'por hora',
    DAILY: 'por dia',
    PER_PERSON: 'por pessoa',
    FIXED: 'valor fixo',
    PER_METRIC: 'por unidade',
  };

  return priceUnit ? translations[priceUnit] || '' : '';
}

export function formatPrice(price: number, priceUnit?: string): string {
  const formatted = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const unit = translatePriceUnit(priceUnit);
  return unit ? `${formatted} ${unit}` : formatted;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "dd/MM HH:mm", { locale: ptBR });
}

export function getStatusColor(status: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: '#fef3c7', text: '#92400e' }, // yellow
    CONFIRMED: { bg: '#d1fae5', text: '#065f46' }, // green
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' }, // red
    COMPLETED: { bg: '#dbeafe', text: '#1e40af' }, // blue
  };

  return colors[status] || { bg: '#f3f4f6', text: '#374151' };
}

export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Concluído',
  };

  return translations[status] || status;
}
export function formatDocument(value: string): string {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    // CPF: 999.999.999-99
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  } else {
    // CNPJ: 99.999.999/0001-99
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
}
