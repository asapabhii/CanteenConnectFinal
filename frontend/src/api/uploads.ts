import { useMutation } from '@tanstack/react-query';
import apiClient from './apiClient';

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const useUploadImage = () => {
  return useMutation({ mutationFn: uploadImage });
};