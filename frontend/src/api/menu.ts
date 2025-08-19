import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// For the INVENTORY page (gets all items)
const fetchVendorInventory = async () => {
  const { data } = await apiClient.get('/menu');
  return data;
};
export const useVendorInventory = () => {
  return useQuery({ queryKey: ['vendorInventory'], queryFn: fetchVendorInventory });
};

// For the LIVE MENU page (gets available items)
const fetchVendorLiveMenu = async () => {
  const { data } = await apiClient.get('/menu/live');
  return data;
};
export const useVendorLiveMenu = () => {
  return useQuery({ queryKey: ['vendorLiveMenu'], queryFn: fetchVendorLiveMenu });
};

// Mutations remain the same, but we invalidate both queries on success
const createMenuItem = async (itemData: any) => {
  const { data } = await apiClient.post('/menu', itemData);
  return data;
};
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: createMenuItem, 
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendorInventory'] });
        queryClient.invalidateQueries({ queryKey: ['vendorLiveMenu'] });
    } 
  });
};

const updateMenuItem = async ({ itemId, data }: { itemId: string, data: any }) => {
  const response = await apiClient.patch(`/menu/${itemId}`, data);
  return response.data;
};
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: updateMenuItem, 
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendorInventory'] });
        queryClient.invalidateQueries({ queryKey: ['vendorLiveMenu'] });
    } 
  });
};

const deleteMenuItem = async (itemId: string) => {
  const { data } = await apiClient.delete(`/menu/${itemId}`);
  return data;
};
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({ 
    mutationFn: deleteMenuItem, 
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendorInventory'] });
        queryClient.invalidateQueries({ queryKey: ['vendorLiveMenu'] });
    } 
  });
};

const toggleItemAvailability = async (itemId: string) => {
  const { data } = await apiClient.patch(`/menu/${itemId}/availability`);
  return data;
};
export const useToggleItemAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleItemAvailability,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vendorInventory'] });
        queryClient.invalidateQueries({ queryKey: ['vendorLiveMenu'] });
    }
  });
};