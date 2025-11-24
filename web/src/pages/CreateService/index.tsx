import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Typography } from '@/components/ui/typography';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BasicInfoSection } from './components/BasicInfoSection';
import { ServiceTypeSection } from './components/ServiceTypeSection';
import { ImageUploadSection } from './components/ImageUploadSection';
import { AvailabilitySection } from './components/AvailabilitySection';
import { useCreateService } from './useCreateService';

export function CreateServicePage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSubmitting,
    serviceType,
    onSubmit,
    createService,
    navigate
  } = useCreateService();

  return (
   <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Header />
      
      <Container as="main" size="sm" className="pt-24">
        <div className="mb-8">
          <Typography variant="h1">Criar Novo Serviço</Typography>
          <Typography variant="muted" className="mt-2">Preencha as informações abaixo para oferecer seus serviços.</Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <BasicInfoSection 
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />

          {/* Service Type & Location */}
          <ServiceTypeSection 
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            serviceType={serviceType}
          />

          {/* Images */}
          <ImageUploadSection 
            setValue={setValue}
            errors={errors}
          />

          {/* Availability */}
          <AvailabilitySection 
            setValue={setValue}
            watch={watch}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || createService.isPending} className="min-w-[150px]">
              {isSubmitting || createService.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Serviço'
              )}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}
