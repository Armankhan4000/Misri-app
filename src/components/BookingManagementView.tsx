import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertOctagon, 
  ChevronRight, 
  FileText, 
  X, 
  ShieldAlert, 
  User, 
  Wrench,
  Sparkles,
  Inbox
} from 'lucide-react';
import { Booking } from '../types';

interface BookingViewProps {
  bookings: Booking[];
  onResolveDispute: (bookingId: string, resolution: 'refund' | 'payout' | 'custom') => void;
}

export default function BookingManagementView({ bookings, onResolveDispute }: BookingViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'Live' | 'Completed' | 'Cancelled' | 'Disputes'>('Live');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Filtering Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === 'Disputes') {
      return matchesSearch && b.dispute !== undefined;
    }
    return matchesSearch && b.status === tab;
  });

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  return (
    <div className="space-y-6" id="booking-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="booking-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Booking Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track dispatches, completed jobs, and settle structural customer disputes
          </p>
        </div>
      </div>

      {/* Main filter controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl" id="booking-controls">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="search-bookings-input"
            type="text"
            placeholder="Search invoice number, client details, tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2" id="booking-tabs">
          {([
            { id: 'Live', label: 'Live Bookings', count: bookings.filter(b => b.status === 'Live').length },
            { id: 'Completed', label: 'Completed Jobs', count: bookings.filter(b => b.status === 'Completed').length },
            { id: 'Cancelled', label: 'Cancelled Jobs', count: bookings.filter(b => b.status === 'Cancelled').length },
            { id: 'Disputes', label: 'Dispute Cases', count: bookings.filter(b => b.dispute).length }
          ] as const).map((t) => (
            <button
              id={`booking-tab-selector-${t.id}`}
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer relative transition-all ${
                tab === t.id 
                  ? t.id === 'Disputes' 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/10' 
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 px-1.5 py-0.5 text-[9px] font-mono rounded ${
                tab === t.id 
                  ? 'bg-slate-950/40 text-white' 
                  : 'bg-slate-900 text-slate-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm" id="bookings-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="bookings-data-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-mono">
                <th className="py-4 px-5">ID / Date</th>
                <th className="py-4 px-5">Customer details</th>
                <th className="py-4 px-5">Technician / Category</th>
                <th className="py-4 px-5">Schedule Time</th>
                <th className="py-4 px-5">Gross Bill</th>
                {tab === 'Disputes' && <th className="py-4 px-5">Dispute Stage</th>}
                <th className="py-4 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-800/60">
              {filteredBookings.map((b) => (
                <tr 
                  id={`booking-row-${b.id}`}
                  key={b.id} 
                  className="hover:bg-slate-800/20 transition-all cursor-pointer group"
                  onClick={() => setSelectedBookingId(b.id)}
                >
                  <td className="py-4 px-5">
                    <p className="font-mono text-slate-200 group-hover:text-cyan-400 transition-colors font-semibold">{b.id}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{b.date}</p>
                  </td>
                  <td className="py-4 px-5 font-medium text-slate-200">{b.customerName}</td>
                  <td className="py-4 px-5">
                    <p className="text-slate-100">{b.technicianName}</p>
                    <p className="text-xs text-slate-400">{b.category}</p>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-300 font-sans flex items-center gap-1.5 mt-2.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {b.time} hrs
                  </td>
                  <td className="py-4 px-5 font-bold text-emerald-400 font-mono">₹{b.amount}</td>
                  {tab === 'Disputes' && b.dispute && (
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.dispute.status === 'Open' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {b.dispute.status}
                      </span>
                    </td>
                  )}
                  <td className="py-4 px-5 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`btn-view-booking-${b.id}`}
                      onClick={() => setSelectedBookingId(b.id)}
                      className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      Inspect <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={tab === 'Disputes' ? 7 : 6} className="py-12 text-center text-slate-500">
                    <Inbox className="h-10 w-10 mx-auto text-slate-600 mb-2" />
                    No bookings logged matching selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedBookingId(null)}
            id="booking-detail-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
              id="booking-detail-modal"
            >
              {/* Modal Header */}
              <div className="bg-slate-950 p-6 flex justify-between items-start border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-mono">Invoice: {selectedBooking.id}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedBooking.status === 'Live' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : selectedBooking.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {selectedBooking.status} Dispatch
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Scheduled: {selectedBooking.date} at {selectedBooking.time}</p>
                </div>
                <button 
                  id="btn-close-booking-modal"
                  onClick={() => setSelectedBookingId(null)}
                  className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                
                {/* User Info split cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="modal-booking-parties">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Customer Details</span>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">{selectedBooking.customerName}</p>
                        <p className="text-xs text-slate-400">ID: {selectedBooking.customerId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Assigned Skilled Mistri</span>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-cyan-400 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">{selectedBooking.technicianName}</p>
                        <p className="text-xs text-slate-400">{selectedBooking.category} • {selectedBooking.technicianId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details & Invoice Summary */}
                <div className="p-4 bg-slate-950 rounded-xl space-y-3 border border-slate-800/80" id="modal-invoice-pricing">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice Statement</h4>
                  <div className="flex justify-between items-center text-sm border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400 font-sans">{selectedBooking.category} service fee</span>
                    <span className="font-bold text-slate-200 font-mono">₹{(selectedBooking.amount * 0.85).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400 font-sans">Platform commission fee (15%)</span>
                    <span className="font-bold text-slate-200 font-mono">₹{(selectedBooking.amount * 0.15).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-base pt-1 font-bold">
                    <span className="text-white">Aggregate Bill Value</span>
                    <span className="text-emerald-400 font-mono">₹{selectedBooking.amount}</span>
                  </div>
                </div>

                {/* DISPUTE SYSTEM OVERVIEW IF REGISTERED */}
                {selectedBooking.dispute && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-4" id="modal-dispute-section">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <ShieldAlert className="h-5 w-5 shrink-0" />
                      <span>Active Customer Escrow Dispute</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" id="dispute-statements">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-rose-400 font-semibold block mb-1">Customer Statement</span>
                        <p className="text-slate-300 italic">"{selectedBooking.dispute.customerStatement}"</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 font-semibold block mb-1">Technician Response</span>
                        <p className="text-slate-300 italic">"{selectedBooking.dispute.technicianStatement}"</p>
                      </div>
                    </div>

                    {selectedBooking.dispute.status === 'Open' ? (
                      <div className="space-y-3 pt-2" id="dispute-resolver-inputs">
                        <label className="text-xs font-bold text-slate-400 block uppercase">Super Admin Settle Verdict</label>
                        <input 
                          id="verdict-resolution-notes"
                          type="text" 
                          placeholder="Provide regulatory justification notes..." 
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500"
                        />
                        <div className="flex gap-2">
                          <button
                            id="btn-verdict-refund"
                            onClick={() => {
                              onResolveDispute(selectedBooking.id, 'refund');
                              setSelectedBookingId(null);
                            }}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-3 rounded text-xs cursor-pointer transition-colors"
                          >
                            Execute Full Refund
                          </button>
                          <button
                            id="btn-verdict-payout"
                            onClick={() => {
                              onResolveDispute(selectedBooking.id, 'payout');
                              setSelectedBookingId(null);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-1.5 px-3 rounded text-xs cursor-pointer transition-colors"
                          >
                            Approve Payout to Mistri
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-3 text-xs flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>This Escrow dispute was marked RESOLVED on {selectedBooking.dispute.resolutionDate || '2026-06-10'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end rounded-b-2xl">
                <button 
                  id="btn-close-booking-modal-bottom"
                  onClick={() => setSelectedBookingId(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
