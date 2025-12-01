import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function TripsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Suas Viagens</h1>
        <p className="mb-8 text-gray-600">Parabéns! Sua reserva foi realizada com sucesso.</p>
        <Link to="/">
          <Button>Explorar mais serviços</Button>
        </Link>
      </div>
    </div>
  );
}
