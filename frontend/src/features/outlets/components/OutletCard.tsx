import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface OutletCardProps {
  outlet: {
    id: string;
    name: string;
  };
}

export const OutletCard = ({ outlet }: OutletCardProps) => {
  return (
    <Card component={Link} to={`/outlets/${outlet.id}`} sx={{ textDecoration: 'none' }}>
      <CardContent>
        <Typography variant="h6">{outlet.name}</Typography>
      </CardContent>
    </Card>
  );
};