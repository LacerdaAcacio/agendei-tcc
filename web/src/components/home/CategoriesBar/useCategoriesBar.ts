import { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useCategoriesBar(filterType: 'presential' | 'digital') {
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const selectedCategory = searchParams.get('category');

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // -10 buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filterType]);

  const onSelectCategory = (id: string) => {
    if (id === 'favoritos') {
      window.location.href = '/wishlists';
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === id) {
      newParams.delete('category');
    } else {
      newParams.set('category', id);
    }
    setSearchParams(newParams);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return {
    scrollRef,
    showLeftArrow,
    showRightArrow,
    selectedCategory,
    onSelectCategory,
    scroll,
    checkScroll,
  };
}
