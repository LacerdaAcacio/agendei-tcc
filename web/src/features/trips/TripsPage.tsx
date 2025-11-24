import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function TripsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Suas Viagens</h1>
        <p className="text-gray-600 mb-8">Parabéns! Sua reserva foi realizada com sucesso.</p>
        <Link to="/">
          <Button>Explorar mais serviços</Button>
        </Link>
      </div>
    </div>
  );
}
