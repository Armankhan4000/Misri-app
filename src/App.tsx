import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Wrench, 
  CalendarClock, 
  Megaphone, 
  Ticket, 
  ShoppingBag, 
  DollarSign, 
  Bell, 
  BarChart4, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Gauge,
  UserCheck2,
  Lock,
  WrenchIcon,
  HardHat,
  MapPin,
  Smartphone,
  Globe,
  Layers,
  FileText,
  Sparkles
} from 'lucide-react';

import { Language, getTranslation } from './translations';

// Type definitions and mock data
import { 
  Customer, 
  Technician, 
  Booking, 
  Banner, 
  PromoCode, 
  Product, 
  ShopOrder, 
  SystemLog 
} from './types';

import { 
  initialCustomers, 
  initialTechnicians, 
  initialBookings, 
  initialBanners, 
  initialPromoCodes, 
  initialProducts, 
  initialOrders, 
  systemLogs 
} from './data';

// Subviews
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import CustomerManagementView from './components/CustomerManagementView';
import TechnicianManagementView from './components/TechnicianManagementView';
import BookingManagementView from './components/BookingManagementView';
import AdvertisementManagementView from './components/AdvertisementManagementView';
import OffersPromotionsView from './components/OffersPromotionsView';
import OnlineShopView from './components/OnlineShopView';
import CommissionManagementView from './components/CommissionManagementView';
import NotificationsSenderView from './components/NotificationsSenderView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import TrackingMapView from './components/TrackingMapView';
import CompanionAppView from './components/CompanionAppView';
import ServiceSuiteView from './components/ServiceSuiteView';

import ReportExportView from './components/ReportExportView';
import SubAdminView from './components/SubAdminView';
import SupportTicketView from './components/SupportTicketView';
import AnnouncementView from './components/AnnouncementView';
import RewardsLeaderboardView from './components/RewardsLeaderboardView';
import AdminActivityLogView from './components/AdminActivityLogView';

import { useEffect } from 'react';
import { 
  seedFirestoreIfEmpty,
  listenToCollection,
  updateCustomerStatusInCloud,
  updateCustomerNidInCloud,
  updateTechnicianStatusInCloud,
  updateTechnicianNidInCloud,
  updateTechnicianPoliceVerifiedInCloud,
  updateTechnicianFeaturedInCloud,
  updateTechnicianInCloud,
  resolveDisputeInCloud,
  createPromoCodeInCloud,
  deletePromoCodeFromCloud,
  createBannerCampaignInCloud,
  deleteBannerCampaignInCloud,
  updateProductInventoryInCloud,
  addProductToCloud,
  updateOrderStatusInCloud,
  createSystemLog
} from './firebaseSync';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [focusedLocationUserId, setFocusedLocationUserId] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mistri_admin_lang');
    return (saved as Language) || 'bn';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('mistri_admin_lang', lang);
  };

  // Core Real-time Synced States
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<ShopOrder[]>(initialOrders);
  const [logs, setLogs] = useState<SystemLog[]>(systemLogs);

  // Initialize and register real-time Firestore synchronization on boot
  useEffect(() => {
    // Graceful offline-safe cloud seeder
    seedFirestoreIfEmpty();

    const unsubscribeCustomers = listenToCollection<Customer>('customers', (data) => {
      if (data && data.length > 0) setCustomers(data);
    });

    const unsubscribeTechnicians = listenToCollection<Technician>('technicians', (data) => {
      if (data && data.length > 0) setTechnicians(data);
    });

    const unsubscribeBookings = listenToCollection<Booking>('bookings', (data) => {
      if (data && data.length > 0) setBookings(data);
    });

    const unsubscribeBanners = listenToCollection<Banner>('banners', (data) => {
      if (data && data.length > 0) setBanners(data);
    });

    const unsubscribePromoCodes = listenToCollection<PromoCode>('promoCodes', (data) => {
      if (data && data.length > 0) setPromoCodes(data);
    });

    const unsubscribeProducts = listenToCollection<Product>('products', (data) => {
      if (data && data.length > 0) setProducts(data);
    });

    const unsubscribeOrders = listenToCollection<ShopOrder>('orders', (data) => {
      if (data && data.length > 0) setOrders(data);
    });

    const unsubscribeLogs = listenToCollection<SystemLog>('systemLogs', (data) => {
      if (data && data.length > 0) {
        const sorted = [...data].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setLogs(sorted);
      }
    });

    return () => {
      unsubscribeCustomers();
      unsubscribeTechnicians();
      unsubscribeBookings();
      unsubscribeBanners();
      unsubscribePromoCodes();
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeLogs();
    };
  }, []);

  // Authentication callbacks
  const handleLoginSuccess = (email: string) => {
    setAdminEmail(email);
    setIsAuthenticated(true);
    
    // Log login action in the Cloud
    const loginLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'AUTH',
      message: `Super Admin account authorized: ${email}`
    };
    createSystemLog(loginLog);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminEmail('');
    setActiveTab('dashboard');
  };

  // Operational Cloud state mutators
  const handleToggleCustomerSuspension = (id: string) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Active' ? 'Suspended' : 'Active';
    
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: nextStatus === 'Suspended' ? 'WARNING' : 'INFO',
      module: 'CUSTOMER_MGT',
      message: `Customer account ${target.name} (${target.id}) status toggled to: ${nextStatus}`
    };
    
    updateCustomerStatusInCloud(id, nextStatus);
    createSystemLog(actionLog);
  };

  const handleUpdateCustomerNidDetail = (id: string, nidNum: string, status: Customer['nidStatus']) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'CUSTOMER_VERIFICATION',
      message: `Customer ${target.name} (${target.id}) ID detail updated: NID Verified Status set to ${status}`
    };
    updateCustomerNidInCloud(id, nidNum, status);
    createSystemLog(actionLog);
  };

  const handleApproveTechnician = (id: string) => {
    const target = technicians.find(t => t.id === id);
    if (!target) return;
    const auditLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'VERIFICATION',
      message: `Technician verified: Approval certificate granted for ${target.name} (${target.id})`
    };
    updateTechnicianInCloud(id, { status: 'Approved', nidVerified: true });
    createSystemLog(auditLog);
  };

  const handleRejectTechnician = (id: string) => {
    const target = technicians.find(t => t.id === id);
    if (!target) return;
    const auditLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'WARNING',
      module: 'VERIFICATION',
      message: `KYC Rejection filed: Technician application voided for ${target.name} (${target.id})`
    };
    updateTechnicianInCloud(id, { status: 'Suspended', nidVerified: false });
    createSystemLog(auditLog);
  };

  const handleToggleTechnicianSuspension = (id: string) => {
    const target = technicians.find(t => t.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Approved' ? 'Suspended' : 'Approved';
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: nextStatus === 'Suspended' ? 'WARNING' : 'INFO',
      module: 'TECHNICIAN_MGT',
      message: `Technician directory lookup toggled: ${target.name} status is now ${nextStatus}`
    };
    updateTechnicianStatusInCloud(id, nextStatus);
    createSystemLog(actionLog);
  };

  const handleToggleFeaturedTechnician = (id: string) => {
    const target = technicians.find(t => t.id === id);
    if (!target) return;
    const nextFeatured = !target.isFeatured;
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'MARKETING',
      message: `Technician listing priority offset updated: ${target.name} featured indicator is ${nextFeatured}`
    };
    updateTechnicianFeaturedInCloud(id, nextFeatured);
    createSystemLog(actionLog);
  };

  const handleUpdateTechnicianVerification = (id: string, updates: Partial<Technician>) => {
    const target = technicians.find(t => t.id === id);
    if (!target) return;
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'VERIFICATION',
      message: `Technician ${target.name} (${target.id}) credentials manually overridden by Admin`
    };
    updateTechnicianInCloud(id, updates);
    createSystemLog(actionLog);
  };

  const handleResolveBookingDispute = (bookingId: string, resolution: 'refund' | 'payout' | 'custom') => {
    const b = bookings.find(item => item.id === bookingId);
    if (b && b.dispute) {
      const verdictMsg = resolution === 'refund' 
        ? 'Full Escrow refund executed to Customer' 
        : resolution === 'payout' 
          ? 'Complete provider dispatch payout approved' 
          : 'Custom billing split calculated';

      const actionLog: SystemLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        module: 'DISPUTE_RESOLUTION',
        message: `Judicial verdict declared on booking ${b.id}: Resolved via ${verdictMsg}`
      };
      resolveDisputeInCloud(bookingId, resolution, b.dispute);
      createSystemLog(actionLog);
    }
  };

  const handleCreatePromoCode = (newPromo: Omit<PromoCode, 'id'>) => {
    const promoItem: PromoCode = {
      id: `PRM-${Math.floor(Math.random() * 900) + 100}`,
      ...newPromo
    };
    createPromoCodeInCloud(promoItem);

    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'PROMOTIONS',
      message: `New platform cashback promo deployed: Code ${newPromo.code}`
    };
    createSystemLog(actionLog);
  };

  const handleDeletePromoCode = (id: string) => {
    deletePromoCodeFromCloud(id);
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'WARNING',
      module: 'PROMOTIONS',
      message: `Coupon code deactivated and archived: ${id}`
    };
    createSystemLog(actionLog);
  };

  const handleCreateBannerCampaign = (newBanner: Omit<Banner, 'id' | 'clicks'>) => {
    const bannerItem: Banner = {
      id: `BAN-${Math.floor(Math.random() * 90) + 10}`,
      clicks: 0,
      ...newBanner
    };
    createBannerCampaignInCloud(bannerItem);

    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'ADVERTISING',
      message: `Promo Ad banner queued and live: "${newBanner.title}" targeting ${newBanner.location}`
    };
    createSystemLog(actionLog);
  };

  const handleDeleteBannerCampaign = (id: string) => {
    deleteBannerCampaignInCloud(id);
    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'WARNING',
      module: 'ADVERTISING',
      message: `Commercial Banner Campaign deleted: ${id}`
    };
    createSystemLog(actionLog);
  };

  const handleUpdateProductInventory = (id: string, quantity: number) => {
    const p = products.find(item => item.id === id);
    if (p) {
      const nextStatus = quantity === 0 
        ? 'Out Of Stock' 
        : quantity <= 10 
          ? 'Low Stock' 
          : 'In Stock';

      const actionLog: SystemLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        module: 'INVENTORY_REPLENISHMENT',
        message: `Product ${p.name} updated. Level: ${quantity} units (${nextStatus})`
      };
      updateProductInventoryInCloud(id, quantity, nextStatus);
      createSystemLog(actionLog);
    }
  };

  const handleUpdateOrderStatus = (id: string, status: ShopOrder['status']) => {
    const o = orders.find(item => item.id === id);
    if (o) {
      const actionLog: SystemLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        module: 'INVENTORY_LOGISTICS',
        message: `Spare Part Order ${o.id} transitioned logistics level to: ${status}`
      };
      updateOrderStatusInCloud(id, status);
      createSystemLog(actionLog);
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'status'>) => {
    const item: Product = {
      id: `PROD-${Math.floor(Math.random() * 900) + 100}`,
      status: 'In Stock',
      ...newProduct
    };
    addProductToCloud(item);

    const actionLog: SystemLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level: 'INFO',
      module: 'SHOP_CATALOG',
      message: `Product spare part published and catalogued: ${newProduct.name}`
    };
    createSystemLog(actionLog);
  };

  // Nav items sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Gauge },
    { id: 'customers', label: 'Customers directory', icon: Users },
    { id: 'technicians', label: 'Technicians list', icon: HardHat },
    { id: 'bookings', label: 'Booking Dispatches', icon: CalendarClock },
    { id: 'locations', label: 'Live Locations / লাইভ লোকেশন', icon: MapPin },
    { id: 'companion', label: 'Companion Apps / মিস্ত্রি অ্যাপ', icon: Smartphone },
    { id: 'banners', label: 'Promo Ad Banners', icon: Megaphone },
    { id: 'offers', label: 'Offers & Promo Codes', icon: Ticket },
    { id: 'shop', label: 'Online Spares Shop', icon: ShoppingBag },
    { id: 'commission', label: 'Commission settings', icon: DollarSign },
    { id: 'notifications', label: 'Broadcaster Alerts', icon: Bell },
    { id: 'analytics', label: 'Deep Corporate Analytics', icon: BarChart4 },
    { id: 'reportExport', label: 'reportExport', icon: FileText },
    { id: 'subAdmins', label: 'subAdmins', icon: UserCheck2 },
    { id: 'supportTickets', label: 'supportTickets', icon: Ticket },
    { id: 'announcementBoard', label: 'announcementBoard', icon: Megaphone },
    { id: 'rewardsLeaderboard', label: 'rewardsLeaderboard', icon: Sparkles },
    { id: 'adminActivitiesLog', label: 'adminActivitiesLog', icon: Lock },
    { id: 'servicesSuite', label: 'Services Suite (Core)', icon: Layers },
    { id: 'settings', label: 'Settings & Security', icon: Settings }
  ];

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative" id="app-root-shell">
      {/* HEADER NAVBAR MOBILE OVERLAY */}
      <header className="h-16 border-b border-sidebar-border bg-slate-900 flex items-center justify-between px-6 z-40 sticky top-0 md:relative" id="masthead-navbar">
        <div className="flex items-center gap-3">
          <button 
            id="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden p-1.5 bg-slate-800 rounded border border-slate-700 hover:text-white text-slate-400 cursor-pointer"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-lg bg-cyan-600 font-black text-slate-950 text-sm tracking-wider flex items-center gap-1">
              MISTRI <span className="text-[10px] bg-slate-950 text-cyan-400 p-0.5 px-1.5 rounded uppercase font-black tracking-tight">{getTranslation('adminPanel', language)}</span>
            </span>
          </div>
        </div>

        {/* User Identity and Logout */}
        <div className="flex items-center gap-4 text-xs font-sans">
          {/* Elegant Language Option dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 focus-within:border-cyan-500 rounded-xl px-2.5 py-1.5 transition-all" id="lang-selector-group">
            <Globe className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <select
              id="global-language-selector"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-[11px] font-black tracking-wider focus:outline-none cursor-pointer pr-1 uppercase"
            >
              <option value="en" className="bg-slate-900 text-slate-200">English (EN)</option>
              <option value="bn" className="bg-slate-900 text-slate-200">বাংলা (BN)</option>
              <option value="hi" className="bg-slate-900 text-slate-200">हिन्दी (HI)</option>
              <option value="es" className="bg-slate-900 text-slate-200">Español (ES)</option>
              <option value="ar" className="bg-slate-900 text-slate-200">العربية (AR)</option>
            </select>
          </div>

          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-slate-200 font-bold max-w-[200px] truncate" title={adminEmail}>
              {adminEmail}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3 inline text-cyan-400" /> {getTranslation('authorizedConsole', language)}
            </span>
          </div>

          <button
            id="btn-logout"
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-350 rounded-xl flex items-center gap-1 cursor-pointer transition-colors border border-slate-750"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline font-semibold">{getTranslation('exitPanel', language)}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative" id="applet-viewport-columns">
        
        {/* SIDEBAR NAVIGATION - RESPONSIVE */}
        <aside 
          id="sidebar-navigation-column"
          className={`fixed inset-y-0 left-0 pt-16 md:pt-0 w-64 border-r border-slate-800 bg-slate-900 z-30 transform md:transform-none md:relative transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col justify-between p-4 pl-3" id="sidebar-scroller">
            <nav className="space-y-1 overflow-y-auto pr-1" id="sidebar-menus">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    id={`sidebar-item-select-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false); // Auto close menu on tap for small layouts
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-bold font-sans flex items-center gap-3 cursor-pointer transition-all ${
                      activeTab === item.id 
                        ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/10' 
                        : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                    }`}
                  >
                    <IconComponent className={`h-4.5 w-4.5 shrink-0 ${activeTab === item.id ? 'text-slate-950' : 'text-slate-500'}`} />
                    <span>{getTranslation(item.id, language)}</span>
                  </button>
                );
              })}
            </nav>

            {/* Security warning status footer in sidebar */}
            <div className="p-3 bg-slate-950/60 rounded-xl text-[10px] text-slate-600 border border-slate-800 font-mono tracking-tight" id="sidebar-watermark">
              <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider">Mistri Supervision Layer</span>
              Security session is tied to login email. Direct modifications stream instantly to cloud nodes.
            </div>
          </div>
        </aside>

        {/* MAIN BODY SCROLLER - RENDER CHOSEN COMPONENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 relative" id="main-scroller-viewport">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-6xl mx-auto h-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  customers={customers} 
                  technicians={technicians} 
                  bookings={bookings} 
                  customNavigate={setActiveTab} 
                />
              )}

              {activeTab === 'customers' && (
                <CustomerManagementView 
                  customers={customers} 
                  bookings={bookings} 
                  onToggleSuspend={handleToggleCustomerSuspension} 
                  onUpdateCustomerNid={handleUpdateCustomerNidDetail}
                  onViewLocation={(id) => {
                    setFocusedLocationUserId(id);
                    setActiveTab('locations');
                  }}
                />
              )}

              {activeTab === 'technicians' && (
                <TechnicianManagementView 
                  technicians={technicians} 
                  onApprove={handleApproveTechnician} 
                  onReject={handleRejectTechnician} 
                  onToggleSuspend={handleToggleTechnicianSuspension} 
                  onToggleFeatured={handleToggleFeaturedTechnician} 
                  onUpdateVerification={handleUpdateTechnicianVerification}
                  onViewLocation={(id) => {
                    setFocusedLocationUserId(id);
                    setActiveTab('locations');
                  }}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingManagementView 
                  bookings={bookings} 
                  onResolveDispute={handleResolveBookingDispute} 
                />
              )}

              {activeTab === 'locations' && (
                <TrackingMapView 
                  customers={customers} 
                  technicians={technicians} 
                  bookings={bookings} 
                  focusedId={focusedLocationUserId}
                  onClearFocus={() => setFocusedLocationUserId(null)}
                />
              )}

              {activeTab === 'companion' && (
                <CompanionAppView 
                  technicians={technicians}
                  techniciansCount={technicians.length}
                  bookingsCount={bookings.length}
                  customersCount={customers.length}
                  onApprove={handleApproveTechnician}
                  onReject={handleRejectTechnician}
                  onUpdateVerification={handleUpdateTechnicianVerification}
                />
              )}

              {activeTab === 'banners' && (
                <AdvertisementManagementView 
                  banners={banners} 
                  technicians={technicians} 
                  onCreateBanner={handleCreateBannerCampaign} 
                  onDeleteBanner={handleDeleteBannerCampaign} 
                  onToggleFeatured={handleToggleFeaturedTechnician} 
                />
              )}

              {activeTab === 'offers' && (
                <OffersPromotionsView 
                  promoCodes={promoCodes} 
                  onCreatePromo={handleCreatePromoCode} 
                  onDeletePromo={handleDeletePromoCode} 
                />
              )}

              {activeTab === 'shop' && (
                <OnlineShopView 
                  products={products} 
                  orders={orders} 
                  onUpdateInventory={handleUpdateProductInventory} 
                  onUpdateOrderStatus={handleUpdateOrderStatus} 
                  onAddProduct={handleAddProduct} 
                />
              )}

              {activeTab === 'commission' && (
                <CommissionManagementView 
                  technicians={technicians} 
                  bookings={bookings} 
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsSenderView />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView 
                  customers={customers} 
                  technicians={technicians} 
                  bookings={bookings} 
                />
              )}

              {activeTab === 'reportExport' && (
                <ReportExportView 
                  bookings={bookings}
                  technicians={technicians}
                  customers={customers}
                />
              )}

              {activeTab === 'subAdmins' && (
                <SubAdminView />
              )}

              {activeTab === 'supportTickets' && (
                <SupportTicketView />
              )}

              {activeTab === 'announcementBoard' && (
                <AnnouncementView />
              )}

              {activeTab === 'rewardsLeaderboard' && (
                <RewardsLeaderboardView 
                  technicians={technicians}
                />
              )}

              {activeTab === 'adminActivitiesLog' && (
                <AdminActivityLogView 
                  logs={logs}
                />
              )}

              {activeTab === 'servicesSuite' && (
                <ServiceSuiteView 
                  language={language}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  logs={logs} 
                  currentAdminEmail={adminEmail} 
                  onAdminEmailChange={setAdminEmail} 
                />
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>
    </div>
  );
}
