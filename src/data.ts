import { Customer, Technician, Booking, Banner, PromoCode, Product, ShopOrder, SystemLog } from './types';

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-3049',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    status: 'Active',
    createdAt: '2026-01-15',
    totalBookings: 14,
    totalSpent: 12450,
    nidNumber: '5421-9082-1102',
    nidStatus: 'Verified'
  },
  {
    id: 'CUST-8102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'Active',
    createdAt: '2026-02-23',
    totalBookings: 8,
    totalSpent: 6200,
    nidNumber: '1092-4821-3829',
    nidStatus: 'Verified'
  },
  {
    id: 'CUST-5512',
    name: 'Rahman Khan',
    email: 'rahman.khan@example.com',
    phone: '+880 1712-345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Suspended',
    createdAt: '2026-03-05',
    totalBookings: 2,
    totalSpent: 1500,
    nidNumber: '3209-1123-5542',
    nidStatus: 'Pending'
  },
  {
    id: 'CUST-9821',
    name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '+91 76543 21098',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    status: 'Active',
    createdAt: '2026-04-12',
    totalBookings: 19,
    totalSpent: 18900,
    nidNumber: '7721-3942-8101',
    nidStatus: 'Verified'
  },
  {
    id: 'CUST-4112',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Active',
    createdAt: '2026-05-01',
    totalBookings: 5,
    totalSpent: 4100,
    nidNumber: '6620-8193-4012',
    nidStatus: 'Unsubmitted'
  }
];

export const initialTechnicians: Technician[] = [
  {
    id: 'TECH-101',
    name: 'Imran Malik',
    email: 'imran.malik@mistri.com',
    phone: '+91 97712 34567',
    avatar: 'https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?w=150',
    category: 'Electrician',
    city: 'Mumbai',
    status: 'Approved',
    isFeatured: true,
    rating: 4.8,
    jobsCompleted: 124,
    revenueGenerated: 85000,
    documentUrl: 'https://example.com/docs/imran_id.pdf',
    nidNumber: '3310-9281-0029',
    nidVerified: true,
    policeVerified: true,
    experienceYears: 6
  },
  {
    id: 'TECH-102',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@mistri.com',
    phone: '+91 88812 65432',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    category: 'Plumber',
    city: 'Delhi',
    status: 'Approved',
    isFeatured: false,
    rating: 4.5,
    jobsCompleted: 98,
    revenueGenerated: 59000,
    documentUrl: 'https://example.com/docs/suresh_cert.pdf',
    nidNumber: '1102-4421-4491',
    nidVerified: true,
    policeVerified: true,
    experienceYears: 4
  },
  {
    id: 'TECH-103',
    name: 'Rajesh Carpenter',
    email: 'rajesh.carpenter@mistri.com',
    phone: '+91 99933 11122',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    category: 'Carpenter',
    city: 'Bangalore',
    status: 'Pending',
    isFeatured: false,
    rating: 0,
    jobsCompleted: 0,
    revenueGenerated: 0,
    documentUrl: 'https://example.com/docs/rajesh_license.pdf',
    nidNumber: '2019-3321-4410',
    nidVerified: false,
    policeVerified: false,
    experienceYears: 2
  },
  {
    id: 'TECH-104',
    name: 'Nisha Sethi',
    email: 'nisha.sethi@mistri.com',
    phone: '+91 77722 99988',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    category: 'Appliance Repair',
    city: 'Mumbai',
    status: 'Approved',
    isFeatured: true,
    rating: 4.9,
    jobsCompleted: 145,
    revenueGenerated: 112000,
    documentUrl: 'https://example.com/docs/nisha_diploma.pdf',
    nidNumber: '2321-9922-8109',
    nidVerified: true,
    policeVerified: true,
    experienceYears: 5
  },
  {
    id: 'TECH-105',
    name: 'Farhan Akhtar',
    email: 'farhan.akhtar@mistri.com',
    phone: '+92 300 1234567',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    category: 'AC Mechanic',
    city: 'Karachi',
    status: 'Suspended',
    isFeatured: false,
    rating: 3.2,
    jobsCompleted: 12,
    revenueGenerated: 9400,
    documentUrl: 'https://example.com/docs/farhan_id.pdf',
    nidNumber: '4821-2391-4451',
    nidVerified: true,
    policeVerified: false,
    experienceYears: 3
  },
  {
    id: 'TECH-106',
    name: 'Kabir Ahmed',
    email: 'kabir.ahmed@mistri.com',
    phone: '+880 1819-223344',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    category: 'Painter',
    city: 'Dhaka',
    status: 'Pending',
    isFeatured: false,
    rating: 0,
    jobsCompleted: 0,
    revenueGenerated: 0,
    documentUrl: 'https://example.com/docs/kabir_nid.pdf',
    nidNumber: '1982-3849-5510',
    nidVerified: false,
    policeVerified: false,
    experienceYears: 1
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'BOOK-9952',
    customerId: 'CUST-3049',
    customerName: 'Aarav Sharma',
    technicianId: 'TECH-101',
    technicianName: 'Imran Malik',
    category: 'Electrician',
    status: 'Live',
    date: '2026-06-10',
    time: '14:30',
    amount: 1200
  },
  {
    id: 'BOOK-9912',
    customerId: 'CUST-8102',
    customerName: 'Priya Patel',
    technicianId: 'TECH-104',
    technicianName: 'Nisha Sethi',
    category: 'Appliance Repair',
    status: 'Live',
    date: '2026-06-10',
    time: '16:00',
    amount: 2500
  },
  {
    id: 'BOOK-8821',
    customerId: 'CUST-9821',
    customerName: 'Ananya Sen',
    technicianId: 'TECH-102',
    technicianName: 'Suresh Kumar',
    category: 'Plumber',
    status: 'Completed',
    date: '2026-06-08',
    time: '11:00',
    amount: 1500
  },
  {
    id: 'BOOK-8805',
    customerId: 'CUST-4112',
    customerName: 'Vikram Singh',
    technicianId: 'TECH-104',
    technicianName: 'Nisha Sethi',
    category: 'Appliance Repair',
    status: 'Completed',
    date: '2026-06-05',
    time: '10:15',
    amount: 3200
  },
  {
    id: 'BOOK-7712',
    customerId: 'CUST-3049',
    customerName: 'Aarav Sharma',
    technicianId: 'TECH-105',
    technicianName: 'Farhan Akhtar',
    category: 'AC Mechanic',
    status: 'Cancelled',
    date: '2026-06-03',
    time: '15:30',
    amount: 1800
  },
  {
    id: 'BOOK-1234',
    customerId: 'CUST-8102',
    customerName: 'Priya Patel',
    technicianId: 'TECH-102',
    technicianName: 'Suresh Kumar',
    category: 'Plumber',
    status: 'Completed',
    date: '2026-06-01',
    time: '13:00',
    amount: 900,
    dispute: {
      reason: 'Extra charges demanded for simple pipe connector',
      status: 'Open',
      customerStatement: 'The plumber Suresh demanded additional ₹300 cash outside the app billing for a tiny rubber connector which should be included in service.',
      technicianStatement: 'The connector was an industrial grade high pressure coupling which was listed as an extra material charge. I explained it to the customer before installing.'
    }
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'BAN-001',
    title: 'Monsoon AC Service Festival 25% Off',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=600',
    location: 'Mumbai, Delhi, Kolkata',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    scheduleDays: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    clicks: 1240,
    status: 'Active'
  },
  {
    id: 'BAN-002',
    title: 'Professional Home Deep Cleaning',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600',
    location: 'Bangalore, Chennai',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    scheduleDays: ['Saturday', 'Sunday'],
    clicks: 0,
    status: 'Scheduled'
  },
  {
    id: 'BAN-003',
    title: 'Instant Electrician Plumber Emergency Service',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
    location: 'All Cities',
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    scheduleDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    clicks: 4520,
    status: 'Expired'
  }
];

export const initialPromoCodes: PromoCode[] = [
  {
    id: 'PRM-001',
    code: 'MISTRINEW20',
    discountType: 'Percentage',
    discountValue: 20,
    minBookingValue: 500,
    expiryDate: '2026-12-31',
    status: 'Active',
    type: 'General'
  },
  {
    id: 'PRM-002',
    code: 'MONSOON500',
    discountType: 'Fixed',
    discountValue: 500,
    minBookingValue: 2000,
    expiryDate: '2026-07-15',
    status: 'Active',
    type: 'Festival'
  },
  {
    id: 'PRM-003',
    code: 'REFKABIR',
    discountType: 'Percentage',
    discountValue: 15,
    minBookingValue: 400,
    expiryDate: '2026-09-30',
    status: 'Active',
    type: 'Referral'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'PROD-771',
    name: 'Industrial Heavy Duty PVC Glue 500ml',
    category: 'Plumbing',
    price: 320,
    quantity: 48,
    vendor: 'Asian Pipes & Adhesives',
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=150'
  },
  {
    id: 'PROD-981',
    name: 'Copper Insulated Solid Wire Coil 90m',
    category: 'Electricals',
    price: 1850,
    quantity: 5,
    vendor: 'Havells Electricals Ltd',
    status: 'Low Stock',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=150'
  },
  {
    id: 'PROD-302',
    name: 'Mistri Brand Premium Paint Brush Set',
    category: 'Supplies',
    price: 450,
    quantity: 120,
    vendor: 'Anchor Coatings Co.',
    status: 'In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=150'
  }
];

export const initialOrders: ShopOrder[] = [
  {
    id: 'ORD-8871',
    customerName: 'Aarav Sharma',
    productName: 'Copper Insulated Solid Wire Coil 90m',
    quantity: 2,
    totalCost: 3700,
    date: '2026-06-08',
    status: 'Delivered'
  },
  {
    id: 'ORD-5491',
    customerName: 'Rahman Khan',
    productName: 'Mistri Brand Premium Paint Brush Set',
    quantity: 1,
    totalCost: 450,
    date: '2026-06-09',
    status: 'Shipped'
  },
  {
    id: 'ORD-3021',
    customerName: 'Ananya Sen',
    productName: 'Industrial Heavy Duty PVC Glue 500ml',
    quantity: 3,
    totalCost: 960,
    date: '2026-06-10',
    status: 'Processing'
  }
];

export const commissionRates = {
  default: 15, // 15% system fee
  categories: [
    { category: 'Plumber', rate: 15 },
    { category: 'Electrician', rate: 18 },
    { category: 'Carpenter', rate: 12 },
    { category: 'Appliance Repair', rate: 20 },
    { category: 'AC Mechanic', rate: 20 },
    { category: 'Painter', rate: 10 }
  ],
  technicians: [
    { technicianId: 'TECH-101', technicianName: 'Imran Malik', rate: 14 }, // Discounted rates for high rating
    { technicianId: 'TECH-104', technicianName: 'Nisha Sethi', rate: 15 }
  ]
};

export const systemLogs: SystemLog[] = [
  {
    timestamp: '2026-06-10 00:35:12',
    level: 'INFO',
    module: 'AUTH',
    message: 'Super Admin armanhossain08102000@gmail.com logged in'
  },
  {
    timestamp: '2026-06-10 00:25:01',
    level: 'WARNING',
    module: 'DISPUTE',
    message: 'New dispute case opened for booking BOOK-1234'
  },
  {
    timestamp: '2026-06-09 23:14:48',
    level: 'INFO',
    module: 'VERIFICATION',
    message: 'Technician Kabir Ahmed submitted verification documents'
  },
  {
    timestamp: '2026-06-09 18:41:02',
    level: 'ERROR',
    module: 'PAYMENT_GATEWAY',
    message: 'Failed to settle technician payout for TECH-105: Invalid bank details'
  }
];

export const revenueAnalyticsData = [
  { label: 'Jan', amount: 154000 },
  { label: 'Feb', amount: 182000 },
  { label: 'Mar', amount: 243000 },
  { label: 'Apr', amount: 310000 },
  { label: 'May', amount: 420000 },
  { label: 'Jun', amount: 495000 }
];

export const bookingAnalyticsData = [
  { label: 'Jan', completed: 320, live: 12, cancelled: 45 },
  { label: 'Feb', completed: 390, live: 15, cancelled: 32 },
  { label: 'Mar', completed: 510, live: 18, cancelled: 58 },
  { label: 'Apr', completed: 680, live: 25, cancelled: 70 },
  { label: 'May', completed: 850, live: 42, cancelled: 92 },
  { label: 'Jun', completed: 960, live: 65, cancelled: 85 }
];

export const userGrowthData = [
  { label: 'Jan', customers: 1200, technicians: 150 },
  { label: 'Feb', customers: 1800, technicians: 190 },
  { label: 'Mar', customers: 2600, technicians: 240 },
  { label: 'Apr', customers: 3900, technicians: 310 },
  { label: 'May', customers: 5800, technicians: 420 },
  { label: 'Jun', customers: 7200, technicians: 510 }
];
