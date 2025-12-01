import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ReportModalProps } from './types';
import { useReportModal } from './useReportModal';

export function ReportModal({ isOpen, onClose, serviceId }: ReportModalProps) {
  const { reason, setReason, isSubmitting, handleSubmit } = useReportModal(serviceId, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar Serviço</DialogTitle>
          <DialogDescription>
            Conte-nos o motivo da denúncia. Sua identidade será mantida em sigilo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            placeholder="Descreva o motivo (mínimo 10 caracteres)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
            minLength={10}
          />
          <div className="flex justify-end text-xs text-gray-500">
            {reason.length}/10 caracteres
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={reason.length < 10 || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
