import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Video } from 'lucide-react';
import { AddressForm } from '@/features/service/components/AddressForm';
import type { ServiceTypeSectionProps } from './types';

export function ServiceTypeSection({ register, setValue, watch, errors, serviceType }: ServiceTypeSectionProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
      <CardHeader>
        <CardTitle>Localização e Tipo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Tipo de Serviço</Label>
          <RadioGroup 
            defaultValue="PRESENTIAL" 
            onValueChange={(val) => setValue('type', val as 'PRESENTIAL' | 'DIGITAL')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700 w-full">
              <RadioGroupItem value="PRESENTIAL" id="presential" />
              <Label htmlFor="presential" className="cursor-pointer flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Presencial
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-700 w-full">
              <RadioGroupItem value="DIGITAL" id="digital" />
              <Label htmlFor="digital" className="cursor-pointer flex items-center gap-2">
                <Video className="w-4 h-4" /> Digital / Online
              </Label>
            </div>
          </RadioGroup>
        </div>

        {serviceType === 'PRESENTIAL' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <AddressForm 
              register={register} 
              setValue={setValue} 
              watch={watch} 
              errors={errors} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
