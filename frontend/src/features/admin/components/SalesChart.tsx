import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useSalesChartData } from '../../../api/analytics';
import { CircularProgress, Paper, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

export const SalesChart = () => {
  const { data, isLoading } = useSalesChartData();

  // Safely format the data, ensuring it's an array before mapping
  const formattedData = Array.isArray(data)
    ? data.map((item: any) => ({
        ...item,
        // Format date as 'Aug 13' for the chart's X-axis
        date: format(parseISO(item.date), 'MMM d'),
      }))
    : [];

  if (isLoading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" gutterBottom>Last 7 Days Revenue</Typography>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Daily Revenue (₹)" />
            </BarChart>
        </ResponsiveContainer>
    </Paper>
  );
};