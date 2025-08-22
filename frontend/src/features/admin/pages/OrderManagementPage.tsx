import { Box, Chip, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useAdminOrders } from '../../../api/orders';
import { useNavigate } from 'react-router-dom';

export const OrderManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { data, isLoading } = useAdminOrders(debouncedSearchTerm);
    const navigate = useNavigate();
    
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Order ID', width: 220 },
        { 
            field: 'createdAt', 
            headerName: 'Date', 
            width: 180, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueGetter: (p: any) => new Date(p.value) 
        },
        { 
            field: 'user', 
            headerName: 'Customer', 
            width: 200, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueGetter: (p: any) => p.value?.profile?.name || p.value?.email 
        },
        { 
            field: 'outlet', 
            headerName: 'Outlet', 
            width: 150, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueGetter: (p: any) => p.value?.name 
        },
        { field: 'total', headerName: 'Total (₹)', width: 120 },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 150, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderCell: (p: any) => <Chip label={p.value} size="small" />
        },
        { field: 'paymentMode', headerName: 'Payment', width: 120 },
    ];

  return (
    <Box>
        <Typography variant="h4" gutterBottom>Order Management</Typography>
        <TextField
            label="Search by Order ID..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, width: '400px' }}
        />
        <Box sx={{ height: 700, width: '100%' }}>
            <DataGrid
                rows={data?.orders || []}
                columns={columns}
                rowCount={data?.totalCount || 0}
                loading={isLoading}
                onRowClick={(params) => navigate(`/admin/orders/${params.id}`)}
                sx={{ '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
            />
        </Box>
    </Box>
  );
};