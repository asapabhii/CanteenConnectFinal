import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// --- CUSTOMER HOOK ---
interface CreateReviewData {
  orderId: string;
  rating: number;
  comment?: string;
}

const createReview = async (reviewData: CreateReviewData) => {
  const { data } = await apiClient.post('/reviews', reviewData);
  return data;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
};


// --- VENDOR HOOK ---
const fetchVendorReviews = async () => {
    const { data } = await apiClient.get('/reviews/my-outlet');
    return data;
}

export const useVendorReviews = () => {
    return useQuery({
        queryKey: ['vendorReviews'],
        queryFn: fetchVendorReviews,
    });
}