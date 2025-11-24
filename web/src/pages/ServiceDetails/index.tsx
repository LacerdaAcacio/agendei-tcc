import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Star, Briefcase, Globe, Check, MapPin, Flag, Video } from 'lucide-react';
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
import { t } from 'i18next';

export function ServiceDetailsPage() {
  const {
    service,
    isLoading,
    user,
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
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-10">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
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
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Serviço não encontrado</h1>
          <Button className="mt-4" onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {/* Service Header Component */}
        <ServiceHeader
          service={service}
          isFavorited={isFavorited}
          onToggleFavorite={handleToggleFavorite}
          onShare={() => handleShare(service)}
          scrollToSection={scrollToSection}
        />

        {/* Service Gallery Component */}
        <ServiceGallery
          images={service.images || []}
          onImageClick={openLightbox}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Host Section */}
            <div className="flex justify-between items-start pb-6 border-b border-gray-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Serviço oferecido por {service.provider?.name || service.owner?.name || 'Anfitrião'}
                </h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                  {service.hostYears || 2} {service.hostYears === 1 ? 'ano' : 'anos'} de experiência
                </p>
                
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  {service.hostJob && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Meu trabalho: {service.hostJob}</span>
                    </div>
                  )}
                  {service.hostLanguages && service.hostLanguages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Idiomas: {service.hostLanguages.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={service.provider?.avatarUrl || service.provider?.profileImage} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {(service.provider?.name || service.owner?.name || 'A').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {(service.rating || 0) > 4.8 && (
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-black" />
                    Preferido
                  </Badge>
                )}
              </div>
            </div>

            {/* Highlights */}
            {service.highlights && service.highlights.length > 0 && (
              <div className="py-6 border-b border-gray-200 dark:border-slate-800">
                <h3 className="font-semibold mb-4">Destaques</h3>
                <div className="space-y-4">
                  {service.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1">
                        <Check className="w-5 h-5 text-gray-600" />
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
            <div className="py-6 border-b border-gray-200 dark:border-slate-800">
              <h3 className="font-semibold mb-4">Sobre este serviço</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Reviews */}
            <div id="reviews-section" className="py-6 border-b border-gray-200 dark:border-slate-800">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 fill-black dark:fill-white" />
                {service.rating?.toFixed(1)} · {service.reviewCount} comentários
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {service.reviews?.map((review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedUser(review.user)}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
                      >
                        <Avatar>
                          <AvatarImage src={review.user.avatarUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {review.user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{review.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </button>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-3 h-3", 
                            i < (review.rating || 5) ? "fill-black dark:fill-white text-black dark:text-white" : "text-gray-300 dark:text-slate-700"
                          )} 
                        />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
                {(!service.reviews || service.reviews.length === 0) && (
                  <p className="text-gray-500 col-span-2">Ainda não há comentários para este serviço.</p>
                )}
              </div>
            </div>

            {/* Map or Digital Service Info */}
            <div id="location-section" className="py-6">
              <h3 className="font-semibold mb-4">
                {service.type === 'DIGITAL' ? 'Como funciona' : 'Onde você vai estar'}
              </h3>
              
              {service.type === 'DIGITAL' ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center text-center space-y-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Video className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-blue-900 mb-2">Serviço Online</h4>
                    <p className="text-blue-700 max-w-md mx-auto">
                      Este serviço é realizado remotamente via chamada de vídeo ou entrega digital. 
                      Você receberá os detalhes de acesso após a confirmação da reserva.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[400px] w-full rounded-xl overflow-hidden z-0 relative border border-gray-200 dark:border-slate-800">
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
                        <Popup>
                          {service.location}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{service.location}</p>
                    {(service as any).address && (
                      <p className="text-slate-600 dark:text-slate-300">{(service as any).address}</p>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="relative">
            <div className="sticky top-28">
              <Card className="shadow-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                      </span>
                      <span className="text-gray-500 text-sm"> / {t(`price_unit.${service.priceUnit || 'PER_PERSON'}`)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-black dark:fill-white" />
                      <span className="font-medium">{service.rating?.toFixed(1)}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 underline">{service.reviewCount || 0} reviews</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BookingWidget 
                    service={service} 
                    onSubmit={handleBookingSubmit}
                    isSubmitting={isBooking}
                  />
                </CardContent>
              </Card>
              
              <div className="mt-4 flex justify-center gap-2 text-gray-500 text-sm">
                <button 
                  className="flex items-center gap-2 hover:underline"
                  onClick={() => setIsReportOpen(true)}
                >
                  <Flag className="w-4 h-4" />
                  Reportar este serviço
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Lightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={service.images}
        currentIndex={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />

      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        serviceId={service.id}
      />

      {/* User Profile Modal */}
      <PublicProfileModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser}
      />
    </div>
  );
}
