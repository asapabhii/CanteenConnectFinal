import { useMutation } from '@tanstack/react-query';
import apiClient from './apiClient';
    
interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

interface SignupData {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
}

const signupUser = async (signupData: SignupData): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/signup', signupData);
  return data;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};