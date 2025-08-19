import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchKitchenOrders = async () => {
  const { data } = await apiClient.get('/kitchen/prepare');
  return data;
};

export const useKitchenOrders = () => {
  return useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: fetchKitchenOrders,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};