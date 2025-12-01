import { useState } from 'react';
import { Search, Languages, Menu, User as UserIcon, MapPin, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts';
import { useProviderGuard } from '@/hooks/useProviderGuard';
import {
  Link,
  useNavigate,
  createSearchParams,
  useSearchParams,
  type URLSearchParamsInit,
} from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/utils/category-icons';
import { useLocationSearch, type LocationResult } from '@/hooks/useLocationSearch';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchParams {
  type?: string;
  search?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  [key: string]: string | undefined;
}

interface HeaderProps {
  onSearch?: (params: SearchParams) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { checkProvider } = useProviderGuard();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Search states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isDateOpen, setIsDateOpen] = useState(false);

  // Derived state from URL
  const [serviceType, setServiceType] = useState<'presential' | 'digital' | null>(
    (searchParams.get('type') as 'presential' | 'digital') || null,
  );

  // Location Search Hook
  const {
    query: locationQuery,
    setQuery: setLocationQuery,
    results: locationResults,
    isLoading: isLocationLoading,
  } = useLocationSearch();
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Categories Hook
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return ptBR;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };

  const handleServiceTypeChange = (type: 'presential' | 'digital') => {
    setServiceType((prev) => (prev === type ? null : type));
  };

  const handleLocationSelect = (result: LocationResult) => {
    setSelectedLocation(result);
    setLocationQuery(result.label.split(',')[0]); // Show short name
    setShowLocationSuggestions(false);
  };

  const handleSearch = () => {
    const params: SearchParams = {};

    if (serviceType) {
      params.type = serviceType.toUpperCase();
    }

    if (searchKeyword) {
      params.search = searchKeyword;
    }

    if (selectedLocation) {
      params.location = selectedLocation.label.split(',')[0];
    } else if (locationQuery) {
      params.location = locationQuery;
    }

    if (dateRange?.from) {
      params.startDate = dateRange.from.toISOString();
      // If 'to' is not selected, use 'from' (end of day logic handled by backend or assumed same day)
      params.endDate = (dateRange.to || dateRange.from).toISOString();
    }

    if (selectedCategoryId) {
      params.category = selectedCategoryId;
    }

    navigate({
      pathname: '/search',
      search: '?' + createSearchParams(params as unknown as URLSearchParamsInit).toString(),
    });

    setIsSearchExpanded(false);

    if (onSearch) {
      onSearch(params);
    }
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return t('header.search.anyweek');

    const locale = getDateLocale();
    const fromStr = format(range.from, 'dd MMM', { locale });

    if (!range.to) return fromStr;

    const toStr = format(range.to, 'dd MMM', { locale });
    return `${fromStr} - ${toStr}`;
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 border-b bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
        isSearchExpanded ? 'h-48' : 'h-20',
      )}
    >
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-bold text-white dark:bg-indigo-500">
              A
            </div>
            <span className="hidden text-xl font-bold md:block">agendei</span>
          </Link>

          {/* Search Bar (Collapsed) */}
          {!isSearchExpanded && (
            <div
              className="hidden cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 md:flex"
              onClick={() => setIsSearchExpanded(true)}
            >
              <span className="border-r border-gray-300 px-2 pr-4 text-sm font-medium text-gray-700 dark:border-slate-600 dark:text-slate-300">
                {selectedLocation
                  ? selectedLocation.label.split(',')[0]
                  : t('header.search.anywhere')}
              </span>
              <span className="px-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                {formatDateRange(dateRange)}
              </span>
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
                  <Search className="h-3.5 w-3.5 text-white" />
                  <span className="text-white">Buscar</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar (Expanded - Tabs) */}
          {isSearchExpanded && (
            <div className="hidden flex-1 justify-center md:flex">
              <div className="flex items-center gap-8 text-gray-600 dark:text-slate-400">
                <button
                  className={cn(
                    'border-b-2 pb-1 font-medium transition-colors',
                    serviceType === 'presential'
                      ? 'border-black text-black dark:border-white dark:text-white'
                      : 'border-transparent hover:text-gray-800 dark:hover:text-slate-200',
                  )}
                  onClick={() => handleServiceTypeChange('presential')}
                >
                  {t('header.tabs.presential')}
                </button>
                <button
                  className={cn(
                    'border-b-2 pb-1 font-medium transition-colors',
                    serviceType === 'digital'
                      ? 'border-black text-black dark:border-white dark:text-white'
                      : 'border-transparent hover:text-gray-800 dark:hover:text-slate-200',
                  )}
                  onClick={() => handleServiceTypeChange('digital')}
                >
                  {t('header.tabs.digital')}
                </button>
              </div>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 md:block"
              onClick={() => {
                if (!user) {
                  navigate('/register?role=PROVIDER');
                } else {
                  if (checkProvider()) {
                    navigate('/services/new');
                  }
                }
              }}
            >
              {t('header.host_action')}
            </Button>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200">
                    <Languages className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase">
                      {i18n.language.split('-')[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    Português
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('es')}>Español</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border bg-white p-1 pl-3 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                    <Menu className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-white dark:bg-slate-700">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-60 overflow-hidden border bg-white p-0 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col">
                    {user ? (
                      <>
                        <div className="border-b px-4 py-3 dark:border-slate-800">
                          <p className="text-sm font-medium dark:text-slate-200">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <Link
                          to="/my-bookings"
                          className="px-4 py-3 text-left text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.my_appointments')}
                        </Link>
                        <Link
                          to="/wishlists"
                          className="px-4 py-3 text-left text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.favorites', { defaultValue: 'Meus Favoritos' })}
                        </Link>
                        <Link
                          to="/profile"
                          className="px-4 py-3 text-left text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.profile')}
                        </Link>
                        <div className="my-1 h-px bg-gray-100 dark:bg-slate-800" />
                        <button
                          onClick={signOut}
                          className="px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="px-4 py-3 text-left text-sm font-medium hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.login')}
                        </Link>
                        <Link
                          to="/register"
                          className="px-4 py-3 text-left text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          {t('header.menu.register')}
                        </Link>
                        <div className="my-1 h-px bg-gray-100 dark:bg-slate-800" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 text-left text-sm hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          onClick={() => {
                            if (!user) {
                              navigate('/register?role=PROVIDER');
                            } else {
                              if (checkProvider()) {
                                navigate('/services/new');
                              }
                            }
                          }}
                        >
                          {t('header.menu.host')}
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Expanded Search Panel */}
        {isSearchExpanded && (
          <div className="mx-auto mt-2 max-w-5xl">
            <div className="relative flex items-center divide-x divide-gray-200 rounded-full border bg-white shadow-lg dark:divide-slate-600 dark:border-slate-700 dark:bg-slate-800">
              {/* Keyword Input */}
              <div className="flex-1 cursor-pointer rounded-l-full px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700">
                <label className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                  O que você procura?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Faxina, Pedreiro..."
                  className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400 dark:text-slate-400 dark:placeholder:text-slate-500"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* Location Input with Autocomplete */}
              <div className="group relative flex-1 cursor-pointer px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700">
                <label className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                  {t('header.search.location')}
                </label>
                <input
                  type="text"
                  placeholder={t('header.search.placeholder_location')}
                  className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400 dark:text-slate-400 dark:placeholder:text-slate-500"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                />

                {/* Suggestions Dropdown */}
                {showLocationSuggestions && (locationResults.length > 0 || isLocationLoading) && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-white py-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {isLocationLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-slate-400">
                        Buscando...
                      </div>
                    ) : (
                      locationResults.map((result, index) => (
                        <div
                          key={index}
                          className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationSelect(result);
                          }}
                        >
                          <div className="rounded-full bg-gray-100 p-2 dark:bg-slate-800">
                            <MapPin className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-slate-300">
                            {result.label}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex-1 cursor-pointer px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700">
                <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                  <PopoverTrigger asChild>
                    <div className="w-full text-left">
                      <label className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                        {t('header.search.date')}
                      </label>
                      <span className="block truncate text-sm text-gray-600 dark:text-slate-400">
                        {formatDateRange(dateRange) !== t('header.search.anyweek')
                          ? formatDateRange(dateRange)
                          : t('header.search.placeholder_date')}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto border bg-white p-0 dark:border-slate-800 dark:bg-slate-900"
                    align="center"
                  >
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      className="dark:bg-slate-900 dark:text-slate-200"
                    />
                    <div className="border-t border-gray-100 p-3 dark:border-slate-800">
                      <Button
                        className="w-full rounded-full bg-indigo-600 font-bold text-white hover:bg-indigo-700"
                        onClick={() => setIsDateOpen(false)}
                      >
                        Aplicar Datas
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="relative flex-[1.2] cursor-pointer px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full text-left">
                      <label className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                        {t('header.search.service_type')}
                      </label>
                      <span className="block truncate text-sm text-gray-600 dark:text-slate-400">
                        {selectedCategoryId
                          ? (() => {
                              const category = categories.find((c) => c.id === selectedCategoryId);
                              return category
                                ? t(`categories.${category.slug}`, { defaultValue: category.name })
                                : '';
                            })()
                          : t('header.search.select_category')}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 border bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                    align="center"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {isCategoriesLoading ? (
                        <div className="col-span-2 text-center text-sm text-gray-500">
                          Carregando...
                        </div>
                      ) : (
                        categories.map((category) => {
                          const Icon = getCategoryIcon(category.slug || category.icon);
                          return (
                            <button
                              key={category.id}
                              className={cn(
                                'flex items-center gap-2 rounded-md p-2 text-sm transition-colors',
                                selectedCategoryId === category.id
                                  ? 'bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                  : 'text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800',
                              )}
                              onClick={() => setSelectedCategoryId(category.id)}
                            >
                              <Icon className="h-4 w-4" />
                              {t(`categories.${category.slug}`, { defaultValue: category.name })}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="py-2 pl-2 pr-2">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-full border-none bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={handleSearch}
                >
                  <Search className="h-5 w-5 text-white" />
                  <span className="hidden text-white lg:inline">
                    {t('header.search.search_button')}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close search */}
      {isSearchExpanded && (
        <div
          className="fixed inset-0 top-48 z-[-1] bg-black/25"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}
    </header>
  );
}
