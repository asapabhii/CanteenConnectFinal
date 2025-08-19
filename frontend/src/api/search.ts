import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';

const searchAll = async (query: string) => {
  if (!query) return null; // Don't search if the query is empty
  const { data } = await apiClient.get('/search', { params: { q: query } });
  return data;
};

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchAll(query),
    enabled: !!query, // Only run the query if there is a search term
  });
};