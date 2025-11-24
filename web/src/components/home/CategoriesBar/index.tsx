import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from './constants';
import { useCategoriesBar } from './useCategoriesBar';

export function CategoriesBar() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const filterType = (searchParams.get('type') as 'presential' | 'digital') || 'presential';
  
  const {
    scrollRef,
    showLeftArrow,
    showRightArrow,
    selectedCategory,
    onSelectCategory,
    scroll,
    checkScroll
  } = useCategoriesBar(filterType);

  return (
    <div className="sticky top-20 z-40 bg-white dark:bg-slate-900 border-b dark:border-slate-800 shadow-sm pt-4 pb-2" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center group">
        
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 z-10 rounded-full h-8 w-8 bg-white dark:bg-slate-800 shadow-md border-gray-200 dark:border-slate-700 hidden md:flex"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-slate-200" />
          </Button>
        )}

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar w-full px-4 md:px-12 scroll-smooth justify-start md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.filter(cat => cat.type === filterType).map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap",
                  isSelected 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm"
                )}
              >
                <Icon className={cn("w-4 h-4", isSelected ? "stroke-[2.5px]" : "stroke-[2px]")} />
                <span className={cn("text-sm font-medium", isSelected && "font-semibold")}>
                  {t(`categories.${category.slug}`)}
                </span>
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 z-10 rounded-full h-8 w-8 bg-white shadow-md border-gray-200 dark:bg-slate-800 dark:border-slate-700 hidden md:flex"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-slate-200" />
          </Button>
        )}
      </div>
    </div>
  );
}

export { CATEGORIES } from './constants';
