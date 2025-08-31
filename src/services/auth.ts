import { LoginRequest, LoginResponse, AdminProfile } from '@/types/api';
import { apiPost, apiGet, setAuthToken, removeAuthToken } from './api';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiPost<LoginResponse>('/admin/login', credentials);
    
    if (response.status && response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Get admin profile
  getProfile: async (): Promise<AdminProfile> => {
    return await apiGet<AdminProfile>('/admin/ownprofile');
  },

  // Logout
  logout: (): void => {
    removeAuthToken();
  },
};