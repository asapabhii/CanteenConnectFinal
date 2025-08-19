import { Button, Container, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Order Confirmed!</Typography>
      <Typography>Your Order ID is: {id}</Typography>
      <Button component={Link} to="/" variant="contained" sx={{mt: 2}}>
        Place Another Order
      </Button>
    </Container>
  );
};