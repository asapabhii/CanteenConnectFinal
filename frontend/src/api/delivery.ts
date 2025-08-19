import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchDeliveryOrders = async () => {
  const { data } = await apiClient.get('/delivery/active');
  return data;
};

export const useDeliveryOrders = () => {
  return useQuery({
    queryKey: ['deliveryOrders'],
    queryFn: fetchDeliveryOrders,
    refetchInterval: 15000,
  });
};

const updateOrderStatus = async ({ orderId, status }: { orderId: string, status: string }) => {
  const { data } = await apiClient.patch(`/delivery/${orderId}/status`, { status });
  return data;
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
            queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] });
        }
    });
}

// NEW HOOK
const cancelOrder = async (orderId: string) => {
    const { data } = await apiClient.patch(`/delivery/${orderId}/cancel`);
    return data;
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
            queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] });
        }
    });
}