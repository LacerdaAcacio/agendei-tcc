import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Video } from 'lucide-react';
import { AddressForm } from '@/features/service/components/AddressForm';
import type { ServiceTypeSectionProps } from './types';

export function ServiceTypeSection({
  register,
  setValue,
  watch,
  errors,
  serviceType,
}: ServiceTypeSectionProps) {
  return (
    <Card className="border bg-white dark:border-slate-800 dark:bg-slate-900">
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
            <div className="flex w-full cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <RadioGroupItem value="PRESENTIAL" id="presential" />
              <Label htmlFor="presential" className="flex cursor-pointer items-center gap-2">
                <MapPin className="h-4 w-4" /> Presencial
              </Label>
            </div>
            <div className="flex w-full cursor-pointer items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">
              <RadioGroupItem value="DIGITAL" id="digital" />
              <Label htmlFor="digital" className="flex cursor-pointer items-center gap-2">
                <Video className="h-4 w-4" /> Digital / Online
              </Label>
            </div>
          </RadioGroup>
        </div>

        {serviceType === 'PRESENTIAL' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <AddressForm register={register} setValue={setValue} watch={watch} errors={errors} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
