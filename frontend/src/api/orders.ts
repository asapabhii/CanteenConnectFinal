import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// --- CUSTOMER HOOKS ---
const placeOrder = async (orderData: any) => {
  const { data } = await apiClient.post('/orders', orderData);
  return data;
};
export const usePlaceOrder = () => {
  return useMutation({ mutationFn: placeOrder });
};

const fetchMyOrders = async () => {
    const { data } = await apiClient.get('/orders/my-history');
    return data;
}
export const useMyOrders = () => {
    return useQuery({ queryKey: ['myOrders'], queryFn: fetchMyOrders });
}

// --- ADMIN HOOKS ---
const fetchAdminOrders = async (search = '') => {
    const { data } = await apiClient.get('/orders/admin/all', { params: { search } });
    return data;
}
export const useAdminOrders = (search = '') => {
    return useQuery({
        queryKey: ['adminOrders', search],
        queryFn: () => fetchAdminOrders(search),
    });
}

const fetchAdminOrderById = async (orderId: string) => {
    const { data } = await apiClient.get(`/orders/admin/${orderId}`);
    return data;
}
export const useAdminOrder = (orderId: string) => {
    return useQuery({
        queryKey: ['adminOrder', orderId],
        queryFn: () => fetchAdminOrderById(orderId),
        enabled: !!orderId,
    });
}

const updateAdminOrderStatus = async ({ orderId, status }: { orderId: string, status: string }) => {
    const { data } = await apiClient.patch(`/orders/admin/${orderId}/status`, { status });
    return data;
}
export const useAdminUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAdminOrderStatus,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            queryClient.invalidateQueries({ queryKey: ['adminOrder', variables.orderId] });
        }
    });
}