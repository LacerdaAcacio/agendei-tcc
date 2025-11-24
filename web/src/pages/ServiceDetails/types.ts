export interface ServiceHeaderProps {
  service: {
    title: string;
    rating?: number;
    reviewCount?: number;
    location: string;
  };
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  scrollToSection: (id: string) => void;
}

export interface ServiceGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
}
