import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { useDashboard } from './useDashboard';

export function DashboardPage() {
  const { 
    user, 
    signOut, 
    appointments, 
    isLoading, 
    error, 
    navigate, 
    getStatusVariant 
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white dark:bg-slate-900 shadow dark:border-b dark:border-slate-800">
        <Container className="py-4 flex justify-between items-center">
          <Typography variant="h2">Agendei</Typography>
          <div className="flex items-center gap-4">
            <Typography variant="muted">Olá, {user?.name}</Typography>
            <Button variant="outline" onClick={signOut}>Sair</Button>
          </div>
        </Container>
      </header>

      <Container as="main" className="py-8">
        <div className="mb-6 flex justify-between items-center">
          <Typography variant="h3">Meus Agendamentos</Typography>
          <Link to="/appointments/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-10 text-center text-red-500">
              Erro ao carregar agendamentos. Tente novamente.
            </CardContent>
          </Card>
        ) : !appointments || appointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não possui agendamentos. Crie seu primeiro agendamento agora!
              </p>
              <Link to="/appointments/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Agendamento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{appointment.serviceName}</CardTitle>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {appointment.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2">
                        {appointment.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
