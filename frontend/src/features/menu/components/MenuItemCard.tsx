import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useCartStore } from '../../cart/useCartStore';

// Define the shape of the menu item data
interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  // Add any other properties your item object has, like outletId
  outletId: string; 
}

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          {/* Item Details */}
          <Box>
            <Typography variant="h6" component="div">
              {item.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              ₹{item.price.toFixed(2)}
            </Typography>
            <Typography variant="body2">{item.description}</Typography>
          </Box>

          {/* Add Button */}
          <Box sx={{ minWidth: 100, textAlign: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                console.log('Add button clicked on item:', item); // For debugging
                addItem(item);
              }}
            >
              Add
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};