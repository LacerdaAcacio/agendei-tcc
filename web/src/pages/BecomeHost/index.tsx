import { Check, Shield, DollarSign, Calendar, ArrowRight, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditProfileDialog } from '@/features/profile/components/EditProfileDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBecomeHost } from './useBecomeHost';

export function BecomeHostPage() {
  const {
    t,
    user,
    isLoading,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isSuccessDialogOpen,
    handleUpgrade,
    handleSuccessClose,
    maskedCpf,
  } = useBecomeHost();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {t('becomeHost.title', 'Torne-se um Anfitrião de Serviços')}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            {t(
              'becomeHost.subtitle',
              'Junte-se a milhares de profissionais que estão transformando suas habilidades em renda extra.',
            )}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
              <DollarSign className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>{t('becomeHost.benefits.income.title', 'Renda Extra')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                {t(
                  'becomeHost.benefits.income.description',
                  'Defina seus próprios preços e receba pagamentos diretamente em sua conta.',
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
              <Calendar className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>
                {t('becomeHost.benefits.flexibility.title', 'Flexibilidade Total')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                {t(
                  'becomeHost.benefits.flexibility.description',
                  'Gerencie sua agenda e trabalhe quando e onde quiser.',
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
              <Shield className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>
                {t('becomeHost.benefits.security.title', 'Segurança Garantida')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                {t(
                  'becomeHost.benefits.security.description',
                  'Todos os clientes são verificados e você conta com nosso suporte 24/7.',
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Section */}
        <Card className="mx-auto max-w-2xl border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle>{t('becomeHost.confirm.title', 'Confirme seus dados')}</CardTitle>
            <CardDescription>
              {t(
                'becomeHost.confirm.description',
                'Verificamos as informações da sua conta atual. Mantenha seus dados sempre atualizados.',
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name Field */}
            <div className="group flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('becomeHost.confirm.nameLabel', 'Nome Completo')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditProfileOpen(true)}>
                <Pencil className="h-4 w-4 text-gray-400 transition-colors group-hover:text-primary" />
              </Button>
            </div>

            {/* Email Field */}
            <div className="group flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('becomeHost.confirm.emailLabel', 'Email')}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditProfileOpen(true)}>
                <Pencil className="h-4 w-4 text-gray-400 transition-colors group-hover:text-primary" />
              </Button>
            </div>

            {/* CPF Field (Mocked) */}
            <div className="group flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CPF</p>
                <p className="font-semibold text-gray-900 dark:text-white">{maskedCpf}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsEditProfileOpen(true)}>
                <Pencil className="h-4 w-4 text-gray-400 transition-colors group-hover:text-primary" />
              </Button>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="pt-6">
            <Button
              size="lg"
              className="h-12 w-full text-lg"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('common.processing', 'Processando...')}
                </>
              ) : (
                <>
                  {t('becomeHost.action', 'Ativar conta de Prestador')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <EditProfileDialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />

      <Dialog open={isSuccessDialogOpen} onOpenChange={handleSuccessClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-6 w-6" />
              Solicitação Enviada!
            </DialogTitle>
            <DialogDescription className="pt-2">
              Seus dados foram enviados para análise. Você receberá um e-mail com o status da sua
              solicitação em breve.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose} className="w-full">
              Entendido, ir para meus serviços
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
