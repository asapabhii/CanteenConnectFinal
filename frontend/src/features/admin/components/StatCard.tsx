import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  to?: string; // Optional navigation path
}

export const StatCard = ({ title, value, to }: StatCardProps) => {
  return (
    <Card>
      <CardActionArea component={to ? Link : 'div'} to={to}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" component="div">{value}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};