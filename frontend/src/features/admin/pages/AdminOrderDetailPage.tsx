import { Box, Card, CardContent, Chip, CircularProgress, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAdminOrder, useAdminUpdateOrderStatus } from '../../../api/orders';

export const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrder(id!);
  const updateStatusMutation = useAdminUpdateOrderStatus();

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({ orderId: id!, status: newStatus });
  };

  if (isLoading) return <CircularProgress />;
  if (!order) return <Typography>Order not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Order Details (#{order.id.slice(-6).toUpperCase()})</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
                <Typography variant="h6">Items</Typography>
                <Stack divider={<Divider />} spacing={1} sx={{mt: 1}}>
                    {order.items.map((item: any) => (
                        <Box key={item.id} sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography>{item.quantity} x {item.menuItem.name}</Typography>
                            <Typography>₹{item.priceAtTimeOfOrder.toFixed(2)}</Typography>
                        </Box>
                    ))}
                </Stack>
                <Divider sx={{my: 2}}/>
                <Typography variant="h6" sx={{textAlign: 'right'}}>Total: ₹{order.total.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Manage Order</Typography>
              <Stack spacing={2}>
                <Box>
                    <Typography variant="subtitle2">Customer</Typography>
                    <Typography>{order.user.profile?.name || order.user.email}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2">Outlet</Typography>
                    <Typography>{order.outlet.name}</Typography>
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={order.status}
                    label="Status"
                    onChange={(e) => handleStatusChange(e.target.value)}
                    size="small"
                  >
                    {['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'].map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};