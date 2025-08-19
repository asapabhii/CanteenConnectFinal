import { Box, Typography } from '@mui/material';
import { LoginForm } from '../features/auth/components/LoginForm';
import { AnimatedPage } from '../components/common/AnimatedPage';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <AnimatedPage>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <LoginForm />
        <Typography textAlign="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/signup" style={{color: 'lightblue'}}>Sign Up</Link>
        </Typography>
      </Box>
    </AnimatedPage>
  );
};