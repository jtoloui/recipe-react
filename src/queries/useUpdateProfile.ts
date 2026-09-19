import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '@/utils';

type UpdateProfileInput = { name: string };

/**
 * PUT /api/profile — update the display name, then refetch the profile.
 * Uses axiosInstance (baseURL already resolves the API host), so the path is
 * relative — no manual base concatenation.
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const res = await axiosInstance.put('/api/profile', input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export default useUpdateProfile;
