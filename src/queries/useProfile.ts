import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Profile = {
  name: string;
  email: string;
  id: string;
  nickname: string;
};
const fetchProfile = async (): Promise<Profile> => {
  const response = await axios.get<Profile>(
    `${import.meta.env.VITE_API_URI}/api/profile`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const useProfile = (): UseQueryResult<Profile, Error> => {
  return useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });
};
