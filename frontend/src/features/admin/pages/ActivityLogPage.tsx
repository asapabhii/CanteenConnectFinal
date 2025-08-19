import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // Corrected import
import { useActivityLog } from '../../../api/logs';

export const ActivityLogPage = () => {
  const { data: logs, isLoading } = useActivityLog();

  // Removed the explicit : GridColDef[] type
  const columns = [
    { 
      field: 'createdAt', 
      headerName: 'Timestamp', 
      width: 200, 
      type: 'dateTime', 
      valueGetter: (p: any) => new Date(p.value) 
    },
    { field: 'actorName', headerName: 'Performed By', width: 200 },
    { 
      field: 'action', 
      headerName: 'Action', 
      width: 200, 
      renderCell: (p: any) => <Chip label={p.value} size="small"/> 
    },
    { field: 'targetId', headerName: 'Target ID', width: 250 },
    { 
      field: 'details', 
      headerName: 'Details', 
      flex: 1, 
      valueGetter: (p: any) => JSON.stringify(p.value) 
    },
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