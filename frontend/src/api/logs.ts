import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchActivityLog = async () => {
  const { data } = await apiClient.get('/logs/activity');
  return data;
};

export const useActivityLog = () => {
  return useQuery({
    queryKey: ['activityLog'],
    queryFn: fetchActivityLog,
  });
};