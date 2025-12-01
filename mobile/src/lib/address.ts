import axios from 'axios';

interface BrasilAPIAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export async function fetchAddressByCEP(cep: string): Promise<BrasilAPIAddress | null> {
  try {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      return null;
    }

    const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cleanCEP}`);
    
    return {
      cep: response.data.cep,
      state: response.data.state,
      city: response.data.city,
      neighborhood: response.data.neighborhood,
      street: response.data.street,
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return null;
  }
}

export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) {
    return numbers;
  }
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

export interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export async function searchAddress(query: string): Promise<NominatimResult[]> {
  try {
    if (!query || query.length < 3) return [];

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        q: query,
        limit: 5,
        countrycodes: 'br',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'AgendeiMobile/1.0',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
}

export function createDefaultAvailability() {
  return {
    monday: { active: true, start: '08:00', end: '18:00' },
    tuesday: { active: true, start: '08:00', end: '18:00' },
    wednesday: { active: true, start: '08:00', end: '18:00' },
    thursday: { active: true, start: '08:00', end: '18:00' },
    friday: { active: true, start: '08:00', end: '18:00' },
    saturday: { active: false, start: '08:00', end: '18:00' },
    sunday: { active: false, start: '08:00', end: '18:00' },
  };
}
