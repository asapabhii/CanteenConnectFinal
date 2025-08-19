import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import { useCancelOrder } from '../../../api/delivery';

export const OrderDetailModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const cancelMutation = useCancelOrder();

  if (!order) return null;
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? This cannot be undone.')) {
        cancelMutation.mutate(order.id, {
            onSuccess: () => {
                onClose(); // Close the modal after successful cancellation
            }
        });
    }
  }

  const canBeCancelled = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

  return (
    <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Order Details (#{order.id.slice(-6).toUpperCase()})</DialogTitle>
      <DialogContent>
        <Stack spacing={1} divider={<Divider />}>
          <Box sx={{py: 1}}>
            <Typography variant="subtitle2">Customer:</Typography>
            <Typography>{order.user?.profile?.name || order.user?.email}</Typography>
          </Box>
          <Box sx={{py: 1}}>
            <Typography variant="subtitle2">Items:</Typography>
            {order.items.map((item: any) => (
              <Typography key={item.id} variant="body2">
                {item.quantity} x {item.menuItem.name} (₹{item.priceAtTimeOfOrder})
              </Typography>
            ))}
          </Box>
          <Box sx={{py: 1}}>
            <Typography variant="subtitle2">Total Amount:</Typography>
            <Typography variant="h6">₹{order.total.toFixed(2)}</Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{justifyContent: 'space-between', px: 3, pb: 2}}>
        <Button 
            onClick={handleCancel} 
            color="error" 
            disabled={!canBeCancelled || cancelMutation.isPending}
        >
          {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
        </Button>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};