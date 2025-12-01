import { MyServiceCard } from './MyServiceCard';
import type { Service } from '@/types';

interface MyServiceListProps {
  services: Service[];
  onDelete: (id: string) => void;
}

export function MyServiceList({ services, onDelete }: MyServiceListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <MyServiceCard key={service.id} service={service} onDelete={onDelete} />
      ))}
    </div>
  );
}
