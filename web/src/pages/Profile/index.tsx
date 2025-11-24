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
  AlertTriangle
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
    navigate 
  } = useProfile();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Identity Card */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatarUrl} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1.5 rounded-full border-2 border-white" title="Verificado">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
              </div>

              <div className="flex gap-2 flex-wrap justify-center">
                <Badge className={user.role === 'provider' 
                  ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 border-transparent" 
                  : "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 border-transparent"
                }>
                  {user.role === 'provider' ? 'Prestador' : 'Cliente'}
                </Badge>
                
                {user.verificationStatus === 'APPROVED' || user.isVerified ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50 border-transparent">
                    Verificado
                  </Badge>
                ) : user.verificationStatus === 'PENDING' ? (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/50 border-transparent">
                    Em Análise
                  </Badge>
                ) : (
                  <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 border-transparent">
                    Não Verificado
                  </Badge>
                )}
              </div>

              {(!user.isVerified && user.verificationStatus !== 'APPROVED') && (
                <div className={`w-full p-3 rounded-lg border text-left space-y-2 ${
                  user.verificationStatus === 'PENDING' 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900' 
                    : 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900'
                }`}>
                  <div className={`flex items-center gap-2 font-medium text-sm ${
                    user.verificationStatus === 'PENDING' ? 'text-blue-900 dark:text-blue-200' : 'text-amber-900 dark:text-amber-200'
                  }`}>
                    {user.verificationStatus === 'PENDING' ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verificação em Andamento
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        Verifique sua conta
                      </>
                    )}
                  </div>
                  
                  <p className={`text-xs ${
                    user.verificationStatus === 'PENDING' ? 'text-blue-700 dark:text-blue-400' : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {user.verificationStatus === 'PENDING' 
                      ? 'Seus documentos estão sendo analisados. Avisaremos assim que for concluído.'
                      : 'Aumente a confiança do seu perfil enviando um documento de identidade.'
                    }
                  </p>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`w-full border-transparent ${
                      user.verificationStatus === 'PENDING'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70'
                        : 'bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-white'
                    }`}
                    onClick={() => setIsVerificationModalOpen(true)}
                    disabled={user.verificationStatus === 'PENDING'}
                  >
                    {user.verificationStatus === 'PENDING' ? 'Aguardando Aprovação' : 'Verificar agora'}
                  </Button>
                </div>
              )}

              <div className="w-full pt-4 space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Editar Perfil
                </Button>
                <Button 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                  variant="ghost"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Control Center */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Central de Controle</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* My Bookings Card */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all group border-l-4 border-l-blue-500 bg-white dark:bg-slate-900 dark:border-slate-800 dark:border-l-blue-500"
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
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Visualize e gerencie suas reservas
                  </p>
                </CardContent>
              </Card>

              {/* My Services Card (Provider Only) */}
              {user.role === 'provider' && (
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all group border-l-4 border-l-purple-500 bg-white dark:bg-slate-900 dark:border-slate-800 dark:border-l-purple-500"
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
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                      Gerencie seus anúncios e disponibilidade
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Settings Card */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all group border-l-4 border-l-gray-500 bg-white dark:bg-slate-900 dark:border-slate-800 dark:border-l-gray-500"
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
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Dados pessoais e segurança
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity or Stats could go here */}
        </div>
      </div>

      <EditProfileDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
      
      <VerificationModal
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      />
    </div>
  );
}
