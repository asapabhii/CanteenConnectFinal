import { Box, Tab, Tabs, TextField, Typography } from '@mui/material';
import { UsersTable } from '../components/UsersTable';
import React, { useMemo, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useUsers } from '../../../api/users';

interface User {
  id: string;
  role: string;
}

export const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [roleFilter, setRoleFilter] = useState('ALL');
  const { data: users, isLoading } = useUsers(debouncedSearchTerm);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setRoleFilter(newValue);
  };

  // Filter the user list based on the selected tab
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (roleFilter === 'ALL') return users;
    return users.filter((user: User) => user.role === roleFilter);
  }, [users, roleFilter]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search by Name, Email, or ID..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '400px' }}
        />
      </Box>

      <Tabs value={roleFilter} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="All" value="ALL" />
        <Tab label="Students" value="STUDENT" />
        <Tab label="Vendors" value="VENDOR" />
        <Tab label="Faculty" value="FACULTY" />
        <Tab label="Admins" value="ADMIN" />
      </Tabs>

      <UsersTable users={filteredUsers} isLoading={isLoading} />
    </Box>
  );
};