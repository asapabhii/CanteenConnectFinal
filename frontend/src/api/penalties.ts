import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';
import { useVerifyPayment } from './payments'; // <-- ADD THIS IMPORT

const fetchUnpaidPenalties = async () => {
  const { data } = await apiClient.get('/payments/my-penalties');
  return data;
};
export const useUnpaidPenalties = () => {
  return useQuery({ queryKey: ['penalties'], queryFn: fetchUnpaidPenalties });
};

const createPenaltyPayment = async (penaltyId: string) => {
  const { data } = await apiClient.post(`/payments/penalties/${penaltyId}/pay`);
  return data;
};
export const useCreatePenaltyPayment = () => {
  return useMutation({ mutationFn: createPenaltyPayment });
};

// Reuse the verification logic from the payments API
export const useVerifyPenaltyPayment = useVerifyPayment;