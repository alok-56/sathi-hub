import { PayoutResponse } from '@/types/api';
import { apiGet, apiPost } from './api';

export const payoutService = {
  // Get mechanic earnings
  getMechanicEarnings: async (mechanicId?: string): Promise<PayoutResponse> => {
    const endpoint = mechanicId ? `/booking/earning?mechanicId=${mechanicId}` : '/booking/earning';
    return await apiGet<PayoutResponse>(endpoint);
  },

  // Create payout
  createPayout: async (data: {
    mechanicid: string;
    transaction_id: string;
    amount: string;
    paymentmethod: string;
  }): Promise<any> => {
    return await apiPost('/booking/create/apyout', data);
  },
};