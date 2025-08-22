import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useOutlets } from '../../../api/outlets';
import { OutletCard } from './OutletCard';

interface Outlet {
  id: string;
  name: string;
}

export const OutletList = () => {
  const { data: outlets, isLoading, isError } = useOutlets();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Failed to load outlets.</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Outlets</Typography>
      <Grid container spacing={2}>
        {outlets?.map((outlet: Outlet) => (
          <Grid key={outlet.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <OutletCard outlet={outlet} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
