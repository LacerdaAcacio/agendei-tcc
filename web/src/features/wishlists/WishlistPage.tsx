import { useServices } from '@/hooks/useServices';
import { useWishlist } from '@/hooks/useWishlist';
import { ServiceCard } from '@/components/home/ServiceCard';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';

export function WishlistPage() {
  const { wishlist } = useWishlist();
  const { data, isLoading } = useServices({});

  // Filter services that are in the wishlist
  // Note: In a real app, we might want an endpoint to fetch services by IDs
  // For now, we filter client-side from the all services list or we'd need a new endpoint
  const wishlistServices = data?.filter(service => wishlist.includes(service.id)) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : wishlistServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Nenhum favorito ainda</h2>
            <p className="text-gray-500">Explore os serviços e adicione aos favoritos para vê-los aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
