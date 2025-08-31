import { UsersResponse, User } from '@/types/api';
import { apiGet, apiPatch, apiDelete, apiPost } from './api';

export const userService = {
  // Get all users
  getUsers: async (params: {
    page?: number;
    limit?: number;
  }): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return await apiGet<UsersResponse>(`/user/allusers?${searchParams.toString()}`);
  },

  // Block/Unblock user
  toggleBlockUser: async (userId: string): Promise<any> => {
    return await apiPatch(`/user/blockuser/${userId}`);
  },

  // Delete user
  deleteUser: async (userId: string): Promise<any> => {
    return await apiDelete(`/user/deleteuser/${userId}`);
  },

  // Create user (if needed)
  createUser: async (userData: Partial<User>): Promise<any> => {
    return await apiPost('/user/create', userData);
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<User>): Promise<any> => {
    return await apiPatch(`/user/update/${userId}`, userData);
  },
};