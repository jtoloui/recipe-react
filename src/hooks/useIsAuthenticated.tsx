import axios from 'axios';
import { useEffect, useState } from 'react';

export const useIsAuthenticated = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/auth/authenticated`,
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
