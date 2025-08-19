import { Box, Button, Typography } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
      <Typography>You are logged in as: {user?.email}</Typography>
      <Button variant="contained" onClick={logout} sx={{ marginTop: 2 }}>
        Logout
      </Button>
    </Box>
  );
};