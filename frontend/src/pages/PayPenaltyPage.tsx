import { Button, Card, CardContent, CircularProgress, Container, Typography } from '@mui/material';
import { useUnpaidPenalties, useCreatePenaltyPayment, useVerifyPenaltyPayment } from '../api/penalties';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/apiClient';

export const PayPenaltyPage = () => {
    const { data: penalties, isLoading } = useUnpaidPenalties();
    const createPaymentMutation = useCreatePenaltyPayment();
    const verifyPaymentMutation = useVerifyPenaltyPayment();
    const { setToken } = useAuthStore();

    const handlePay = (penalty: { id: string; amount: number; orderId: string }) => {
        createPaymentMutation.mutate(penalty.id, {
            onSuccess: (razorpayOrder) => {
                const options = {
                    key: 'rzp_test_qhJBblcOzeuVwB', // Replace with your key
                    amount: razorpayOrder.amount,
                    order_id: razorpayOrder.id,
                    name: "Pay Penalty - Christ Canteen",
                    handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
                        verifyPaymentMutation.mutate({ ...response }, {
                            onSuccess: () => {
                                alert('Payment successful! Your account is now unblocked.');
                                // Refetch user profile to update block status
                                apiClient.get('/users/me').then((res: { data: { token: string } }) => setToken(useAuthStore.getState().token!, res.data));
                            }
                        })
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        })
    }

    if (isLoading) return <CircularProgress />;
    if (!penalties || penalties.length === 0) {
        return (
            <Container sx={{py: 4}}>
                <Typography variant="h4">No Unpaid Penalties</Typography>
                <Typography>Your account is active.</Typography>
            </Container>
        );
    }

  return (
    <Container sx={{py: 4}}>
        <Typography variant="h4" color="error" gutterBottom>Account Blocked</Typography>
        <Typography>You have unpaid penalties. Please pay them to continue ordering.</Typography>
        {penalties.map((penalty: { id: string; amount: number; orderId: string }) => (
            <Card key={penalty.id} sx={{mt: 2}}>
                <CardContent>
                    <Typography>Amount: ₹{penalty.amount}</Typography>
                    <Typography>For Order: {penalty.orderId}</Typography>
                    <Button onClick={() => handlePay(penalty)} variant="contained" sx={{mt:1}}>Pay Now</Button>
                </CardContent>
            </Card>
        ))}
    </Container>
  );
};