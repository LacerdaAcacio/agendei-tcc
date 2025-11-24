import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { DAYS } from './constants';
import { useAvailabilityScheduler } from './useAvailabilityScheduler';
import type { AvailabilitySchedulerProps } from './types';

export function AvailabilityScheduler({ value, onChange }: AvailabilitySchedulerProps) {
  const { handleDayChange, copyToAll } = useAvailabilityScheduler(value, onChange);

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Disponibilidade Semanal</h3>
        <span className="text-xs text-gray-500">Defina seus horários de atendimento</span>
      </div>

      <div className="space-y-4">
        {DAYS.map(({ key, label }) => {
          const schedule = value[key] || { active: false, start: '09:00', end: '18:00' };
          
          return (
            <div key={key} className="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 transition-colors">
              <div className="w-24 flex items-center gap-2">
                <Switch
                  checked={schedule.active}
                  onCheckedChange={(checked: boolean) => handleDayChange(key, 'active', checked)}
                  id={`switch-${key}`}
                />
                <Label htmlFor={`switch-${key}`} className="cursor-pointer font-medium">
                  {label}
                </Label>
              </div>

              {schedule.active ? (
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => handleDayChange(key, 'start', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => handleDayChange(key, 'end', e.target.value)}
                      className="w-24"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToAll(key)}
                    title="Copiar para todos os dias"
                    className="text-gray-400 hover:text-primary"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 text-sm text-gray-400 italic">
                  Indisponível
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { DaySchedule, Availability } from './types';
