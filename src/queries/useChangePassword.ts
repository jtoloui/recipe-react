import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { axiosInstance } from '@/utils';

type ChangePasswordInput = {
  previousPassword: string;
  proposedPassword: string;
};

/**
 * POST /api/auth/change-password — in-app password change for a logged-in user
 * (current + new password; NOT the pre-login email-code reset flow).
 * Surfaces the server's message on failure (e.g. "Current password is
 * incorrect").
 */
export const useChangePassword = () =>
  useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      try {
        const res = await axiosInstance.post('/api/auth/change-password', input);
        return res.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ?? 'Could not change password'
          );
        }
        throw error;
      }
    },
  });

export default useChangePassword;
