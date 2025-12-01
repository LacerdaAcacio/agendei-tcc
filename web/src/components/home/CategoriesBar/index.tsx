import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/useCategories';
import { getCategoryIcon } from '@/utils/category-icons';
import { useCategoriesBar } from './useCategoriesBar';

export function CategoriesBar() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const filterType = (searchParams.get('type') as 'presential' | 'digital') || 'presential';
  const { categories, isLoading } = useCategories();

  const {
    scrollRef,
    showLeftArrow,
    showRightArrow,
    selectedCategory,
    onSelectCategory,
    scroll,
    checkScroll,
  } = useCategoriesBar(filterType);

  if (isLoading) return null;

  return (
    <div className="sticky top-20 z-40 border-b bg-white pb-2 pt-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="group relative mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 z-10 hidden h-8 w-8 rounded-full border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800 md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-slate-200" />
          </Button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="no-scrollbar flex w-full justify-start gap-4 overflow-x-auto scroll-smooth px-4 md:justify-center md:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.slug || category.icon);
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.slug)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 transition-all',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700',
                )}
              >
                <Icon className={cn('h-4 w-4', isSelected ? 'stroke-[2.5px]' : 'stroke-[2px]')} />
                <span className={cn('text-sm font-medium', isSelected && 'font-semibold')}>
                  {t(`categories.${category.slug}`, { defaultValue: category.name })}
                </span>
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 z-10 hidden h-8 w-8 rounded-full border-gray-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800 md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-slate-200" />
          </Button>
        )}
      </div>
    </div>
  );
}
