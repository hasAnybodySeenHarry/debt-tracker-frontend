import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { replace: true });
      return null;
    }
    return token;
  }, [navigate]);

  return getToken;
};
