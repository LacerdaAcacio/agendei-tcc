import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';

export function useProviderGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isProvider = user?.role === 'provider' || user?.role === 'admin';

  const checkProvider = (redirect = true) => {
    if (!isProvider) {
      if (redirect) {
        navigate('/become-host');
      }
      return false;
    }
    return true;
  };

  return {
    isProvider,
    checkProvider,
  };
}
