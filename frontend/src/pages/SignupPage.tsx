import { Box, Typography } from '@mui/material';
import { SignupForm } from '../features/auth/components/SignupForm';
import { AnimatedPage } from '../components/common/AnimatedPage';
import { Link } from 'react-router-dom';

export const SignupPage = () => {
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
        <SignupForm />
        <Typography textAlign="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login" style={{color: 'lightblue'}}>Log In</Link>
        </Typography>
      </Box>
    </AnimatedPage>
  );
};