import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { CATEGORIES } from '../../constants';
import type { BasicInfoSectionProps } from './types';

export function BasicInfoSection({ register, setValue, watch, errors }: BasicInfoSectionProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Detalhes principais do seu serviço</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Serviço</Label>
          <Input 
            id="title" 
            {...register('title')} 
            placeholder="Ex: Tour Histórico pelo Centro" 
            className="bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white" 
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            placeholder="Descreva detalhadamente o que está incluído..." 
            className="min-h-[150px] bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Select onValueChange={(value) => setValue('categoryId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <CurrencyInput 
              value={watch('price') || 0}
              onChange={(value) => setValue('price', value)}
              placeholder="0,00"
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
