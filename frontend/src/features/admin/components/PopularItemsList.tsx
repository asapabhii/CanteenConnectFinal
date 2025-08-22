import { CircularProgress, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTopItems } from '../../../api/analytics';

export const PopularItemsList = () => {
  const { data: items, isLoading } = useTopItems();

  if (isLoading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Today's Popular Items</Typography>
      <List dense>
        {items?.map((item: any, index: number) => (
          <ListItem key={index} divider>
            <ListItemText 
              primary={item.name} 
              secondary={`Sold: ${item.quantitySold}`} 
            />
          </ListItem>
        ))}
        {items?.length === 0 && <Typography variant="body2">No sales recorded yet today.</Typography>}
      </List>
    </Paper>
  );
};