// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token?: string;
  user?: any;
}

export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Booking Types
export interface BookingUser {
  _id: string;
  name: string;
  email: string;
}

export interface BookingMechanic {
  _id: string;
  name: string;
}

export interface BookingService {
  servicename: string;
  price: number;
  remarks: string;
  _id: string;
}

export interface Booking {
  _id: string;
  userid: BookingUser;
  mechanicid: BookingMechanic;
  bookingtype: string;
  service_date: string;
  services: BookingService[];
  status: string;
  payment_status: string;
  reviewstar?: number;
  payment_details: {
    discount: number;
    totalamount: number;
    paidamount: number;
    dueamount: number;
  };
  payment_ser_summary: {
    platform_fee: number;
    mechanic_charge: number;
    service_cost: number;
    additional_service_cost: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  status: boolean;
  message: string;
  total: number;
  currentPage: number;
  totalPages: number;
  data: Booking[];
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: number;
  referral_code: number;
  vehicle_type: string[];
  wallet_amount: number;
  isBlocked: boolean;
  socketId: string | null;
  createdAt: string;
  updatedAt: string;
  device_token?: string;
  vehicle_model?: string;
  profilepicture?: string;
}

export interface UsersResponse {
  status: boolean;
  message: string;
  currentPage: number;
  totalUsers: number;
  totalPages: number;
  data: User[];
}

// Mechanic Types
export interface MechanicDocuments {
  adhar_card: string;
  profile_photo: string;
  shop_photo: string;
}

export interface MechanicPaymentDetails {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  preferred_method: string;
}

export interface MechanicShopDetails {
  shop_name: string;
  lat: number;
  long: number;
  experience: number;
  description: string;
  perHourPrice: number;
}

export interface Mechanic {
  _id: string;
  name: string;
  email: string;
  phone_number: number;
  isemailverified: boolean;
  isPhoneverified: boolean;
  referral_code: number;
  isAvailable: boolean;
  wallet_amount: number;
  location: {
    type: string;
    coordinates: number[];
  };
  vehicle_type: string[];
  isBlocked: boolean;
  status: string;
  isexpert: boolean;
  documents: MechanicDocuments;
  payment_details: MechanicPaymentDetails;
  shop_details: MechanicShopDetails;
  remarks: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MechanicsResponse {
  status: boolean;
  message: string;
  currentPage: number;
  totalUsers: number;
  totalPages: number;
  data: Mechanic[];
}

// Service Types
export interface Service {
  _id: string;
  servicename: string;
  image: string;
  vehicle_type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  status: boolean;
  message: string;
  data: Service[];
}

// Parts Types
export interface Part {
  _id: string;
  serviceId: string;
  partname: string;
  image: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartsResponse {
  status: boolean;
  message: string;
  data: Part[];
}

// SOS Service Types
export interface SOSService {
  _id: string;
  servicename: string;
  image: string;
  vehicle_type: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface SOSServicesResponse {
  status: boolean;
  message: string;
  data: SOSService[];
}

// Slot Types
export interface Slot {
  _id: string;
  no_of_hour: string;
  starttime: string;
  endtime: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlotsResponse {
  status: boolean;
  message: string;
  data: Slot[];
}

// Vehicle Model Types
export interface VehicleModel {
  _id: string;
  companyname: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleModelsResponse {
  status: boolean;
  message: string;
  data: VehicleModel[];
}

// App Configuration Types
export interface AppConfig {
  _id: string;
  charge_per_km: number;
  platform_fee: number;
  commision_percentage: number;
  referral_bonus: number;
  mechanic_charge: number;
  discount_percentage: number;
  Loyality_points: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfigResponse {
  status: boolean;
  message: string;
  data: AppConfig;
}

// Notification Types
export interface Notification {
  _id: string;
  message: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: Notification[];
}

// Payout Types
export interface PayoutEarning {
  transactionId: string;
  bookingId: string;
  transactionDate: string;
  paymentMethod: string;
  grossEarning: number;
  commission: number;
  platformFee: number;
  netEarning: number;
  commissionPending: number;
}

export interface PayoutResponse {
  success: boolean;
  mechanicId: string;
  month: string;
  year: string;
  totalCommission: number;
  totalPlatformFee: number;
  totalPendingCommission: number;
  totalCashNetEarning: number;
  totalNetEarning: number;
  totalPayout: number;
  netBalance: number;
  earnings: PayoutEarning[];
  payouts: any[];
}

// API Response Types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}