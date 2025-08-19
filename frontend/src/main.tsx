import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SocketProvider } from './context/SocketContext.tsx';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={darkTheme}>
            <Toaster position="top-right" />
            <CssBaseline />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </SocketProvider>
  </React.StrictMode>,
);