import { Box, CircularProgress, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useUsers, useToggleUserBlock } from '../../../api/users';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditUserModal } from './EditUserModal';

export const UsersTable = ({ users, isLoading }: { users: any[]; isLoading: boolean }) => {
  const navigate = useNavigate();
  const toggleBlockMutation = useToggleUserBlock();
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const handleToggleBlock = (id: string) => {
    toggleBlockMutation.mutate(id);
  };

  const rows = useMemo(() => {
    if (!users) return [];
    return users.map((user: any) => ({
      ...user, // Pass the full user object to the row
      id: user.id,
      name: user.profile?.name || 'N/A',
      identifier:
        user.role === 'STUDENT'
          ? user.profile?.rollNumber
          : user.role === 'FACULTY'
          ? user.profile?.facultyId
          : user.role === 'VENDOR'
          ? user.profile?.vendorId
          : 'N/A',
    }));
  }, [users]);

  const columns = [
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
      getActions: ({ row }: any) => [
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