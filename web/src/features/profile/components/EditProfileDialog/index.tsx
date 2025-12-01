import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
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

const profileSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Deve conter pelo menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial')
      .optional()
      .or(z.literal('')),
    confirmNewPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.newPassword && !!data.newPassword.length) {
        return !!data.currentPassword;
      }
      return true;
    },
    {
      message: 'Senha atual é obrigatória para alterar a senha',
      path: ['currentPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !!data.newPassword.length) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmNewPassword'],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

interface UpdateProfilePayload {
  name: string;
  email: string;
  password?: string;
  currentPassword?: string;
  profileImage?: string | null;
  [key: string]: string | undefined | null; // Allow dynamic keys for now if needed, or stick to strict
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
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
      const payload: UpdateProfilePayload = {
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
      Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

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
    } catch (error) {
      console.error('Error updating profile:', error);
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error('Email já está em uso');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Senha atual incorreta');
        } else {
          toast.error('Erro ao atualizar perfil. Tente novamente.');
        }
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações em seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="group relative cursor-pointer">
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-400">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
            </div>
            <Label className="text-sm text-gray-500">Clique na foto para alterar</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
            <AccordionItem value="password-change" className="border-none">
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-2 text-sm font-medium">
                  Alterar Senha
                  {errors.newPassword && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4 pt-2">
                {/* Fake inputs to prevent autocomplete */}
                <input type="text" style={{ display: 'none' }} />
                <input type="password" style={{ display: 'none' }} />

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    Senha Atual <span className="text-red-500">*</span>
                  </Label>
                  <PasswordInput
                    id="currentPassword"
                    placeholder="Necessário para confirmar a troca"
                    {...register('currentPassword')}
                    autoComplete="new-password"
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <PasswordInput
                    id="newPassword"
                    {...register('newPassword')}
                    autoComplete="new-password"
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                  )}

                  {/* Password Strength Visual Hints */}
                  {newPasswordValue && newPasswordValue.length > 0 && (
                    <div className="mt-1 space-y-1 text-[10px] text-gray-500">
                      <p className={newPasswordValue.length >= 8 ? 'text-green-600' : ''}>
                        • Mínimo 8 caracteres
                      </p>
                      <p className={/[A-Z]/.test(newPasswordValue) ? 'text-green-600' : ''}>
                        • Letra maiúscula
                      </p>
                      <p className={/[a-z]/.test(newPasswordValue) ? 'text-green-600' : ''}>
                        • Letra minúscula
                      </p>
                      <p className={/[0-9]/.test(newPasswordValue) ? 'text-green-600' : ''}>
                        • Número
                      </p>
                      <p className={/[^A-Za-z0-9]/.test(newPasswordValue) ? 'text-green-600' : ''}>
                        • Caractere especial
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <PasswordInput
                    id="confirmNewPassword"
                    {...register('confirmNewPassword')}
                    autoComplete="new-password"
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-xs text-red-500">{errors.confirmNewPassword.message}</p>
                  )}
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
