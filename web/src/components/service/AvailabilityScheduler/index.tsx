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
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-slate-200">Disponibilidade Semanal</h3>
        <span className="text-xs text-gray-500 dark:text-slate-400">
          Defina seus horários de atendimento
        </span>
      </div>

      <div className="space-y-4">
        {DAYS.map(({ key, label }) => {
          const schedule = value[key] || { active: false, start: '09:00', end: '18:00' };

          return (
            <div
              key={key}
              className="flex items-center gap-4 rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <div className="flex w-24 items-center gap-2">
                <Switch
                  checked={schedule.active}
                  onCheckedChange={(checked: boolean) => handleDayChange(key, 'active', checked)}
                  id={`switch-${key}`}
                />
                <Label
                  htmlFor={`switch-${key}`}
                  className="cursor-pointer font-medium dark:text-slate-200"
                >
                  {label}
                </Label>
              </div>

              {schedule.active ? (
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => handleDayChange(key, 'start', e.target.value)}
                      className="w-24 dark:border-slate-700 dark:bg-slate-950"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => handleDayChange(key, 'end', e.target.value)}
                      className="w-24 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToAll(key)}
                    title="Copiar para todos os dias"
                    className="text-gray-400 hover:text-primary dark:hover:text-indigo-400"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 text-sm italic text-gray-400 dark:text-slate-500">
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
