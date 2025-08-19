import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchOutlets = async () => {
  const { data } = await apiClient.get('/outlets');
  return data;
};

const fetchOutletById = async (outletId: string, category?: string) => {
  const params = category ? { category } : {};
  const { data } = await apiClient.get(`/outlets/${outletId}`, { params });
  return data;
};

export const useOutlets = () => {
  return useQuery({
    queryKey: ['outlets'],
    queryFn: fetchOutlets,
  });
};

export const useOutlet = (outletId: string, category?: string) => {
  return useQuery({
    queryKey: ['outlet', outletId, category],
    queryFn: () => fetchOutletById(outletId, category),
    enabled: !!outletId,
  });
};

const updateOutlet = async ({ outletId, data }: { outletId: string, data: any }) => {
  const response = await apiClient.patch(`/outlets/${outletId}`, data);
  return response.data;
};

export const useUpdateOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOutlet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};

const createOutlet = async (data: any) => {
  const response = await apiClient.post('/outlets', data);
  return response.data;
};

export const useCreateOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOutlet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};