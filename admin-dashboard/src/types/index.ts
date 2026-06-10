export type UserRole = 'super_admin' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Admin extends User {
  permissions: Permission[];
  status: 'active' | 'inactive';
}

export interface Permission {
  id: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Admin;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'blocked';
  totalBookings: number;
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'blocked';
  kycStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalEarnings: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId?: string;
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalTechnicians: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalCommission: number;
}
