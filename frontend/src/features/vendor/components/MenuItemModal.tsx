import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCreateMenuItem, useUpdateMenuItem } from '../../../api/menu';
import { useUploadImage } from '../../../api/uploads';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Define categories on the frontend
enum ItemCategory {
  VEG = 'VEG',
  NON_VEG = 'NON_VEG',
  BEVERAGE = 'BEVERAGE',
  DESSERT = 'DESSERT',
  SNACK = 'SNACK',
}

export const MenuItemModal = ({ isOpen, onClose, initialData }: { isOpen: boolean; onClose: () => void; initialData?: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
  });
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const uploadMutation = useUploadImage();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || '',
          price: initialData.price,
          imageUrl: initialData.imageUrl || '',
          category: initialData.category || '',
        });
      } else {
        setFormData({ name: '', description: '', price: 0, imageUrl: '', category: '' });
      }
      setLocalPreview(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);

      uploadMutation.mutate(file, {
        onSuccess: (data) => {
          setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
        },
        onError: (error) => {
          console.error('Upload failed:', error);
          alert('Image upload failed. Please try again.');
          setLocalPreview(null);
        },
      });
    }
  };

  const handleSave = () => {
    const mutationData = { ...formData };
    if (initialData) {
      updateMutation.mutate({ itemId: initialData.id, data: mutationData }, { onSuccess: onClose });
    } else {
      createMutation.mutate(mutationData, { onSuccess: onClose });
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;
  const displayUrl = localPreview || formData.imageUrl;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField name="name" label="Item Name" value={formData.name} onChange={handleChange} required />
          <TextField name="price" label="Price (₹)" type="number" value={formData.price} onChange={handleChange} required />
          
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {Object.values(ItemCategory).map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField name="description" label="Description" value={formData.description} onChange={handleChange} multiline rows={3} />
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label" disabled={uploadMutation.isPending}>
              Upload File
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {uploadMutation.isPending && <CircularProgress size={20} />}
            <Divider orientation="vertical" flexItem>OR</Divider>
            <TextField
              name="imageUrl"
              label="Paste Image URL"
              value={formData.imageUrl}
              onChange={(e) => {
                handleChange(e);
                setLocalPreview(null);
              }}
              fullWidth
              size="small"
            />
          </Stack>

          {uploadMutation.isSuccess && !localPreview && (
            <Stack direction="row" spacing={1} alignItems="center" color="success.main">
              <CheckCircleIcon fontSize="small" />
              <Typography variant="body2">Image upload successful!</Typography>
            </Stack>
          )}

          {displayUrl && (
            <Box
              component="img"
              src={displayUrl}
              alt="Menu item preview"
              sx={{
                width: '100%',
                borderRadius: 2,
                objectFit: 'contain',
                mt: 1,
                border: '1px solid rgba(255, 255, 255, 0.23)',
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={isMutating}>
          {isMutating ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};