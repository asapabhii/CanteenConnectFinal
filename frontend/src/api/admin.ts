import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const onboardVendor = async (data: any) => {
  const response = await apiClient.post('/admin/onboard-vendor', data);
  return response.data;
};

export const useOnboardVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardVendor,
    onSuccess: () => {
      // Refetch both users and outlets after successful onboarding
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};