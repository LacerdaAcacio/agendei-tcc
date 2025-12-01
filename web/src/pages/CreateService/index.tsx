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
    navigate,
    isEditing,
    isLoadingDetails,
  } = useCreateService();

  if (isEditing && isLoadingDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <Header />

      <Container as="main" size="sm" className="pt-24">
        <div className="mb-8">
          <Typography variant="h1">
            {isEditing ? 'Editar Serviço' : 'Criar Novo Serviço'}
          </Typography>
          <Typography variant="muted" className="mt-2">
            {isEditing
              ? 'Atualize as informações do seu serviço.'
              : 'Preencha as informações abaixo para oferecer seus serviços.'}
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <BasicInfoSection register={register} setValue={setValue} watch={watch} errors={errors} />

          {/* Service Type & Location */}
          <ServiceTypeSection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            serviceType={serviceType}
          />

          {/* Images */}
          <ImageUploadSection setValue={setValue} errors={errors} />

          {/* Availability */}
          <AvailabilitySection setValue={setValue} watch={watch} />

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/my-services')}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createService.isPending}
              className="min-w-[150px] border-transparent bg-indigo-600 text-white hover:bg-indigo-700 dark:text-white"
            >
              {isSubmitting || createService.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Salvando...' : 'Criando...'}
                </>
              ) : isEditing ? (
                'Salvar Alterações'
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
