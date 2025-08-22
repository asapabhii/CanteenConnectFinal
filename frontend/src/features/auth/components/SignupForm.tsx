import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSignup } from '../../../api/auth';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';

export const SignupForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', rollNumber: '' });
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMe = async () => {
      const { data } = await apiClient.get('/users/me');
      return data;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData, {
      onSuccess: async (data) => {
        // Set token first to authenticate the next call
        useAuthStore.getState().setToken(data.access_token, null);
        // Fetch the full user profile
        const userProfile = await getMe();
        // Update the store with the full user object
        useAuthStore.getState().setToken(data.access_token, userProfile);
        // Navigate to the main app
        navigate('/');
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Signup Failed: ${errorMessage}`);
      },
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '400px', margin: 'auto', p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1" gutterBottom>Create Account</Typography>
        <TextField name="name" label="Full Name" onChange={handleChange} required />
        <TextField name="rollNumber" label="Roll Number" onChange={handleChange} required />
        <TextField name="email" label="Email" type="email" onChange={handleChange} required />
        <TextField name="password" label="Password" type="password" onChange={handleChange} required inputProps={{ minLength: 8 }} />
        <Button type="submit" variant="contained" size="large" disabled={signupMutation.isPending}>
          {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Stack>
    </Box>
  );
};