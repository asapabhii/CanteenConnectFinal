import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import { useVendorEarnings } from '../../../api/analytics';
import { StatCard } from '../../admin/components/StatCard';

export const VendorEarningsPage = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { data, isLoading } = useVendorEarnings(startDate || undefined, endDate || undefined);

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 200,
      type: 'dateTime',
      valueGetter: (params: any) => new Date(params.value),
    },
    { field: 'paymentMode', headerName: 'Payment Mode', width: 150 },
    { field: 'total', headerName: 'Amount (₹)', width: 150 },
  ];

  const codSales = data?.breakdown.find((b: any) => b.paymentMode === 'COD')?._sum.total || 0;
  const prepaidSales = data?.breakdown.find((b: any) => b.paymentMode === 'PREPAID')?._sum.total || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Earnings Report</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
        <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
      </Stack>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}><StatCard title="Total Revenue" value={`₹${data?.totalRevenue.toFixed(2)}`} /></Grid>
            <Grid item xs={12} sm={3}><StatCard title="Total Orders" value={data?.totalOrders} /></Grid>
            <Grid item xs={12} sm={3}><StatCard title="COD Sales" value={`₹${codSales.toFixed(2)}`} /></Grid>
            <Grid item xs={12} sm={3}><StatCard title="Prepaid Sales" value={`₹${prepaidSales.toFixed(2)}`} /></Grid>
          </Grid>

          <Typography variant="h5" gutterBottom>Completed Orders List</Typography>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid rows={data?.orders || []} columns={columns} />
          </Box>
        </>
      )}
    </Box>
  );
};