import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUpdateOutlet } from '../../../api/outlets';

export const EditOutletModal = ({ outlet, onClose }: { outlet: any; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxOrdersPerSlot, setMaxOrdersPerSlot] = useState(20);

  const updateOutletMutation = useUpdateOutlet();
  
  useEffect(() => {
    if (outlet) {
      setName(outlet.name);
      setDescription(outlet.description || '');
      setMaxOrdersPerSlot(outlet.maxOrdersPerSlot);
    }
  }, [outlet]);

  const handleSave = () => {
    updateOutletMutation.mutate({
      outletId: outlet.id,
      data: { name, description, maxOrdersPerSlot: Number(maxOrdersPerSlot) }
    });
    onClose();
  };

  if (!outlet) return null;

  return (
    <Dialog open={!!outlet} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Outlet: {outlet.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{mt: 1}}>
          <TextField label="Outlet Name" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <TextField label="Max Orders Per Slot" type="number" value={maxOrdersPerSlot} onChange={e => setMaxOrdersPerSlot(Number(e.target.value))} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};