import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useAdminStats } from '../../../api/analytics';
import { StatCard } from '../components/StatCard';
import { AnimatedPage } from '../../../components/common/AnimatedPage';
import { SalesChart } from '../components/SalesChart';
import { PopularItemsList } from '../components/PopularItemsList';

export const AdminDashboardPage = () => {
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();

  return (
    <AnimatedPage>
      <Box>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        
        {isLoadingStats ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
              <StatCard title="Today's Orders (Count)" value={stats?.todaysOrdersCount} />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
              <StatCard title="Today's Orders (Value)" value={`₹${stats?.todaysOrdersValue.toFixed(2)}`} />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
              <StatCard title="Total Revenue (All Time)" value={`₹${stats?.totalRevenue.toFixed(2)}`} />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 3' } }}>
              <StatCard title="Pending Orders" value={stats?.pendingOrders} />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
                <SalesChart />
            </Grid>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
              <PopularItemsList />
            </Grid>
          </Grid>
        )}
      </Box>
    </AnimatedPage>
  );
};