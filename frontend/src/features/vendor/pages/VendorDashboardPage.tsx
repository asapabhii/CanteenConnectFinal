import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useVendorStats } from '../../../api/analytics';
import { StatCard } from '../../admin/components/StatCard';
import { useAuthStore } from '../../../store/useAuthStore';
import { AnimatedPage } from '../../../components/common/AnimatedPage';

export const VendorDashboardPage = () => {
  const { data, isLoading } = useVendorStats();
  const user = useAuthStore((state) => state.user);

  return (
    <AnimatedPage>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile?.name || user?.email}!
        </Typography>
        
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard title="Today's Sales" value={`₹${data?.todaysSales.toFixed(2)}`} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Today's Orders" value={data?.todaysOrders} to="/vendor/delivery" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Live Active Orders" value={data?.liveActiveOrders} to="/vendor/delivery" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Most Popular Item Today" value={data?.mostPopularItem} />
            </Grid>
          </Grid>
        )}
      </Box>
    </AnimatedPage>
  );
};