import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchUsers = async (search = '') => {
  const { data } = await apiClient.get('/users', { params: { search } });
  return data;
};

export const useUsers = (search = '') => {
  return useQuery({
    queryKey: ['users', search],
    queryFn: () => fetchUsers(search),
  });
};

const fetchUserById = async (userId: string) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });
};

const updateUserRole = async ({ userId, role }: { userId: string; role: string }) => {
  const { data } = await apiClient.patch(`/users/${userId}/role`, { role });
  return data;
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};

const toggleUserBlock = async (userId: string) => {
  const { data } = await apiClient.patch(`/users/${userId}/toggle-block`);
  return data;
};

export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserBlock,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

const assignOutlet = async ({ userId, outletId }: { userId: string, outletId: string | null }) => {
  const { data } = await apiClient.patch(`/users/${userId}/assign-outlet`, { outletId });
  return data;
}

export const useAssignOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: assignOutlet,
      onSuccess: (_, variables) => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
          queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      }
  });
}