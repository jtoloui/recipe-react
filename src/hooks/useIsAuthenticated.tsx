import { useState, useEffect } from 'react';
import axios from 'axios';

export const useIsAuthenticated = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          'https://localhost:3001/auth/authenticated',
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(res.data.isAuthenticated);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};
