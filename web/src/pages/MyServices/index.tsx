import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Header } from '@/components/layout/Header';
import { useMyServices } from './useMyServices';
import { MyServiceHeader } from '@/features/MyServices/components/MyServiceHeader';
import { MyServiceList } from '@/features/MyServices/components/MyServiceList';
import { ServiceEmptyState } from '@/features/MyServices/components/ServiceEmptyState';
import { DeleteServiceDialog } from '@/features/MyServices/components/DeleteServiceDialog';

export function MyServicesPage() {
  const { services, isLoading, deleteService } = useMyServices();
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (serviceToDelete) {
      deleteService.mutate(serviceToDelete, {
        onSuccess: () => setServiceToDelete(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <Header />

      <Container as="main" className="pt-24">
        <MyServiceHeader />

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <MyServiceList services={services} onDelete={setServiceToDelete} />
        ) : (
          <ServiceEmptyState />
        )}
      </Container>

      <DeleteServiceDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteConfirm as () => void}
        isDeleting={deleteService.isPending}
      />
    </div>
  );
}
