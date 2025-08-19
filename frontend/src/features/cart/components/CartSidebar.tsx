import { Avatar, Box, Button, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { useCartStore } from '../useCartStore';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';

export const CartSidebar = () => {
  const { isOpen, closeCart, items, addItem, decreaseItem, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
    closeCart();
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeCart}>
      <Box sx={{ width: 350, p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={closeCart}><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />

        {items.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <Stack spacing={3} sx={{ mb: 2 }}>
            {items.map(({ item, quantity }) => (
              <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                <Avatar src={item.imageUrl || ''} variant="rounded" />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight="medium">{item.name}</Typography>
                  <Typography color="text.secondary">₹{item.price.toFixed(2)}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => decreaseItem(item.id)}>
                    <RemoveCircleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography>{quantity}</Typography>
                  <IconButton size="small" onClick={() => addItem(item)}>
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">₹{getTotalPrice().toFixed(2)}</Typography>
        </Stack>
        <Button variant="contained" fullWidth onClick={handleCheckout} disabled={items.length === 0}>
          Proceed to Checkout
        </Button>
      </Box>
    </Drawer>
  );
};