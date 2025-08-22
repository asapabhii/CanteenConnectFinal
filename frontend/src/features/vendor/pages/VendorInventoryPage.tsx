import { Box, Button, CircularProgress, Switch, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useVendorInventory, useDeleteMenuItem, useToggleItemAvailability } from '../../../api/menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { MenuItemModal } from '../components/MenuItemModal';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
}

export const VendorInventoryPage = () => {
  const { data: menuItems, isLoading } = useVendorInventory();
  const deleteMutation = useDeleteMenuItem();
  const toggleAvailabilityMutation = useToggleItemAvailability();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        deleteMutation.mutate(id);
    }
  }

  const handleToggleAvailability = (id: string) => {
    toggleAvailabilityMutation.mutate(id);
  }

  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item);
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(undefined);
  }

  const columns: GridColDef<MenuItem>[] = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'price', headerName: 'Price (₹)', width: 100 },
    { 
      field: 'isAvailable', 
      headerName: 'Availability', 
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value ? "In Stock" : "Out of Stock"}>
            <Switch
              checked={params.value}
              onChange={() => handleToggleAvailability(params.id as string)}
              color="success"
            />
        </Tooltip>
      )
    },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<Tooltip title="Edit Item"><EditIcon /></Tooltip>}
          label="Edit"
          onClick={() => handleOpenModal(row)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Tooltip title="Delete Item"><DeleteIcon color="error" /></Tooltip>}
          label="Delete"
          onClick={() => handleDelete(row.id as string)}
        />,
      ],
    },
  ];

  return (
    <Box>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
            <Typography variant="h4">Inventory Management</Typography>
            <Button variant="contained" onClick={() => handleOpenModal()}>Add New Item</Button>
        </Box>
        {isLoading ? <CircularProgress /> : (
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid rows={menuItems || []} columns={columns} />
            </Box>
        )}
        <MenuItemModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            initialData={editingItem}
        />
    </Box>
  );
};