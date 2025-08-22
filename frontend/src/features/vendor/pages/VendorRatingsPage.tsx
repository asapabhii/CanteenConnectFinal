import { Box, Card, CardContent, CircularProgress, Grid, Rating, Stack, Typography } from '@mui/material';
import { useVendorReviews } from '../../../api/reviews';
import { useMemo } from 'react';
import { StatCard } from '../../admin/components/StatCard';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    profile?: {
      name: string;
    };
  };
}

export const VendorRatingsPage = () => {
  const { data: reviews, isLoading } = useVendorReviews();

  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }
    const totalRatings = reviews.length;
    const sumOfRatings = reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
    const averageRating = sumOfRatings / totalRatings;
    return { averageRating, totalRatings };
  }, [reviews]);

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Ratings & Feedback</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
            <StatCard title="Average Rating" value={`${stats.averageRating.toFixed(1)} / 5`} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
            <StatCard title="Total Ratings Received" value={stats.totalRatings} />
        </Grid>
      </Grid>

      <Stack spacing={2}>
        {reviews?.map((review: Review) => (
            <Card key={review.id} variant="outlined">
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 1}}>
                        <Typography variant="subtitle1">{review.user.profile?.name || 'Anonymous'}</Typography>
                        <Rating value={review.rating} readOnly />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{mt: 1}}>{review.comment || 'No comment left.'}</Typography>
                </CardContent>
            </Card>
        ))}
      </Stack>
    </Box>
  );
};