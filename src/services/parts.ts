import { PartsResponse, Part } from '@/types/api';
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export const partService = {
  // Get all parts for a service
  getParts: async (serviceId: string): Promise<PartsResponse> => {
    return await apiGet<PartsResponse>(`/service/getall/parts/${serviceId}`);
  },

  // Create part
  createPart: async (data: {
    serviceId: string;
    partname: string;
    image: string;
    amount: string;
  }): Promise<any> => {
    return await apiPost('/service/parts/create', data);
  },

  // Update part
  updatePart: async (data: {
    id: string;
    serviceId: string;
    partname: string;
    image: string;
    amount: string;
  }): Promise<any> => {
    return await apiPatch('/service/parts/update', data);
  },

  // Delete part
  deletePart: async (partId: string): Promise<any> => {
    return await apiDelete(`/service/parts/delete/${partId}`);
  },
};