import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2, AlertTriangle } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial')
    .optional()
    .or(z.literal('')),
  confirmNewPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.newPassword && !!data.newPassword.length) {
    return !!data.currentPassword;
  }
  return true;
}, {
  message: "Senha atual é obrigatória para alterar a senha",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword && !!data.newPassword.length) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmNewPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
      };

      if (data.newPassword) {
        payload.password = data.newPassword;
        payload.currentPassword = data.currentPassword;
      }

      // Mock file upload - in real app, upload to S3/Cloudinary here
      if (avatarFile) {
        // Simulating upload and getting a URL back
        // For now we just use the preview URL or a fake one if we were persisting to backend
        // In a real scenario, we'd await uploadFile(avatarFile)
        payload.profileImage = avatarPreview; 
      }

      // Remove undefined keys
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const response = await api.put(`/users/${user?.id}`, payload);
      
      if (response.data?.data?.user) {
        updateUser(response.data.data.user);
      } else {
        updateUser({
          ...user!,
          name: data.name,
          email: data.email,
          avatarUrl: payload.profileImage || user?.avatarUrl,
        });
      }

      toast.success('Perfil atualizado com sucesso!');
      onOpenChange(false);
      reset();
      setAvatarFile(null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 409) {
        toast.error('Email já está em uso');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Senha atual incorreta');
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações em seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-3xl">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
            <Label className="text-sm text-gray-500">Clique na foto para alterar</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <Accordion type="single" collapsible className="w-full border rounded-lg px-4">
            <AccordionItem value="password-change" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  Alterar Senha
                  {errors.newPassword && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual <span className="text-red-500">*</span></Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    placeholder="Necessário para confirmar a troca"
                    {...register('currentPassword')} 
                  />
                  {errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    {...register('newPassword')} 
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
                  
                  {/* Password Strength Visual Hints */}
                  {newPasswordValue && newPasswordValue.length > 0 && (
                    <div className="text-[10px] space-y-1 text-gray-500 mt-1">
                      <p className={newPasswordValue.length >= 8 ? "text-green-600" : ""}>• Mínimo 8 caracteres</p>
                      <p className={/[A-Z]/.test(newPasswordValue) ? "text-green-600" : ""}>• Letra maiúscula</p>
                      <p className={/[a-z]/.test(newPasswordValue) ? "text-green-600" : ""}>• Letra minúscula</p>
                      <p className={/[0-9]/.test(newPasswordValue) ? "text-green-600" : ""}>• Número</p>
                      <p className={/[^A-Za-z0-9]/.test(newPasswordValue) ? "text-green-600" : ""}>• Caractere especial</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmNewPassword" 
                    type="password" 
                    {...register('confirmNewPassword')} 
                  />
                  {errors.confirmNewPassword && <p className="text-red-500 text-xs">{errors.confirmNewPassword.message}</p>}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
