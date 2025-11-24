import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

interface ReviewModalProps {
  bookingId: string;
  serviceTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewModal({ bookingId, serviceTitle, open, onOpenChange }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - in real app would be POST /reviews
      // await api.post('/reviews', { bookingId, rating, comment });
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Avaliação enviada com sucesso! Obrigado pelo feedback.');
      onOpenChange(false);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar Serviço</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com "{serviceTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <Label>Sua Nota</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500 h-5">
              {hoverRating > 0 ? (
                ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][hoverRating - 1]
              ) : rating > 0 ? (
                ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'][rating - 1]
              ) : ''}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (Opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Conte mais sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
