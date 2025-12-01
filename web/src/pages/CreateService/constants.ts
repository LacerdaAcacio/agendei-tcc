import { z } from 'zod';

// Schema definition
export const createServiceSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  price: z.number().min(1, 'O preço deve ser maior que zero'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  type: z.enum(['PRESENTIAL', 'DIGITAL']),

  // Address fields (required for PRESENTIAL)
  addressZipCode: z.string().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  images: z.array(z.string()).min(1, 'Adicione pelo menos uma imagem'),
  duration: z.number().min(15, 'Duração mínima de 15 minutos'),
  availability: z.string().optional(), // JSON string
});

// Category options removed in favor of dynamic fetching

// Duration options
export const DURATION_OPTIONS = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora e 30 min' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' },
] as const;

// Maximum images allowed
export const MAX_IMAGES = 5;
