import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; // <-- Corrected Import
import { useVendorLiveMenu } from '../../../api/menu';

export const VendorMenuPage = () => {
  const { data: menuItems, isLoading } = useVendorLiveMenu();

  // Removed the explicit : GridColDef[] type
  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'price', headerName: 'Price (₹)', width: 100 },
    { field: 'description', headerName: 'Description', flex: 1 },
  ];

  return (
    <Box>
        <Typography variant="h4" gutterBottom>My Live Menu (What Customers See)</Typography>
        {isLoading ? <CircularProgress /> : (
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={menuItems || []} columns={columns} />
            </Box>
        )}
    </Box>
  );
};