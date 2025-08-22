import { Box, Button, Container, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useCartStore } from '../features/cart/useCartStore';
import { useState } from 'react';
import { TimeSlotPicker } from '../features/checkout/components/TimeSlotPicker';
import { usePlaceOrder } from '../api/orders';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useVerifyPayment } from '../api/payments';
import { AnimatedPage } from '../components/common/AnimatedPage';

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const CheckoutPage = () => {
  const { items, getTotalPrice, removeAllItems } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const outletId = items.length > 0 ? items[0].item.outletId : '';

  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'PREPAID'>('COD');

  const placeOrderMutation = usePlaceOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const handlePlaceOrder = () => {
    if (!selectedSlot) {
      alert('Please select a pickup time slot.');
      return;
    }

    placeOrderMutation.mutate({
      outletId,
      slotTime: selectedSlot,
      paymentMode,
      items: items.map(cartItem => ({ 
        menuItemId: cartItem.item.id,
        quantity: cartItem.quantity
      }))
    }, {
      onSuccess: (data) => {
        if (paymentMode === 'COD') {
          alert('Order placed successfully!');
          removeAllItems();
          navigate(`/order-confirmation/${data.id}`);
          return;
        }

        if (paymentMode === 'PREPAID' && data.razorpayOrderDetails) {
          const options = {
            key: 'rzp_test_qhJBblcOzeuVwB', // Replace with your Key ID
            amount: data.razorpayOrderDetails.amount,
            currency: "INR",
            name: "Christ Canteen Connect",
            description: `Order #${data.id.slice(-6)}`,
            order_id: data.razorpayOrderDetails.id,
            handler: function (response: RazorpayResponse) {
              verifyPaymentMutation.mutate({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }, {
                onSuccess: (verificationData) => {
                  alert('Payment successful! Order confirmed.');
                  removeAllItems();
                  navigate(`/order-confirmation/${verificationData.orderId}`);
                },
                onError: () => {
                  alert('Payment verification failed. Please contact support.');
                }
              });
            },
            prefill: {
              name: user?.profile?.name,
              email: user?.email,
            },
            theme: {
                color: "#3f51b5"
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (){
                alert('Payment failed. Please try again.');
          });
          rzp.open();
        }
      },
      onError: (error: unknown) => {
        const errorMsg = error instanceof Error ? error.message : 'Failed to place order';
        alert(`Error: ${errorMsg}`);
      }
    });
  };

  if (items.length === 0) {
    return (
      <AnimatedPage>
        <Container sx={{py: 4}}>
          <Typography variant="h5">Your cart is empty.</Typography>
          <Button onClick={() => navigate('/')}>Go back to shopping</Button>
        </Container>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <Container sx={{ py: 4, maxWidth: '600px !important' }}>
        <Typography variant="h4" gutterBottom>Checkout</Typography>
        <Box component="div" sx={{ p: 2, border: '1px solid grey', borderRadius: 2 }}>
          <Stack divider={<Divider sx={{ my: 1 }} />}>
            {items.map(({ item, quantity }) => (
              <Stack key={item.id} direction="row" justifyContent="space-between">
                <Typography>{quantity} x {item.name}</Typography>
                <Typography>₹{(item.price * quantity).toFixed(2)}</Typography>
              </Stack>
            ))}
            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{getTotalPrice().toFixed(2)}</Typography>
            </Stack>
          </Stack>
        </Box>

        <TimeSlotPicker selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />

        <FormControl margin="normal">
          <FormLabel>Payment Mode</FormLabel>
          <RadioGroup
            row
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as 'COD' | 'PREPAID')}
          >
            <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
            <FormControlLabel value="PREPAID" control={<Radio />} label="Pay Online" />
          </RadioGroup>
        </FormControl>

        <Button 
          variant="contained" 
          size="large" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending || verifyPaymentMutation.isPending}
        >
          {placeOrderMutation.isPending ? 'Preparing Order...' : 'Place Order'}
        </Button>
      </Container>
    </AnimatedPage>
  );
};