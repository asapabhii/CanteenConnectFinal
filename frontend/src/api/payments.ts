import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const verifyPayment = async (data: any) => {
  const response = await apiClient.post('/payments/verify', data);
  return response.data;
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
};