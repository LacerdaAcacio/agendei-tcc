import { useState, useEffect, useRef, useMemo } from 'react';
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
  FieldValues,
} from 'react-hook-form';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface AddressFormProps {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors<FieldValues>;
}

function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onDragEnd(lat, lng);
        }
      },
    }),
    [onDragEnd],
  );

  return (
    <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}>
      <Popup>Arraste para ajustar a localização exata.</Popup>
    </Marker>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

const DEFAULT_LAT = -25.0916; // Ponta Grossa
const DEFAULT_LNG = -50.1668; // Ponta Grossa

export function AddressForm({ register, setValue, watch, errors }: AddressFormProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const zipCode = watch('addressZipCode');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  // Default to São Paulo if no coordinates (initial state)
  const mapCenter: [number, number] =
    latitude && longitude ? [latitude, longitude] : [-23.55052, -46.633308];

  // Watch for CEP changes
  useEffect(() => {
    const fetchAddressByCep = async (cep: string) => {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;

      setIsLoadingCep(true);
      try {
        const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
        const data = response.data;

        setValue('addressStreet', data.street);
        setValue('addressNeighborhood', data.neighborhood);
        setValue('addressCity', data.city);
        setValue('addressState', data.state);

        let lat = DEFAULT_LAT;
        let lng = DEFAULT_LNG;
        let coordinatesFound = false;

        if (data.location?.coordinates) {
          const { latitude, longitude } = data.location.coordinates;
          // BrasilAPI v2 returns coordinates as strings sometimes, ensure float
          const parsedLat = parseFloat(latitude);
          const parsedLng = parseFloat(longitude);

          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            lat = parsedLat;
            lng = parsedLng;
            coordinatesFound = true;
          }
        }

        setValue('latitude', lat);
        setValue('longitude', lng);

        // Focus on number field
        const numberInput = document.getElementById('addressNumber');
        if (numberInput) numberInput.focus();

        if (coordinatesFound) {
          toast.success('Endereço encontrado!');
        } else {
          toast.info('Endereço encontrado! Ajuste o pino no mapa se necessário.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('CEP não encontrado ou erro na busca.');
      } finally {
        setIsLoadingCep(false);
      }
    };

    if (zipCode && zipCode.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(zipCode);
    }
  }, [zipCode, setValue]);

  const handleManualDrag = (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="addressZipCode">CEP</Label>
          <div className="relative">
            <MaskedInput
              mask="cep"
              id="addressZipCode"
              placeholder="00000-000"
              {...register('addressZipCode')}
              onChange={(e) => {
                register('addressZipCode').onChange(e);
                // Trigger fetch is handled by useEffect
              }}
              className={errors.addressZipCode ? 'border-red-500' : ''}
            />
            {isLoadingCep && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {errors.addressZipCode && (
            <p className="text-sm text-red-500">{errors.addressZipCode.message as string}</p>
          )}
        </div>

        {/* Rua */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressStreet">Rua / Avenida</Label>
          <Input
            id="addressStreet"
            {...register('addressStreet')}
            placeholder="Nome da rua"
            className={errors.addressStreet ? 'border-red-500' : ''}
          />
          {errors.addressStreet && (
            <p className="text-sm text-red-500">{errors.addressStreet.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Número */}
        <div className="space-y-2">
          <Label htmlFor="addressNumber">Número</Label>
          <Input
            id="addressNumber"
            {...register('addressNumber')}
            placeholder="123"
            className={errors.addressNumber ? 'border-red-500' : ''}
          />
          {errors.addressNumber && (
            <p className="text-sm text-red-500">{errors.addressNumber.message as string}</p>
          )}
        </div>

        {/* Complemento */}
        <div className="space-y-2 md:col-span-1">
          <Label htmlFor="addressComplement">
            Complemento <span className="text-xs text-gray-400">(Opcional)</span>
          </Label>
          <Input
            id="addressComplement"
            {...register('addressComplement')}
            placeholder="Apto 101, Bloco B"
          />
        </div>

        {/* Bairro */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressNeighborhood">Bairro</Label>
          <Input
            id="addressNeighborhood"
            {...register('addressNeighborhood')}
            placeholder="Bairro"
            className={errors.addressNeighborhood ? 'border-red-500' : ''}
          />
          {errors.addressNeighborhood && (
            <p className="text-sm text-red-500">{errors.addressNeighborhood.message as string}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Cidade */}
        <div className="space-y-2">
          <Label htmlFor="addressCity">Cidade</Label>
          <Input
            id="addressCity"
            {...register('addressCity')}
            placeholder="Cidade"
            readOnly // Usually read-only from CEP, but can be editable if needed
            className="bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label htmlFor="addressState">Estado (UF)</Label>
          <Input
            id="addressState"
            {...register('addressState')}
            placeholder="UF"
            readOnly
            className="bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Map Confirmation */}
      <div className="space-y-2">
        <Label>Confirme a localização no mapa</Label>
        <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-lg border border-gray-200">
          <MapContainer
            center={mapCenter}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker position={mapCenter} onDragEnd={handleManualDrag} />
            <MapUpdater center={mapCenter} />
          </MapContainer>
        </div>
        <p className="text-xs text-gray-500">
          Se a localização automática não estiver exata, arraste o pino para a posição correta.
        </p>
      </div>
    </div>
  );
}
