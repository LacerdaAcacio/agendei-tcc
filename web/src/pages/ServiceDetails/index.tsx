import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Star, Briefcase, Globe, Check, Video, Flag } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Lightbox } from '@/components/ui/lightbox';
import { PublicProfileModal } from '@/features/profile/components/PublicProfileModal';
import { BookingWidget } from '@/features/bookings/components/BookingWidget';
import { ReportModal } from '@/components/reports/ReportModal';
import { ServiceHeader } from './components/ServiceHeader';
import { ServiceGallery } from './components/ServiceGallery';
import { useServiceHeader } from './components/ServiceHeader/useServiceHeader';
import { useServiceDetailsPage } from './useServiceDetailsPage';
import './constants'; // Import to apply Leaflet icon fix
import { cn } from '@/lib/utils';

export function ServiceDetailsPage() {
  const {
    service,
    isLoading,
    isFavorited,
    isBooking,
    isLightboxOpen,
    lightboxIndex,
    isReportOpen,
    selectedUser,
    setIsLightboxOpen,
    setLightboxIndex,
    setIsReportOpen,
    setSelectedUser,
    handleToggleFavorite,
    handleBookingSubmit,
    openLightbox,
    scrollToSection,
  } = useServiceDetailsPage();

  const { handleShare } = useServiceHeader();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-24">
          <Skeleton className="mb-4 h-8 w-2/3" />
          <Skeleton className="mb-8 h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="flex h-[80vh] flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Serviço não encontrado
          </h1>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {/* Service Header Component */}
        <ServiceHeader
          service={service}
          isFavorited={isFavorited}
          onToggleFavorite={handleToggleFavorite}
          onShare={() => handleShare(service)}
          scrollToSection={scrollToSection}
        />

        {/* Service Gallery Component */}
        <ServiceGallery images={service.images || []} onImageClick={openLightbox} />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Left Column: Details */}
          <div className="space-y-8 md:col-span-2">
            {/* Host Section */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-6 dark:border-slate-800">
              <div>
                <h2 className="mb-1 text-xl font-semibold">
                  Serviço oferecido por{' '}
                  {service.provider?.name || service.owner?.name || 'Anfitrião'}
                </h2>
                <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
                  {service.hostYears || 2} {service.hostYears === 1 ? 'ano' : 'anos'} de experiência
                </p>

                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  {service.hostJob && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Meu trabalho: {service.hostJob}</span>
                    </div>
                  )}
                  {service.hostLanguages && service.hostLanguages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Idiomas: {service.hostLanguages.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={service.provider?.avatarUrl || service.provider?.profileImage}
                  />
                  <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
                    {(service.provider?.name || service.owner?.name || 'A')
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {(service.rating || 0) > 4.8 && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-black" />
                    Preferido
                  </Badge>
                )}
              </div>
            </div>

            {/* Highlights */}
            {service.highlights && service.highlights.length > 0 && (
              <div className="border-b border-gray-200 py-6 dark:border-slate-800">
                <h3 className="mb-4 font-semibold">Destaques</h3>
                <div className="space-y-4">
                  {service.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1">
                        <Check className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="border-b border-gray-200 py-6 dark:border-slate-800">
              <h3 className="mb-4 font-semibold">Sobre este serviço</h3>
              <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                {service.description}
              </p>
            </div>

            {/* Reviews */}
            <div
              id="reviews-section"
              className="border-b border-gray-200 py-6 dark:border-slate-800"
            >
              <h3 className="mb-6 flex items-center gap-2 font-semibold">
                <Star className="h-5 w-5 fill-black dark:fill-white" />
                {service.rating?.toFixed(1)} · {service.reviewCount} comentários
              </h3>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {service.reviews?.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setSelectedUser(
                            review.user as { name: string; avatarUrl?: string; createdAt?: string },
                          )
                        }
                        className="flex items-center gap-3 text-left transition-opacity hover:opacity-80"
                      >
                        <Avatar>
                          <AvatarImage src={review.user.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 font-bold text-primary">
                            {review.user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {review.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </button>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < (review.rating || 5)
                              ? 'fill-black text-black dark:fill-white dark:text-white'
                              : 'text-gray-300 dark:text-slate-700',
                          )}
                        />
                      ))}
                    </div>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                      {review.comment}
                    </p>
                  </div>
                ))}
                {(!service.reviews || service.reviews.length === 0) && (
                  <p className="col-span-2 text-gray-500">
                    Ainda não há comentários para este serviço.
                  </p>
                )}
              </div>
            </div>

            {/* Map or Digital Service Info */}
            <div id="location-section" className="py-6">
              <h3 className="mb-4 font-semibold">
                {service.type === 'DIGITAL' ? 'Como funciona' : 'Onde você vai estar'}
              </h3>

              {service.type === 'DIGITAL' ? (
                <div className="flex flex-col items-center space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-8 text-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-blue-900">Serviço Online</h4>
                    <p className="mx-auto max-w-md text-blue-700">
                      Este serviço é realizado remotamente via chamada de vídeo ou entrega digital.
                      Você receberá os detalhes de acesso após a confirmação da reserva.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative z-0 h-[400px] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800">
                    <MapContainer
                      center={[service.latitude, service.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[service.latitude, service.longitude]}>
                        <Popup>{service.title}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {service.location}
                    </p>
                    {service.address && (
                      <p className="text-slate-600 dark:text-slate-300">{service.address}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="relative">
            <div className="sticky top-24">
              <BookingWidget
                service={service}
                onSubmit={handleBookingSubmit}
                isSubmitting={isBooking}
              />

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="mx-auto flex items-center justify-center gap-2 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Flag className="h-4 w-4" />
                  Denunciar este serviço
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={service.images || []}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />

      {selectedUser && (
        <PublicProfileModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        serviceId={service.id}
      />
    </div>
  );
}
