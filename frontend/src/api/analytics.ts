import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';

const fetchAdminStats = async () => {
  const { data } = await apiClient.get('/analytics/admin-dashboard');
  return data;
};
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    refetchInterval: 30000,
  });
};

const fetchSalesChartData = async () => {
    const { data } = await apiClient.get('/analytics/sales-chart');
    return data;
}
export const useSalesChartData = () => {
    return useQuery({
        queryKey: ['salesChartData'],
        queryFn: fetchSalesChartData,
    });
}

const fetchVendorStats = async () => {
  const { data } = await apiClient.get('/analytics/vendor-dashboard');
  return data;
};
export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendorStats'],
    queryFn: fetchVendorStats,
    refetchInterval: 30000,
  });
};

const fetchVendorEarnings = async (startDate?: Date, endDate?: Date) => {
  const params = {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  };
  const { data } = await apiClient.get('/analytics/vendor-earnings', { params });
  return data;
};
export const useVendorEarnings = (startDate?: Date, endDate?: Date) => {
  return useQuery({
    queryKey: ['vendorEarnings', startDate, endDate],
    queryFn: () => fetchVendorEarnings(startDate, endDate),
  });
};

const fetchTopItems = async () => {
    const { data } = await apiClient.get('/analytics/top-items');
    return data;
}

export const useTopItems = () => {
    return useQuery({
        queryKey: ['topItems'],
        queryFn: fetchTopItems,
        refetchInterval: 60000, // Refresh every minute
    });
}