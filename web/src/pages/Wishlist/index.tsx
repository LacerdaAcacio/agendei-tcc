import { Header } from '@/components/layout/Header';
import { ServiceCard } from '@/components/home/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { useWishlist } from './useWishlist';

export function WishlistPage() {
  const { t, favoritedServices, isLoading } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <Container as="main" className="pb-10 pt-24">
        <div className="mb-8">
          <Typography variant="h1">{t('categories.favoritos')}</Typography>
          <Typography variant="muted" className="mt-2">
            {favoritedServices.length}{' '}
            {favoritedServices.length === 1 ? 'item salvo' : 'itens salvos'}
          </Typography>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : favoritedServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoritedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Typography variant="h2" className="mb-2">
              Sua lista de favoritos está vazia
            </Typography>
            <Typography variant="muted">
              Explore nossos serviços e salve os que você mais gostar!
            </Typography>
          </div>
        )}
      </Container>
    </div>
  );
}
