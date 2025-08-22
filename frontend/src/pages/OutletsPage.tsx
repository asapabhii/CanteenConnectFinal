import { Box, Card, CardContent, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { OutletList } from '../features/outlets/components/OutletList';
import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch } from '../api/search';
import { Link } from 'react-router-dom';
import { AnimatedPage } from '../components/common/AnimatedPage';

interface OutletSearchResult {
  id: string;
  name: string;
}

interface MenuItemSearchResult {
  id: string;
  name: string;
  outletId: string;
  outlet: {
    name: string;
  };
}

interface SearchResultsData {
  outlets: OutletSearchResult[];
  menuItems: MenuItemSearchResult[];
}

const SearchResults = ({ results, isLoading }: { results: SearchResultsData | null, isLoading: boolean}) => {
    if (isLoading) return <CircularProgress />;
    if (!results) return null;

    return (
      <Box>
        {results.outlets.length > 0 && <Typography variant="h5" sx={{my: 2}}>Matching Outlets</Typography>}
        {results.outlets.map((outlet: OutletSearchResult) => (
            <Box key={outlet.id} sx={{mb: 1}}>
                <Typography component={Link} to={`/outlets/${outlet.id}`}>{outlet.name}</Typography>
            </Box>
        ))}
        
        {results.menuItems.length > 0 && <Typography variant="h5" sx={{my: 2}}>Matching Menu Items</Typography>}
        {results.menuItems.map((item: MenuItemSearchResult) => (
            <Card key={item.id} variant="outlined" sx={{mb: 1}}>
                <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Available at: <Typography component={Link} to={`/outlets/${item.outletId}`}>{item.outlet.name}</Typography>
                    </Typography>
                </CardContent>
            </Card>
        ))}
      </Box>
    );
};

export const OutletsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { data: searchResults, isLoading: isSearchLoading } = useSearch(debouncedSearchTerm);

  return (
    <AnimatedPage>
      <Container sx={{ py: 4 }}>
        <TextField
          fullWidth
          label="Search for outlets or dishes..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />

        {debouncedSearchTerm ? (
          <SearchResults results={searchResults} isLoading={isSearchLoading} />
        ) : (
          <OutletList />
        )}
      </Container>
    </AnimatedPage>
  );
};
