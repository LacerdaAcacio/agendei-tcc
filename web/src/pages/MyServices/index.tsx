import { ServiceCard } from '@/components/home/ServiceCard';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { Plus, Loader2, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useMyServices } from './useMyServices';

export function MyServicesPage() {
  const { services, isLoading } = useMyServices();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header />
      
      <Container as="main" className="pt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Typography variant="h1">Meus Serviços Anunciados</Typography>
            <Typography variant="muted" className="mt-1">Gerencie os serviços que você oferece na plataforma.</Typography>
          </div>
          
          <Link to="/services/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Serviço
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 text-center p-8">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <PackageOpen className="w-12 h-12 text-gray-400" />
            </div>
            <Typography variant="h3" className="mb-2">Você ainda não tem serviços</Typography>
            <Typography variant="muted" className="max-w-md mb-6">
              Comece a ganhar dinheiro oferecendo suas experiências e habilidades para nossa comunidade.
            </Typography>
            <Link to="/services/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar meu primeiro serviço
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
