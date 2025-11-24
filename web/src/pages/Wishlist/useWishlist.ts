import { useTranslation } from 'react-i18next';

import { useUserWishlist } from '@/hooks/useWishlist';

export function useWishlist() {
  const { t } = useTranslation();
  const { wishlistServices: favoritedServices, isLoading } = useUserWishlist();

  return {
    t,
    favoritedServices,
    isLoading,
  };
}
