import { Box, Button, Typography } from '@mui/material';
import { OutletsTable } from '../components/OutletsTable';
import { useState } from 'react';
import { OnboardVendorModal } from '../components/OnboardVendorModal';

export const OutletManagementPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
        <Typography variant="h4" gutterBottom>Outlet Management</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>Onboard Vendor/Outlet</Button>
      </Box>
      <OutletsTable />
      <OnboardVendorModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
};