import { ServicesResponse, Service } from '@/types/api';
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export const serviceService = {
  // Get all services
  getServices: async (): Promise<ServicesResponse> => {
    return await apiGet<ServicesResponse>('/service/getall');
  },

  // Create service
  createService: async (data: {
    servicename: string;
    image: string;
    vehicle_type: string;
  }): Promise<any> => {
    return await apiPost('/service/create', data);
  },

  // Update service
  updateService: async (data: {
    id: string;
    servicename: string;
    image: string;
    vehicle_type: string;
  }): Promise<any> => {
    return await apiPatch('/service/update', data);
  },

  // Delete service
  deleteService: async (serviceId: string): Promise<any> => {
    return await apiDelete(`/service/delete/${serviceId}`);
  },
};