import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { AvailabilityScheduler } from '@/components/service/AvailabilityScheduler';
import { DURATION_OPTIONS } from './constants';
import type { AvailabilitySectionProps } from './types';

export function AvailabilitySection({ setValue, watch }: AvailabilitySectionProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border dark:border-slate-800">
      <CardHeader>
        <CardTitle>Disponibilidade</CardTitle>
        <CardDescription>Defina os dias e horários que você atende</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Duração Média</Label>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <Select 
              onValueChange={(val) => setValue('duration', parseInt(val))} 
              defaultValue="60"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <AvailabilityScheduler 
          value={watch('availability') ? JSON.parse(watch('availability') as string) : {}}
          onChange={(schedule) => setValue('availability', JSON.stringify(schedule))} 
        />
      </CardContent>
    </Card>
  );
}
