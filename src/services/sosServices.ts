import { SOSServicesResponse, SOSService } from '@/types/api';
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export const sosService = {
  // Get all SOS services
  getSOSServices: async (): Promise<SOSServicesResponse> => {
    return await apiGet<SOSServicesResponse>('/service/sos/getall');
  },

  // Create SOS service
  createSOSService: async (data: {
    servicename: string;
    image: string;
    vehicle_type: string;
    price: number;
  }): Promise<any> => {
    return await apiPost('/service/sos/create', data);
  },

  // Update SOS service
  updateSOSService: async (data: {
    id: string;
    servicename: string;
    vehicle_type: string;
    image?: string;
    price?: number;
  }): Promise<any> => {
    return await apiPatch('/service/sos/update', data);
  },

  // Delete SOS service
  deleteSOSService: async (serviceId: string): Promise<any> => {
    return await apiDelete(`/service/sos/delete/${serviceId}`);
  },
};