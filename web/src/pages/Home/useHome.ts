import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useHomeData } from '@/hooks/useHomeData';
import { useSearchServices } from '@/hooks/useSearchServices';
import { useServices } from '@/hooks/useServices';

export function useHome() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Check if we have any search filters
  const hasFilters =
    searchParams.has('location') ||
    searchParams.has('date') ||
    searchParams.has('category') ||
    searchParams.has('type') ||
    searchParams.has('search');

  // Prepare filters for the hook
  const filters = {
    location: searchParams.get('location') || undefined,
    startDate: searchParams.get('date') || undefined,
    category: searchParams.get('category') || undefined,
    type: (searchParams.get('type')?.toUpperCase() as 'PRESENTIAL' | 'DIGITAL') || undefined,
    search: searchParams.get('search') || undefined,
  };

  // Conditional hooks
  const { data: homeData, isLoading: isHomeLoading } = useHomeData();
  const { data: searchResults, isLoading: isSearchLoading } = useSearchServices(filters);
  const { data: allServices, isLoading: isAllServicesLoading } = useServices(); // Fallback hook

  const isLoading = hasFilters ? isSearchLoading : isHomeLoading || isAllServicesLoading;

  return {
    t,
    hasFilters,
    isLoading,
    homeData,
    searchResults,
    allServices,
  };
}
