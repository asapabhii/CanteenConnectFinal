import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useKitchenOrders } from '../../../api/kitchen';
import { KitchenOrderCard } from '../components/KitchenOrderCard';
import { useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';
import toast from 'react-hot-toast';

export const VendorKdsPage = () => {
  const { data: orders, isLoading } = useKitchenOrders();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (socket && user?.outletId) {
      socket.emit('joinOutletRoom', user.outletId);

      // Handler for when a new order comes in
      const handleNewOrder = (newOrder: any) => {
        // Only trigger for the correct outlet
        if (newOrder.outletId === user.outletId) {
          toast.success('New Order Received!', { duration: 5000 });
          new Audio('/notification.mp3').play();
          queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
          queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] });
          queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
        }
      };

      // Handler for when an existing order is updated
      const handleOrderUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
        queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] });
        queryClient.invalidateQueries({ queryKey: ['vendorStats'] });
      };

      socket.on('newOrder', handleNewOrder);
      socket.on('orderUpdate', handleOrderUpdate);

      return () => {
        socket.off('newOrder', handleNewOrder);
        socket.off('orderUpdate', handleOrderUpdate);
      };
    }
  }, [socket, queryClient, user?.outletId]);

  if (isLoading && !orders) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Kitchen Display System (Live)</Typography>
      {orders?.length === 0 && (
        <Typography>No orders to prepare right now.</Typography>
      )}
      <Grid container spacing={2}>
        {orders?.map((order: any) => (
          <Grid item key={order.id} xs={12} sm={6} md={4}>
            <KitchenOrderCard order={order} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};