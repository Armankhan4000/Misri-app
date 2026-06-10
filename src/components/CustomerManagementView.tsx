import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Ban, 
  CheckCircle2, 
  History, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  BadgeAlert,
  SlidersHorizontal,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Customer, Booking } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  bookings: Booking[];
  onToggleSuspend: (id: string) => void;
  onUpdateCustomerNid?: (id: string, nidNum: string, status: Customer['nidStatus']) => void;
  onViewLocation?: (id: string) => void;
}

export default function CustomerManagementView({ 
  customers, 
  bookings, 
  onToggleSuspend, 
  onUpdateCustomerNid,
  onViewLocation 
}: CustomerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Sync temp states for live editing within Customer modal
  const [nidInput, setNidInput] = useState('');
  const [nidStatusInput, setNidStatusInput] = useState<'Unsubmitted' | 'Pending' | 'Verified' | 'Rejected'>('Unsubmitted');

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  React.useEffect(() => {
    if (selectedCustomer) {
      setNidInput(selectedCustomer.nidNumber || '');
      setNidStatusInput(selectedCustomer.nidStatus || 'Unsubmitted');
    }
  }, [selectedCustomerId, selectedCustomer]);

  // Filter customers logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cust.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && cust.status === filterStatus;
  });

  const selectedCustomerBookings = selectedCustomerId 
    ? bookings.filter(b => b.customerId === selectedCustomerId) 
    : [];

  return (
    <div className="space-y-6" id="customer-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="customer-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Customer Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit customer accounts, profile parameters, & booking logs
          </p>
        </div>
      </div>

      {/* Primary Filtering Utilities */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900 border border-slate-800 p-4 rounded-xl" id="customer-controls">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="search-customers-input"
            type="text"
            placeholder="Search custom ID, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-2" id="customer-filters">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Status:
          </span>
          {(['All', 'Active', 'Suspended'] as const).map((status) => (
            <button
              id={`filter-cust-state-${status}`}
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                filterStatus === status 
                  ? 'bg-cyan-600 text-slate-950' 
                  : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOMER LIST TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm" id="customer-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="customers-data-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-mono">
                <th className="py-4 px-5 font-semibold">User details</th>
                <th className="py-4 px-5 font-semibold">Joined at</th>
                <th className="py-4 px-5 font-semibold">Bookings</th>
                <th className="py-4 px-5 font-semibold">Total Spent</th>
                <th className="py-4 px-5 font-semibold">Status</th>
                <th className="py-4 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/60">
              {filteredCustomers.map((cust) => (
                <tr 
                  id={`customer-row-${cust.id}`}
                  key={cust.id} 
                  className="hover:bg-slate-800/20 transition-all cursor-pointer group"
                  onClick={() => setSelectedCustomerId(cust.id)}
                >
                  <td className="py-4 px-5 flex items-center gap-3">
                    <img 
                      src={cust.avatar} 
                      alt={cust.name} 
                      className="h-9 w-9 rounded-full object-cover border border-slate-800" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{cust.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{cust.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-400 font-mono">{cust.createdAt}</td>
                  <td className="py-4 px-5 font-mono text-slate-300">{cust.totalBookings} times</td>
                  <td className="py-4 px-5 font-bold text-emerald-400 font-mono">₹{cust.totalSpent.toLocaleString()}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cust.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cust.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-end">
                      {onViewLocation && (
                        <button
                          id={`btn-track-cust-${cust.id}`}
                          onClick={() => onViewLocation(cust.id)}
                          className="p-1 px-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/40 text-cyan-400 text-xs rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="লোকেশন ম্যাপে দেখুন"
                        >
                          <MapPin className="h-3 w-3 text-cyan-400" /> Track
                        </button>
                      )}
                      <button
                        id={`btn-open-profile-${cust.id}`}
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Profile <ChevronRight className="h-3 w-3" />
                      </button>
                      <button
                        id={`btn-suspend-cust-${cust.id}`}
                        onClick={() => onToggleSuspend(cust.id)}
                        className={`p-1 px-2 bg-slate-950 hover:bg-slate-800 text-xs rounded flex items-center gap-1 cursor-pointer transition-colors ${
                          cust.status === 'Active' 
                            ? 'text-rose-400 hover:text-rose-300' 
                            : 'text-emerald-400 hover:text-emerald-300'
                        }`}
                        title={cust.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {cust.status === 'Active' ? <Ban className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {cust.status === 'Active' ? 'Suspend' : 'Unsuspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 bg-slate-900">
                    No customers found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL VIEW */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedCustomerId(null)}
            id="cust-profile-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
              id="cust-profile-modal"
            >
              {/* Modal Banner Top */}
              <div className="bg-slate-950 p-6 flex justify-between items-start border-b border-slate-800 relative">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedCustomer.avatar} 
                    alt={selectedCustomer.name} 
                    className="h-14 w-14 rounded-full object-cover border-2 border-cyan-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white font-sans">{selectedCustomer.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        selectedCustomer.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCustomer.id}</p>
                  </div>
                </div>
                <button 
                  id="btn-close-cust-modal"
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                
                {/* Contact grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="modal-cust-details">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Email Address</p>
                      <p className="font-semibold truncate">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Phone Line</p>
                      <p className="font-semibold">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <div>
                      <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">Registration Date</p>
                      <p className="font-semibold font-mono">{selectedCustomer.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Economic Health summary */}
                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/60" id="modal-cust-stats">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Accumulated Sales Value</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Bookings Completed</p>
                    <p className="text-2xl font-black text-white font-mono mt-1">{selectedCustomer.totalBookings} orders</p>
                  </div>
                </div>

                {/* NID Card Verification Frame (Anti-Fake Control) */}
                <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-3" id="nid-verification-section">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-sans">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
                      Anti-Fake Shield: Customer NID (জাতীয় পরিচয়পত্র)
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      nidStatusInput === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      nidStatusInput === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      nidStatusInput === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {nidStatusInput}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400 font-medium font-sans">National ID (NID) Number</label>
                      <input 
                        type="text" 
                        value={nidInput}
                        onChange={(e) => setNidInput(e.target.value)}
                        placeholder="e.g. 5421-9082-1102"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1 text-xs font-sans">
                      <label className="text-slate-400 font-medium">Verify Action</label>
                      <select 
                        value={nidStatusInput}
                        onChange={(e) => setNidStatusInput(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-350 text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Unsubmitted">Unsubmitted (জমা দেওয়া হয়নি)</option>
                        <option value="Pending">Pending Audit (যাচাইকরণ পেন্ডিং)</option>
                        <option value="Verified">Verified Pass (সনাক্তকরণ সম্পন্ন)</option>
                        <option value="Rejected">Rejected Fail (বাতিল / ফেক আইডি)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => {
                        onUpdateCustomerNid?.(selectedCustomer.id, nidInput, nidStatusInput);
                      }}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02] text-slate-950 text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-lg shadow-cyan-600/10"
                    >
                      Apply & Sync NID to Cloud
                    </button>
                  </div>
                </div>

                {/* Booking History sub-panel */}
                <div className="space-y-3" id="modal-cust-history">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-cyan-400" />
                    Platform Booking Logs & Invoices
                  </h4>
                  <div className="border border-slate-800 rounded-lg overflow-hidden max-h-[160px] overflow-y-auto">
                    <table className="w-full text-left text-xs" id="modal-cust-booking-history-table">
                      <thead className="bg-slate-950 border-b border-slate-800 text-slate-500 font-mono">
                        <tr>
                          <th className="py-2.5 px-3">Booking ID</th>
                          <th className="py-2.5 px-3">Technician</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Log Date</th>
                          <th className="py-2.5 px-3 text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {selectedCustomerBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/10">
                            <td className="py-2 px-3 font-mono text-slate-400">{b.id}</td>
                            <td className="py-2 px-3 text-slate-200">{b.technicianName}</td>
                            <td className="py-2 px-3 text-slate-300">{b.category}</td>
                            <td className="py-2 px-3 font-mono text-slate-400">{b.date}</td>
                            <td className="py-2 px-3 text-right font-black text-cyan-400 font-mono">₹{b.amount}</td>
                          </tr>
                        ))}
                        {selectedCustomerBookings.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-slate-500">
                              No historic bookings catalogued for this customer.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3 rounded-b-2xl">
                <button 
                  id="btn-suspend-modal-action"
                  onClick={() => {
                    onToggleSuspend(selectedCustomer.id);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedCustomer.status === 'Active' 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                  }`}
                >
                  <Ban className="h-3.5 w-3.5" />
                  {selectedCustomer.status === 'Active' ? 'Suspend Account Session' : 'Reinstate Regular Session'}
                </button>
                {onViewLocation && (
                  <button
                    id="btn-track-cust-modal-footer"
                    onClick={() => {
                      onViewLocation(selectedCustomer.id);
                      setSelectedCustomerId(null);
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 text-slate-950" /> Track Location (লোকেশন দেখুন)
                  </button>
                )}
                <button 
                  id="btn-close-modal-bottom-action"
                  onClick={() => setSelectedCustomerId(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
