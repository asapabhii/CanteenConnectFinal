import { Box, CircularProgress, Tooltip } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useOutlets } from '../../../api/outlets';
import EditIcon from '@mui/icons-material/Edit';
import { useMemo, useState } from 'react';
import { EditOutletModal } from './EditOutletModal';

interface Vendor {
  id: string;
  email: string;
  profile?: {
    name: string;
  };
}

interface Outlet {
  id: string;
  name: string;
  vendors: Vendor[];
  _count: {
    orders: number;
  };
}

interface OutletRow {
  id: string;
  name: string;
  vendors: string;
  orders: number;
  fullOutlet: Outlet;
}

export const OutletsTable = () => {
  const { data: outlets, isLoading } = useOutlets();
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  const rows = useMemo(() => {
    if (!outlets) return [];
    return outlets.map((outlet: Outlet) => ({
      id: outlet.id,
      name: outlet.name,
      vendors: outlet.vendors.map((v: Vendor) => v.profile?.name || v.email).join(', '),
      orders: outlet._count.orders,
      fullOutlet: outlet, 
    }));
  }, [outlets]);

  const columns: GridColDef<OutletRow>[] = [
    { field: 'name', headerName: 'Outlet Name', width: 200 },
    { field: 'vendors', headerName: 'Vendors', width: 250 },
    { field: 'orders', headerName: 'Total Orders', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ row }) => [
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
