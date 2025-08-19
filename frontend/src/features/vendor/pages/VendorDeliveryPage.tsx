import { Box, Button, Chip, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDeliveryOrders, useUpdateOrderStatus } from '../../../api/delivery';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { useSocket } from '../../../context/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';

export const VendorDeliveryPage = () => {
  const { data: orders, isLoading } = useDeliveryOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const socket = useSocket();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (socket && user?.outletId) {
      socket.emit('joinOutletRoom', user.outletId);

      const handleUpdate = () => {
        queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] });
        queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] });
      };

      socket.on('newOrder', handleUpdate);
      socket.on('orderUpdate', handleUpdate);

      return () => {
        socket.off('newOrder', handleUpdate);
        socket.off('orderUpdate', handleUpdate);
      };
    }
  }, [socket, queryClient, user?.outletId]);

  const handleUpdateStatus = (orderId: string, status: 'READY_FOR_PICKUP' | 'COMPLETED') => {
    updateStatusMutation.mutate({ orderId, status });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 150,
      renderCell: (params: any) => params.value.slice(-6).toUpperCase(),
    },
    {
      field: 'user',
      headerName: 'Customer',
      width: 200,
      valueGetter: (params: any) => params.value?.profile?.name || params.value?.email,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params: any) => (
        <Chip
          label={params.value.replace(/_/g, ' ')}
          color={params.value === 'READY_FOR_PICKUP' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 300,
      getActions: ({ row }: any) => {
        const actions = [
          <Button
            key="view"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => setSelectedOrder(row)}
          >
            View
          </Button>,
        ];
        if (row.status === 'PREPARING') {
          actions.push(
            <Button
              key="ready"
              onClick={() => handleUpdateStatus(row.id, 'READY_FOR_PICKUP')}
              color="success"
              size="small"
              startIcon={<FastfoodIcon />}
            >
              Ready
            </Button>,
          );
        }
        if (row.status === 'READY_FOR_PICKUP') {
          actions.push(
            <Button
              key="complete"
              onClick={() => handleUpdateStatus(row.id, 'COMPLETED')}
              color="primary"
              size="small"
              startIcon={<CheckCircleIcon />}
            >
              Complete
            </Button>,
          );
        }
        return actions;
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Delivery Desk (Live)</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid rows={orders || []} columns={columns} />
        </Box>
      )}
      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </Box>
  );
};