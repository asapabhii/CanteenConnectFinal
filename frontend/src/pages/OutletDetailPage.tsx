import { Box, CircularProgress, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useOutlet } from '../api/outlets';
import { MenuItemCard } from '../features/menu/components/MenuItemCard';
import { useState } from 'react';
import { AnimatedPage } from '../components/common/AnimatedPage';

export const OutletDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: outlet, isLoading, isError } = useOutlet(id!, category);

  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | undefined,
  ) => {
    setCategory(newCategory);
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }}/>;
  if (isError) return <Typography color="error">Failed to load outlet.</Typography>;

  return (
    <AnimatedPage>
      <Container sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>{outlet.name}</Typography>
        
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={handleCategoryChange}
          sx={{mb: 2}}
        >
          <ToggleButton value={undefined}>All</ToggleButton>
          <ToggleButton value="VEG">Veg</ToggleButton>
          <ToggleButton value="NON_VEG">Non-Veg</ToggleButton>
          <ToggleButton value="BEVERAGE">Beverages</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="h5" gutterBottom>Menu</Typography>
        {outlet.menuItems?.map((item: any) => (
          <Box key={item.id} sx={{mb: 2}}>
              <MenuItemCard item={item} />
          </Box>
        ))}
        {outlet.menuItems?.length === 0 && (
            <Typography>No menu items found for this category.</Typography>
        )}
      </Container>
    </AnimatedPage>
  );
};