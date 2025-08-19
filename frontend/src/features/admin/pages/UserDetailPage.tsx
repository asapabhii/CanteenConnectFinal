import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useUser } from '../../../api/users';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, isError } = useUser(id!);

  if (isLoading) return <CircularProgress />;
  if (isError || !user) return <Typography color="error">User not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{user.profile?.name || 'N/A'}</Typography>
              <Typography color="text.secondary" gutterBottom>{user.email}</Typography>
              <Chip label={user.role} color="primary" sx={{ mb: 1 }} />
              <Chip label={user.isBlocked ? 'Blocked' : 'Active'} color={user.isBlocked ? 'error' : 'success'} />
            </CardContent>
          </Card>
        </Grid>

        {/* Order History */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Order History ({user.orders.length})</Typography>
          <Stack spacing={2}>
            {user.orders.map((order: any) => (
              <Card key={order.id} variant="outlined">
                <CardContent>
                  <Typography>ID: {order.id}</Typography>
                  <Typography>Total: ₹{order.total.toFixed(2)}</Typography>
                  <Typography>Status: {order.status}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};