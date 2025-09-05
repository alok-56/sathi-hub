import { MechanicsResponse, Mechanic } from "@/types/api";
import { apiGet, apiPatch, apiDelete } from "./api";

export const mechanicService = {
  // Get all mechanics
  getMechanics: async (params: {
    page?: number;
    limit?: number;
    status?: string; 
  }): Promise<MechanicsResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status); // ✅ Append status

    return await apiGet<MechanicsResponse>(
      `/mechanic/allmechnic?${searchParams.toString()}`
    );
  },

  // Approve/Reject mechanic application
  updateMechanicStatus: async (data: {
    id: string;
    status: "approve" | "reject";
    remarks: string;
  }): Promise<any> => {
    return await apiPatch("/mechanic/checkapplication", data);
  },

  // Block/Unblock mechanic
  toggleBlockMechanic: async (mechanicId: string): Promise<any> => {
    return await apiPatch(`/mechanic/blockmechnic/${mechanicId}`);
  },

  // Delete mechanic
  deleteMechanic: async (mechanicId: string): Promise<any> => {
    return await apiDelete(`/mechanic/deletemechnic/${mechanicId}`);
  },
};
