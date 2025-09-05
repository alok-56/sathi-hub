import { AppConfigResponse, AppConfig } from "@/types/api";
import { apiGet, apiPost, apiPatch } from "./api";

export const appConfigService = {
  // Get app configuration
  getAppConfig: async (): Promise<AppConfigResponse> => {
    return await apiGet<AppConfigResponse>("/master/globalget");
  },

  // Create app configuration
  createAppConfig: async (data: {
    charge_per_km: number;
    platform_fee: number;
    commision_percentage: number;
    referral_bonus: number;
    mechanic_charge: number;
    discount_percentage: number;
    Loyality_points: number;
    upi_number: string;
  }): Promise<any> => {
    return await apiPost("/master/global/create", data);
  },

  // Update app configuration
  updateAppConfig: async (
    configId: string,
    data: Partial<{
      charge_per_km: number;
      platform_fee: number;
      commision_percentage: number;
      referral_bonus: number;
      mechanic_charge: number;
      discount_percentage: number;
      Loyality_points: number;
      upi_number: string;
    }>
  ): Promise<any> => {
    return await apiPatch(`/master/global/update/${configId}`, data);
  },
};
