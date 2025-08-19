import { Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMyOrders } from '../api/orders';
import { ReviewModal } from '../features/reviews/components/ReviewModal';

export const MyOrdersPage = () => {
  const { data: orders, isLoading } = useMyOrders();
  const [reviewingOrder, setReviewingOrder] = useState<any | null>(null);

  if (isLoading) return <CircularProgress />;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Order History</Typography>
      <Stack spacing={2}>
        {orders?.map((order: any) => (
          <Card key={order.id} variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{order.outlet.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {order.id.slice(-6).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6">₹{order.total.toFixed(2)}</Typography>
                  <Chip label={order.status.replace(/_/g, ' ')} size="small" />
                </Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              {order.status === 'COMPLETED' && !order.review && (
                <Button size="small" onClick={() => setReviewingOrder(order)}>
                  Leave a Review
                </Button>
              )}
              {order.review && (
                <Typography variant="body2" sx={{ pr: 1 }} color="text.secondary">
                  Reviewed
                </Typography>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
      <ReviewModal order={reviewingOrder} onClose={() => setReviewingOrder(null)} />
    </Container>
  );
};