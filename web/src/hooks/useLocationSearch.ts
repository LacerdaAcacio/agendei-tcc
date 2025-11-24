import { useState, useEffect } from 'react';

// Mock data for fallback
const FALLBACK_LOCATIONS = [
  { label: "Ponta Grossa, PR", lat: -25.0945, lon: -50.1633 },
  { label: "Curitiba, PR", lat: -25.4284, lon: -49.2733 },
  { label: "São Paulo, SP", lat: -23.5505, lon: -46.6333 },
  { label: "Rio de Janeiro, RJ", lat: -22.9068, lon: -43.1729 },
  { label: "Florianópolis, SC", lat: -27.5954, lon: -48.5480 },
  { label: "Belo Horizonte, MG", lat: -19.9167, lon: -43.9345 },
];

export interface LocationResult {
  label: string;
  lat: number;
  lon: number;
}

export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simple debounce implementation since we might not have a hook yet
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        // Try Nominatim API first
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=br`
        );
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const mappedResults = data.map((item: any) => ({
            label: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon)
          }));
          setResults(mappedResults);
        } else {
          // Fallback if API returns empty
          throw new Error('No results from API');
        }
      } catch (error) {
        // Fallback to mock data
        console.warn("Using fallback location data", error);
        const filtered = FALLBACK_LOCATIONS.filter(loc => 
          loc.label.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading
  };
}
