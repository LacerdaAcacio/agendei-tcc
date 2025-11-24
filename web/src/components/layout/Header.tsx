
import { useState } from 'react';
import { Search, Languages, Menu, User as UserIcon, MapPin, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useProviderGuard } from '@/hooks/useProviderGuard';
import { Link, useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/components/home/CategoriesBar';
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
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSearch?: (params: any) => void;
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
    (searchParams.get('type') as 'presential' | 'digital') || null
  );

  // Location Search Hook
  const { query: locationQuery, setQuery: setLocationQuery, results: locationResults, isLoading: isLocationLoading } = useLocationSearch();
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt': return ptBR;
      case 'es': return es;
      default: return enUS;
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
    const params: any = {};

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
      search: '?' + createSearchParams(params).toString()
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
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b dark:border-slate-800 transition-all duration-300",
      isSearchExpanded ? "h-48" : "h-20"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold hidden md:block">agendei</span>
          </Link>

          {/* Search Bar (Collapsed) */}
          {!isSearchExpanded && (
            <div 
              className="hidden md:flex items-center border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer px-4 py-2 gap-4 bg-gray-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700"
              onClick={() => setIsSearchExpanded(true)}
            >
              <span className="text-sm font-medium px-2 text-gray-700 dark:text-slate-300 border-r border-gray-300 dark:border-slate-600 pr-4">
                {selectedLocation ? selectedLocation.label.split(',')[0] : t('header.search.anywhere')}
              </span>
              <span className="text-sm font-medium px-2 text-gray-700 dark:text-slate-300">
                {formatDateRange(dateRange)}
              </span>
              <div className="flex items-center gap-3 pl-2">
                <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Search className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Buscar</span>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar (Expanded - Tabs) */}
          {isSearchExpanded && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-8 text-gray-600 dark:text-slate-400">
                <button 
                  className={cn(
                    "font-medium transition-colors pb-1 border-b-2",
                    serviceType === 'presential' ? "text-black dark:text-white border-black dark:border-white" : "border-transparent hover:text-gray-800 dark:hover:text-slate-200"
                  )}
                  onClick={() => handleServiceTypeChange('presential')}
                >
                  {t('header.tabs.presential')}
                </button>
                <button 
                  className={cn(
                    "font-medium transition-colors pb-1 border-b-2",
                    serviceType === 'digital' ? "text-black dark:text-white border-black dark:border-white" : "border-transparent hover:text-gray-800 dark:hover:text-slate-200"
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
              className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 px-4 py-2 rounded-full transition-colors hidden md:block"
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
                  <button className="flex items-center gap-1 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors">
                    <Languages className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">{i18n.language.split('-')[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                    Português
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('es')}>
                    Español
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 border dark:border-slate-700 rounded-full p-1 pl-3 hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                    <div className="w-8 h-8 bg-gray-500 dark:bg-slate-700 rounded-full flex items-center justify-center text-white overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-60 p-0 overflow-hidden bg-white dark:bg-slate-900 border dark:border-slate-800">
                  <div className="flex flex-col">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b dark:border-slate-800">
                          <p className="font-medium text-sm dark:text-slate-200">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <Link to="/my-bookings" className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 text-left dark:text-slate-300">
                          {t('header.menu.my_appointments')}
                        </Link>
                        <Link to="/profile" className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 text-left dark:text-slate-300">
                          {t('header.menu.profile')}
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                        <button 
                          onClick={signOut}
                          className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 text-left text-red-600 dark:text-red-400"
                        >
                          {t('header.menu.logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-left dark:text-slate-200">
                          {t('header.menu.login')}
                        </Link>
                        <Link to="/register" className="px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 text-left dark:text-slate-300">
                          {t('header.menu.register')}
                        </Link>
                        <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                        <Button 
                          variant="ghost" 
                          className="w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 text-left justify-start dark:text-slate-300"
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
          <div className="max-w-5xl mx-auto mt-2">
            <div className="flex items-center bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-full shadow-lg divide-x divide-gray-200 dark:divide-slate-600 relative">
              
              {/* Keyword Input */}
              <div className="flex-1 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-l-full cursor-pointer">
                <label className="text-xs font-bold text-gray-800 dark:text-slate-200 block">O que você procura?</label>
                <input 
                  type="text" 
                  placeholder="Ex: Faxina, Pedreiro..."
                  className="w-full bg-transparent outline-none text-sm text-gray-600 dark:text-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* Location Input with Autocomplete */}
              <div className="flex-1 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer group relative">
                <label className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{t('header.search.location')}</label>
                <input 
                  type="text" 
                  placeholder={t('header.search.placeholder_location')}
                  className="w-full bg-transparent outline-none text-sm text-gray-600 dark:text-slate-400 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                />
                
                {/* Suggestions Dropdown */}
                {showLocationSuggestions && (locationResults.length > 0 || isLocationLoading) && (
                  <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl mt-2 py-2 z-50 border dark:border-slate-700 overflow-hidden">
                    {isLocationLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-slate-400">Buscando...</div>
                    ) : (
                      locationResults.map((result, index) => (
                        <div 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocationSelect(result);
                          }}
                        >
                          <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full">
                            <MapPin className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                          </div>
                          <span className="text-sm text-gray-700 dark:text-slate-300">{result.label}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer relative">
                <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                  <PopoverTrigger asChild>
                    <div className="w-full text-left">
                      <label className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{t('header.search.date')}</label>
                      <span className="text-sm text-gray-600 dark:text-slate-400 block truncate">
                        {formatDateRange(dateRange) !== t('header.search.anyweek') ? formatDateRange(dateRange) : t('header.search.placeholder_date')}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900 border dark:border-slate-800" align="center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                      className="dark:bg-slate-900 dark:text-slate-200"
                    />
                    <div className="p-3 border-t border-gray-100 dark:border-slate-800">
                      <Button 
                        className="w-full rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={() => setIsDateOpen(false)}
                      >
                        Aplicar Datas
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-[1.2] px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full text-left">
                      <label className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{t('header.search.service_type')}</label>
                      <span className="text-sm text-gray-600 dark:text-slate-400 block truncate">
                        {selectedCategoryId 
                          ? t('categories.' + (CATEGORIES.find(c => c.id === selectedCategoryId)?.slug || '')) || CATEGORIES.find(c => c.id === selectedCategoryId)?.label
                          : t('header.search.select_category')}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white dark:bg-slate-900 border dark:border-slate-800" align="center">
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.filter(c => c.type === serviceType).map(category => (
                        <button
                          key={category.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                            selectedCategoryId === category.id 
                              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium" 
                              : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300"
                          )}
                          onClick={() => setSelectedCategoryId(category.id)}
                        >
                          <category.icon className="w-4 h-4" />
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="pl-2 pr-2 py-2">
                <Button 
                  size="lg" 
                  className="rounded-full w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5 text-white" />
                  <span className="hidden lg:inline text-white">{t('header.search.search_button')}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close search */}
      {isSearchExpanded && (
        <div 
          className="fixed inset-0 bg-black/25 z-[-1] top-48"
          onClick={() => setIsSearchExpanded(false)}
        />
      )}
    </header>
  );
}
