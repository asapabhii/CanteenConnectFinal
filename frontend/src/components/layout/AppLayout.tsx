import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography, Alert } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../../features/cart/useCartStore';
import { CartSidebar } from '../../features/cart/components/CartSidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const AppLayout = () => {
  const { openCart, items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout } = useAuthStore();

  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (socket && user) {
      // Authenticate this client with the server to join the user-specific room
      socket.emit('authenticate', user.id);

      // Listen for order updates
      const handleOrderUpdate = (updatedOrder: any) => {
        // Only show notification if the update is for the current user
        if (updatedOrder.userId === user.id) {
          const status = updatedOrder.status.replace(/_/g, ' ').toLowerCase();
          toast.success(`Your order status is now: ${status}`);
          // Refresh the user's order history
          queryClient.invalidateQueries({ queryKey: ['myOrders'] });
        }
      };

      socket.on('orderUpdate', handleOrderUpdate);
      
      return () => {
        socket.off('orderUpdate', handleOrderUpdate);
      };
    }
  }, [socket, user, queryClient]);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Christ Canteen Connect
          </Typography>
          <Button component={Link} to="/my-orders" color="inherit">My Orders</Button>
          <IconButton color="inherit" onClick={openCart}>
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      
      {user?.isBlocked && (
        <Alert severity="error" sx={{borderRadius: 0}}>
            Your account is blocked due to unpaid penalties. 
            <Button component={Link} to="/pay-penalty" size="small" color="inherit" sx={{fontWeight: 'bold', ml: 1}}>
                Pay Now
            </Button>
        </Alert>
      )}

      <CartSidebar />
      <main>
        <Outlet />
      </main>
    </Box>
  );
};