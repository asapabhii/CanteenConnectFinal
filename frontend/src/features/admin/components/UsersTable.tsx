import { Box, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useToggleUserBlock } from '../../../api/users';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditUserModal } from './EditUserModal';

const Role = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
} as const;

type Role = typeof Role[keyof typeof Role];

interface User {
  id: string;
  email: string;
  role: Role;
  isBlocked: boolean;
  profile?: {
    name: string;
    rollNumber?: string;
    facultyId?: string;
    vendorId?: string;
  };
}

interface UserRow extends User {
  name: string;
  identifier: string;
}

export const UsersTable = ({ users, isLoading }: { users: User[]; isLoading: boolean }) => {
  const navigate = useNavigate();
  const toggleBlockMutation = useToggleUserBlock();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleToggleBlock = (id: string) => {
    toggleBlockMutation.mutate(id);
  };

  const rows = useMemo(() => {
    if (!users) return [];
    return users.map((user: User) => ({
      ...user, // Pass the full user object to the row
      id: user.id,
      name: user.profile?.name || 'N/A',
      identifier:
        user.role === 'STUDENT'
          ? user.profile?.rollNumber || 'N/A'
          : user.role === 'FACULTY'
          ? user.profile?.facultyId || 'N/A'
          : user.role === 'VENDOR'
          ? user.profile?.vendorId || 'N/A'
          : 'N/A',
    }));
  }, [users]);

  const columns: GridColDef<UserRow>[] = [
    { field: 'id', headerName: 'User ID', width: 220 },
    { field: 'identifier', headerName: 'Roll No / Faculty ID', width: 180 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ row }: { row: UserRow }) => [
        <GridActionsCellItem
          key="edit"
          icon={<Tooltip title="Edit Role & Assign"><EditIcon /></Tooltip>}
          label="Edit"
          onClick={() => setEditingUser(row)}
        />,
        <GridActionsCellItem
          key="block"
          icon={
            row.isBlocked ? (
              <Tooltip title="Unblock User"><CheckCircleOutlineIcon color="success" /></Tooltip>
            ) : (
              <Tooltip title="Block User"><BlockIcon color="error" /></Tooltip>
            )
          }
          label="Toggle Block"
          onClick={() => handleToggleBlock(row.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', mt: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        onRowClick={(params) => navigate(`/admin/users/${params.id}`)}
        sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
      <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} />
    </Box>
  );
};