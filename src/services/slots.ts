import { SlotsResponse, Slot } from '@/types/api';
import { apiGet, apiPost, apiDelete } from './api';

export const slotService = {
  // Get all slots
  getSlots: async (): Promise<SlotsResponse> => {
    return await apiGet<SlotsResponse>('/slot/getall');
  },

  // Create slot
  createSlot: async (data: {
    no_of_hour: string;
    starttime: string;
    endtime: string;
  }): Promise<any> => {
    return await apiPost('/slot/create', data);
  },

  // Delete slot
  deleteSlot: async (slotId: string): Promise<any> => {
    return await apiDelete(`/slot/delete/${slotId}`);
  },
};