import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Globe, Calendar, Star } from 'lucide-react';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatarUrl?: string;
    createdAt?: string;
    languages?: string[];
    isVerified?: boolean;
    role?: string;
  } | null;
}

export function PublicProfileModal({ isOpen, onClose, user }: PublicProfileModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Perfil do Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white" title="Verificado">
                <Star className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex gap-2 justify-center">
              {user.role === 'PROVIDER' && (
                <Badge variant="default" className="bg-primary">Prestador</Badge>
              )}
              <Badge variant="secondary">Membro</Badge>
            </div>
          </div>

          <div className="w-full space-y-4 px-4">
            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase text-gray-400">Membro desde</span>
                <span className="text-sm font-medium">
                  {user.createdAt 
                    ? new Date(user.createdAt).getFullYear() 
                    : new Date().getFullYear()}
                </span>
              </div>
            </div>

            {user.languages && user.languages.length > 0 && (
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-gray-400">Idiomas</span>
                  <span className="text-sm font-medium">{user.languages.join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
