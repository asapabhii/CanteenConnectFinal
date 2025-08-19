import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useOnboardVendor } from '../../../api/admin';

export const OnboardVendorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    outletName: '',
    outletDescription: '',
    vendorName: '',
    vendorEmail: '',
    vendorPassword: ''
  });
  const onboardMutation = useOnboardVendor();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onboardMutation.mutate(formData, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Onboard New Vendor & Outlet</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}}>
          <Typography variant="h6">Outlet Details</Typography>
          <TextField name="outletName" label="Outlet Name" onChange={handleChange} required />
          <TextField name="outletDescription" label="Outlet Description" onChange={handleChange} />

          <Typography variant="h6" sx={{pt: 2}}>Vendor Account Details</Typography>
          <TextField name="vendorName" label="Vendor's Full Name" onChange={handleChange} required />
          <TextField name="vendorEmail" label="Vendor's Email" type="email" onChange={handleChange} required />
          <TextField name="vendorPassword" label="Initial Password" type="password" onChange={handleChange} required />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={onboardMutation.isPending}>
          {onboardMutation.isPending ? 'Onboarding...' : 'Create Vendor & Outlet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};