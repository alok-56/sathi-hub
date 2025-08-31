import { VehicleModelsResponse, VehicleModel } from '@/types/api';
import { apiGet, apiPost, apiPatch, apiDelete } from './api';

export const vehicleModelService = {
  // Get all vehicle models
  getVehicleModels: async (): Promise<VehicleModelsResponse> => {
    return await apiGet<VehicleModelsResponse>('/master/global/company/get');
  },

  // Create vehicle model
  createVehicleModel: async (data: {
    companyname: string;
    image: string;
  }): Promise<any> => {
    return await apiPost('/master/global/company/create', data);
  },

  // Update vehicle model
  updateVehicleModel: async (modelId: string, data: {
    companyname: string;
    image: string;
  }): Promise<any> => {
    return await apiPatch(`/master/global/company/update/${modelId}`, data);
  },

  // Delete vehicle model
  deleteVehicleModel: async (modelId: string): Promise<any> => {
    return await apiDelete(`/master/global/company/delete/${modelId}`);
  },
};