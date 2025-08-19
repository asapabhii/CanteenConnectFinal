import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUpdateUserRole, useAssignOutlet } from '../../../api/users';
import { useOutlets } from '../../../api/outlets';

enum Role {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export const EditUserModal = ({ user, onClose }: { user: any; onClose: () => void }) => {
  const [role, setRole] = useState<Role>(user?.role || Role.STUDENT);
  const [outletId, setOutletId] = useState(user?.outletId || '');

  const { data: outlets } = useOutlets();
  const updateUserRole = useUpdateUserRole();
  const assignOutlet = useAssignOutlet();
  
  useEffect(() => {
    if (user) {
      setRole(user.role);
      setOutletId(user.outletId || '');
    }
  }, [user]);

  const handleSave = () => {
    if (user.role !== role) {
      updateUserRole.mutate({ userId: user.id, role });
    }
    // Only try to assign outlet if the role is VENDOR
    if (role === 'VENDOR') {
        assignOutlet.mutate({ userId: user.id, outletId });
    }
    // If they are changed from a VENDOR to something else, un-assign them
    if(user.role === 'VENDOR' && role !== 'VENDOR') {
        assignOutlet.mutate({ userId: user.id, outletId: null });
    }
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={!!user} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit User: {user.profile?.name || user.email}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value as Role)}>
            {Object.values(Role).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>

        {role === 'VENDOR' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Assign Outlet</InputLabel>
            <Select value={outletId} label="Assign Outlet" onChange={(e) => setOutletId(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {outlets?.map((outlet: any) => (
                    <MenuItem key={outlet.id} value={outlet.id}>{outlet.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};