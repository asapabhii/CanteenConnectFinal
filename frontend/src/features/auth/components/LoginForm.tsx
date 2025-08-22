import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useLogin } from '../../../api/auth';
import { useAuthStore } from '../../../store/useAuthStore';
import apiClient from '../../../api/apiClient';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const loginMutation = useLogin();

  const getMe = async () => {
      const { data } = await apiClient.get('/users/me');
      return data;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          // Set the token in the store and apiClient header
          useAuthStore.getState().setToken(data.access_token, null);

          // Now fetch the user's profile
          const userProfile = await getMe();

          // Update the store with the full user profile
          useAuthStore.getState().setToken(data.access_token, userProfile);

          // Navigate to the dashboard
          navigate('/');
        },
        onError: (error) => {
          alert(`Login Failed: ${error.message}`);
        },
      },
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '400px',
        margin: 'auto',
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging In...' : 'Login'}
        </Button>
      </Stack>
    </Box>
  );
};