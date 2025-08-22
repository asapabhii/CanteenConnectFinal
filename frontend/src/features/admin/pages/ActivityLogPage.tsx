import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useActivityLog } from '../../../api/logs';

export const ActivityLogPage = () => {
  const { data: logs, isLoading } = useActivityLog();

  const columns = [
    { field: 'createdAt', headerName: 'Timestamp', width: 200 },
    { field: 'actorName', headerName: 'Performed By', width: 200 },
    { field: 'action', headerName: 'Action', width: 200 },
    { field: 'targetId', headerName: 'Target ID', width: 250 },
    { field: 'details', headerName: 'Details', flex: 1 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Activity Log</Typography>
      <Box sx={{ height: 700, width: '100%' }}>
        {isLoading ? <CircularProgress /> : (
          <DataGrid
            rows={logs || []}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};
