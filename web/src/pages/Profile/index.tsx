import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Briefcase,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { EditProfileDialog } from '@/features/profile/components/EditProfileDialog';
import { VerificationModal } from '@/features/profile/components/VerificationModal';
import { useProfile } from './useProfile';

export function ProfilePage() {
  const {
    user,
    handleLogout,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    navigate,
  } = useProfile();

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Identity Card */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="flex flex-col items-center space-y-4 pt-6 text-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatarUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-4xl text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.isVerified && (
                  <div
                    className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-green-500 p-1.5 text-white"
                    title="Verificado"
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge
                  className={
                    user.role === 'provider'
                      ? 'border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50'
                      : 'border-transparent bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                  }
                >
                  {user.role === 'provider' ? 'Prestador' : 'Cliente'}
                </Badge>

                {user.verificationStatus === 'APPROVED' || user.isVerified ? (
                  <Badge className="border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50">
                    Verificado
                  </Badge>
                ) : user.verificationStatus === 'PENDING' ? (
                  <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/50">
                    Em Análise
                  </Badge>
                ) : (
                  <Badge className="border-transparent bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800">
                    Não Verificado
                  </Badge>
                )}
              </div>

              {!user.isVerified && user.verificationStatus !== 'APPROVED' && (
                <div
                  className={`w-full space-y-2 rounded-lg border p-3 text-left ${
                    user.verificationStatus === 'PENDING'
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30'
                      : 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${
                      user.verificationStatus === 'PENDING'
                        ? 'text-blue-900 dark:text-blue-200'
                        : 'text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    {user.verificationStatus === 'PENDING' ? (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Verificação em Andamento
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        Verifique sua conta
                      </>
                    )}
                  </div>

                  <p
                    className={`text-xs ${
                      user.verificationStatus === 'PENDING'
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {user.verificationStatus === 'PENDING'
                      ? 'Seus documentos estão sendo analisados. Avisaremos assim que for concluído.'
                      : 'Aumente a confiança do seu perfil enviando um documento de identidade.'}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-full border-transparent ${
                      user.verificationStatus === 'PENDING'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
                        : 'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-500'
                    }`}
                    onClick={() => setIsVerificationModalOpen(true)}
                    disabled={user.verificationStatus === 'PENDING'}
                  >
                    {user.verificationStatus === 'PENDING'
                      ? 'Aguardando Aprovação'
                      : 'Verificar agora'}
                  </Button>
                </div>
              )}

              <div className="w-full space-y-2 pt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Editar Perfil
                </Button>
                <Button
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Control Center */}
        <div className="space-y-6 md:col-span-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Central de Controle
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* My Bookings Card */}
              <Card
                className="group cursor-pointer border-l-4 border-l-blue-500 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:border-l-blue-500 dark:bg-slate-900"
                onClick={() => navigate('/my-bookings')}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Agendamentos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold dark:text-white">Meus Agendamentos</div>
                    <ChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-blue-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                    Visualize e gerencie suas reservas
                  </p>
                </CardContent>
              </Card>

              {/* My Services Card (Provider Only) */}
              {user.role === 'provider' && (
                <Card
                  className="group cursor-pointer border-l-4 border-l-purple-500 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:border-l-purple-500 dark:bg-slate-900"
                  onClick={() => navigate('/my-services')}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      Serviços
                    </CardTitle>
                    <Briefcase className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold dark:text-white">Meus Serviços</div>
                      <ChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-purple-500" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      Gerencie seus anúncios e disponibilidade
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Settings Card */}
              <Card
                className="group cursor-pointer border-l-4 border-l-gray-500 bg-white transition-all hover:shadow-md dark:border-slate-800 dark:border-l-gray-500 dark:bg-slate-900"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Configurações
                  </CardTitle>
                  <Settings className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold dark:text-white">Conta</div>
                    <ChevronRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-gray-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                    Dados pessoais e segurança
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity or Stats could go here */}
        </div>
      </div>

      <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <VerificationModal open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen} />
    </div>
  );
}
