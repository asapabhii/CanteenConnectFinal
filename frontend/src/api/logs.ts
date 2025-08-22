import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';

interface LogEntry {
  id: string;
  createdAt: string;
  actorName: string;
  action: string;
  targetId: string;
  details: unknown;
}

const fetchActivityLog = async (): Promise<LogEntry[]> => {
  const { data } = await apiClient.get('/admin/activity-logs');
  return data;
};

export const useActivityLog = () => {
  return useQuery({
    queryKey: ['activityLogs'],
    queryFn: fetchActivityLog,
  });
};
