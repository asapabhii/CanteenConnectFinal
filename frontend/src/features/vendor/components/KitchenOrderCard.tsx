import { Button, Card, CardActions, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useUpdateOrderStatus } from '../../../api/delivery';

export const KitchenOrderCard = ({ order }: { order: any }) => {
    const updateStatusMutation = useUpdateOrderStatus();

    const handleMarkAsPreparing = () => {
        updateStatusMutation.mutate({ orderId: order.id, status: 'PREPARING' });
    }

  return (
    <Card sx={{ backgroundColor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Order #{order.id.slice(-6).toUpperCase()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            For: {order.user?.profile?.name || order.user?.email}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Pickup: {new Date(order.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{fontWeight: 'bold'}}>Items:</Typography>
        <Stack spacing={0.5}>
          {order.items.map((item: any) => (
            <Typography key={item.id} variant="body2">
              - {item.quantity} x {item.menuItem.name}
            </Typography>
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Button 
            size="small" 
            variant="contained" 
            onClick={handleMarkAsPreparing}
            disabled={updateStatusMutation.isPending}
        >
            Mark as Preparing
        </Button>
      </CardActions>
    </Card>
  );
};