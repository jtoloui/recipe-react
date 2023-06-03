import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';

type Profile = {
  name: string;
  email: string;
  id: string;
  nickname: string;
};
const fetchProfile = async (): Promise<Profile> => {
  const response = await axios.get<Profile>('/api/profile');
  console.log(response.data);

  return response.data;
};

export const useProfile = (): UseQueryResult<Profile, Error> => {
  return useQuery<Profile, Error>('profile', fetchProfile);
};
