import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  Settings, 
  Layers, 
  Award, 
  FileSpreadsheet, 
  TrendingUp, 
  Plus, 
  Percent, 
  Users, 
  Wrench, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { Technician, Booking } from '../types';
import { commissionRates } from '../data';

interface CommissionViewProps {
  technicians: Technician[];
  bookings: Booking[];
}

export default function CommissionManagementView({ technicians, bookings }: CommissionViewProps) {
  const [defaultRate, setDefaultRate] = useState(commissionRates.default);
  const [categories, setCategories] = useState(commissionRates.categories);
  const [overrideTechs, setOverrideTechs] = useState(commissionRates.technicians);

  // Overrides form state
  const [targetTechId, setTargetTechId] = useState('');
  const [customRate, setCustomRate] = useState(12);

  // Financial calculations
  const totalVolume = bookings
    .filter(b => b.status === 'Completed')
    .reduce((acc, b) => acc + b.amount, 0) + 495000;
  
  // Retained Super Admin margins is on average 15% of complete dispatches
  const platformEarnings = totalVolume * (defaultRate / 100);
  const providerPayout = totalVolume - platformEarnings;

  const handleUpdateCategoryRate = (category: string, newRate: number) => {
    setCategories(categories.map(c => c.category === category ? { ...c, rate: newRate } : c));
  };

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTechId) return;

    const matchedTech = technicians.find(t => t.id === targetTechId);
    const techName = matchedTech ? matchedTech.name : 'Unknown Technician';

    setOverrideTechs([
      ...overrideTechs.filter(o => o.technicianId !== targetTechId),
      { technicianId: targetTechId, technicianName: techName, rate: customRate }
    ]);

    setTargetTechId('');
  };

  const handleRemoveOverride = (techId: string) => {
    setOverrideTechs(overrideTechs.filter(o => o.technicianId !== techId));
  };

  return (
    <div className="space-y-6" id="commission-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="commission-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Commission Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Build platform economic policies, adjust category coefficients, list loyalty discount offsets, & verify payout audits
          </p>
        </div>
      </div>

      {/* Grid containing reports and configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="commission-core-grid">
        
        {/* PANEL 1: Financial Reports Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="commission-reports-panel">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <FileSpreadsheet className="h-4.5 w-4.5 text-cyan-400" />
            Super Commission Reports
          </h2>

          <div className="space-y-3" id="revenue-economic-indicators">
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold uppercase block font-mono">Gross Transaction Volume</span>
              <p className="text-2xl font-black text-white font-mono mt-1">₹{totalVolume.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Completed booking totals catalogued on platform</p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold uppercase block font-mono">Retained Admin Platform Margin</span>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-1">₹{platformEarnings.toLocaleString()}</p>
              <p className="text-[10px] text-cyan-400 font-bold mt-1">Estimated {defaultRate}% platform retained cut</p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold uppercase block font-mono">Workforce Revenue Dispersals</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{providerPayout.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 mt-1">Disbursed successfully into technician bank registers</p>
            </div>
          </div>
        </div>

        {/* PANEL 2: Commission Settings Controls */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5" id="commission-settings-panel">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Settings className="h-4.5 w-4.5 text-cyan-400" />
              Global Commission Rules Setup
            </h2>
            <p className="text-xs text-slate-500 mt-1">Global platform commission default coefficient applied unless specific override triggers matched.</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-6" id="global-rate-slider">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase font-mono">Default Platform Commission Rate</span>
                <span className="text-cyan-400 font-mono font-extrabold text-base">{defaultRate}% Cut</span>
              </div>
              <input 
                id="default-rate-input-slider"
                type="range" 
                min="5" 
                max="30" 
                value={defaultRate} 
                onChange={(e) => setDefaultRate(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2"
              />
            </div>
            <button 
              id="btn-save-global-rate"
              onClick={() => alert(`Global Default Commission locked in at ${defaultRate}%`)} 
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-colors whitespace-nowrap"
            >
              Lock Commission Rules
            </button>
          </div>

          {/* Table: Category-specific rules */}
          <div className="space-y-3" id="category-wise-commissions bg-slate-905">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-cyan-400" /> Category-Specific Platform Commission Coefficients
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left" id="category-commissions-table">
                <thead className="bg-slate-950 text-slate-500 font-mono">
                  <tr>
                    <th className="py-2.5 px-4">Service Category Class</th>
                    <th className="py-2.5 px-4">App Default Platform cut</th>
                    <th className="py-2.5 px-4 text-right">Adjust Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {categories.map((c) => (
                    <tr key={c.category} className="hover:bg-slate-800/10">
                      <td className="py-2.5 px-4 font-semibold text-slate-100 flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-slate-500" /> {c.category}
                      </td>
                      <td className="py-2.5 px-4 font-bold font-mono text-cyan-400">{c.rate}%</td>
                      <td className="py-2.5 px-4 text-right font-sans">
                        <div className="flex gap-1 justify-end">
                          <button
                            id={`btn-dec-comm-${c.category}`}
                            onClick={() => handleUpdateCategoryRate(c.category, Math.max(5, c.rate - 1))}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 rounded text-[10px] font-mono cursor-pointer border border-slate-800"
                          >
                            -1%
                          </button>
                          <button
                            id={`btn-inc-comm-${c.category}`}
                            onClick={() => handleUpdateCategoryRate(c.category, Math.min(30, c.rate + 1))}
                            className="px-1.5 py-0.5 bg-slate-850 hover:bg-slate-800 rounded text-[10px] font-mono cursor-pointer border border-slate-800 text-cyan-400"
                          >
                            +1%
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 3: Technician Override Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6" id="commission-overrides-section">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-amber-400" />
            Special Technician Commissions (Loyalty Overrides)
          </h2>
          <p className="text-xs text-slate-500 mt-1">Reward stellar high-performing providers by lowering their specific system payouts cut below global default, maximizing their retention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="overrides-config-cols">
          {/* List of custom overrides */}
          <div className="space-y-3" id="active-overrides-list">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Commission loyalty list</h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs divide-y divide-slate-800 bg-slate-950/40">
              {overrideTechs.map((o) => (
                <div key={o.technicianId} className="p-3 flex justify-between items-center hover:bg-slate-800/10" id={`override-row-${o.technicianId}`}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">{o.technicianName}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{o.technicianId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{o.rate}% commission</span>
                    <button
                      id={`btn-remove-override-${o.technicianId}`}
                      onClick={() => handleRemoveOverride(o.technicianId)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold hover:underline cursor-pointer"
                    >
                      Remove Override
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to submit a new Override */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4" id="override-form-block">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configure loyalty rate multiplier</h4>
            <form onSubmit={handleAddOverride} className="space-y-3" id="override-creation-form">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Select Certified Technician</label>
                <select
                  id="override-tech-select"
                  required
                  value={targetTechId}
                  onChange={(e) => setTargetTechId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-300 text-xs focus:outline-none"
                >
                  <option value="">-- Choose Approved Technician --</option>
                  {technicians
                    .filter(t => t.status === 'Approved')
                    .map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.category} - {t.city})</option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Loyalty Commission Offset (%)</label>
                <input
                  id="override-rate-input"
                  type="number"
                  required
                  min="5"
                  max="30"
                  value={customRate}
                  onChange={(e) => setCustomRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                />
              </div>

              <button
                id="btn-override-submit"
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" /> Save Loyalty Commission Override
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
