import { Header } from '@/components/layout/Header';
import { CategoriesBar } from '@/components/home/CategoriesBar';
import { ServiceCard } from '@/components/home/ServiceCard';
import { ServiceCarousel } from '@/components/home/ServiceCarousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { useHome } from './useHome';

export function HomePage() {
  const { t, hasFilters, isLoading, homeData, searchResults, allServices } = useHome();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <div className="pt-20">
        <CategoriesBar />

        <Container as="main" className="py-6">
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          ) : hasFilters ? (
            // Search Results Layout (Grid)
            <div className="space-y-6">
              <Typography variant="h2">
                {searchResults && searchResults.length > 0
                  ? `${searchResults.length} resultados encontrados`
                  : 'Nenhum serviço encontrado'}
              </Typography>

              {searchResults && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {searchResults.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-500">
                    Tente ajustar seus filtros ou buscar em outra região.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Home Layout (Carousels)
            <div className="space-y-4">
              {homeData?.categories?.map((category) => (
                <ServiceCarousel
                  key={category.id}
                  title={t(`categories.${category.slug}`) || category.name}
                  services={category.services || []}
                />
              ))}

              {(!homeData?.categories || homeData.categories.length === 0) && (
                <div className="space-y-8">
                  {allServices && allServices.length > 0 ? (
                    <ServiceCarousel title="Todos os Serviços" services={allServices} />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-gray-500">Nenhum serviço disponível no momento.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
