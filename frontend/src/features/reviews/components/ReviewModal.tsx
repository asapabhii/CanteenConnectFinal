import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useCreateReview } from '../../../api/reviews';

interface Order {
  id: string;
  outlet: {
    name: string;
  };
}

export const ReviewModal = ({ order, onClose }: { order: Order | null; onClose: () => void }) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  const createReviewMutation = useCreateReview();

  if (!order) return null;

  const handleSubmit = () => {
    if (!rating) {
      alert('Please select a rating.');
      return;
    }
    createReviewMutation.mutate({
      orderId: order.id,
      rating,
      comment
    }, {
      onSuccess: () => {
        alert('Thank you for your feedback!');
        onClose();
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to submit review: ${errorMessage}`);
      }
    });
  };

  return (
    <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Review your order from {order.outlet.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }} alignItems="center">
          <Rating 
            name="rating" 
            value={rating} 
            onChange={(_, newValue) => { setRating(newValue); }}
            size="large"
          />
          <TextField
            label="Leave a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={createReviewMutation.isPending}>
          {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};