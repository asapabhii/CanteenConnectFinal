import { Box, Chip, CircularProgress, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useOutlets } from '../../../api/outlets';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { EditOutletModal } from './EditOutletModal';

export const OutletsTable = () => {
  const { data: outlets, isLoading } = useOutlets();
  const [editingOutlet, setEditingOutlet] = useState<any | null>(null);

  // ** NEW: Transform the data into a flat structure **
  const rows = useMemo(() => {
    if (!outlets) return [];
    return outlets.map((outlet: any) => ({
      id: outlet.id,
      name: outlet.name,
      // Flatten the vendors array into a comma-separated string
      vendors: outlet.vendors.map((v: any) => v.profile?.name || v.email).join(', '),
      // Get the order count from the nested _count object
      orders: outlet._count.orders,
      // Pass the full original object for the edit modal
      fullOutlet: outlet, 
    }));
  }, [outlets]);

  const columns = [
    { field: 'name', headerName: 'Outlet Name', width: 200 },
    { field: 'vendors', headerName: 'Vendors', width: 250 },
    { field: 'orders', headerName: 'Total Orders', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ row }: any) => [
        <GridActionsCellItem
          key="edit"
          icon={<Tooltip title="Edit Outlet"><EditIcon /></Tooltip>}
          label="Edit"
          onClick={() => setEditingOutlet(row.fullOutlet)}
        />,
      ],
    },
  ];

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid 
        rows={rows} 
        columns={columns}
        initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
      />
      <EditOutletModal outlet={editingOutlet} onClose={() => setEditingOutlet(null)} />
    </Box>
  );
};