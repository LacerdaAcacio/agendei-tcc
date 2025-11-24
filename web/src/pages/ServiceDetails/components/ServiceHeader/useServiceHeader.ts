import { toast } from 'sonner';

export function useServiceHeader() {
  const handleShare = async (service: { title?: string }) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.title,
          text: `Confira este serviço no Agendei: ${service?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    handleShare,
    scrollToSection,
  };
}
