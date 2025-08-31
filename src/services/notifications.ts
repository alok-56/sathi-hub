import { NotificationsResponse, Notification } from '@/types/api';
import { apiGet, apiPost, apiDelete } from './api';

export const notificationService = {
  // Get all notifications
  getNotifications: async (params: {
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    return await apiGet<NotificationsResponse>(`/notification/getall?${searchParams.toString()}`);
  },

  // Create notification
  createNotification: async (data: {
    message: string;
    type: string;
  }): Promise<any> => {
    return await apiPost('/notification/create', data);
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<any> => {
    return await apiDelete(`/notification/delete/${notificationId}`);
  },
};