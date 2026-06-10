/**
 * Type declarations for Mistri Admin Dashboard.
 */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  totalBookings: number;
  totalSpent: number;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  category: string;
  city: string;
  status: 'Pending' | 'Approved' | 'Suspended';
  isFeatured: boolean;
  rating: number;
  jobsCompleted: number;
  revenueGenerated: number;
  documentUrl?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  technicianId: string;
  technicianName: string;
  category: string;
  status: 'Live' | 'Completed' | 'Cancelled';
  date: string;
  time: string;
  amount: number;
  dispute?: {
    reason: string;
    status: 'Open' | 'Resolved';
    customerStatement: string;
    technicianStatement: string;
    resolutionDate?: string;
  };
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  startDate: string;
  endDate: string;
  scheduleDays: string[];
  clicks: number;
  status: 'Active' | 'Scheduled' | 'Expired';
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minBookingValue: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
  type: 'General' | 'Festival' | 'Referral' | 'Cashback';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  vendor: string;
  status: 'In Stock' | 'Low Stock' | 'Out Of Stock';
  imageUrl: string;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalCost: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
}

export interface SystemLog {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  module: string;
  message: string;
}
