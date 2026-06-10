import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Ticket, 
  Sparkles, 
  GitPullRequest, 
  ArrowRight, 
  RotateCcw, 
  Percent, 
  Trash2, 
  Plus, 
  TrendingUp, 
  Gift, 
  UserPlus, 
  BadgePercent,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { PromoCode } from '../types';

interface OffersProps {
  promoCodes: PromoCode[];
  onCreatePromo: (newPromo: Omit<PromoCode, 'id'>) => void;
  onDeletePromo: (id: string) => void;
}

export default function OffersPromotionsView({ promoCodes, onCreatePromo, onDeletePromo }: OffersProps) {
  const [subTab, setSubTab] = useState<'Promos' | 'Festival' | 'Referral' | 'Discounts' | 'Cashback'>('Promos');
  const [showCreator, setShowCreator] = useState(false);
  
  // Create Promo Code State Variables
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minBookingValue, setMinBookingValue] = useState(500);
  const [expiryDate, setExpiryDate] = useState('2026-08-31');
  const [promoType, setPromoType] = useState<PromoCode['type']>('General');

  // Submit Handler
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    onCreatePromo({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minBookingValue: Number(minBookingValue),
      expiryDate,
      status: 'Active',
      type: promoType
    });

    // Reset Form
    setCode('');
    setShowCreator(false);
  };

  return (
    <div className="space-y-6" id="offers-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="offers-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Offers & Promotions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure system discount promo-codes, seasonal vouchers, referral rewards, & cashback rules 
          </p>
        </div>
      </div>

      {/* Segment navigation tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3" id="offers-segments-navigation">
        {([
          { id: 'Promos', label: 'Promo Coupons', icon: Ticket },
          { id: 'Festival', label: 'Seasonal Offers', icon: Sparkles },
          { id: 'Referral', label: 'Referral Schemes', icon: UserPlus },
          { id: 'Discounts', label: 'Discount Policies', icon: BadgePercent },
          { id: 'Cashback', label: 'Cashback Rules', icon: RotateCcw }
        ] as const).map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              id={`offers-subtab-select-${tab.id}`}
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                subTab === tab.id 
                  ? 'bg-cyan-600 text-slate-950 font-extrabold' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PROMO COUPONS MANAGER */}
      {subTab === 'Promos' && (
        <div className="space-y-6" id="offers-coupons-panel">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <p className="text-xs text-slate-400 font-sans">
              Deploy special coupon codes that clients key in checkout to trigger instant flat or percent cart reductions.
            </p>
            <button
              id="btn-toggle-promo-creator"
              onClick={() => setShowCreator(!showCreator)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Code
            </button>
          </div>

          {showCreator && (
            <motion.div
              id="promo-creator-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-920 border border-slate-800 rounded-xl p-5"
            >
              <form onSubmit={handleCreatePromo} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="promo-create-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Promo Voucher Code</label>
                  <input
                    id="promo-input-code"
                    type="text"
                    required
                    placeholder="e.g., WINTER500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono uppercase focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Reduction Style</label>
                  <select
                    id="promo-input-style"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="Percentage">Percentage On Total (%)</option>
                    <option value="Fixed">Flat Amount Deduction (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Voucher Premium Value</label>
                  <input
                    id="promo-input-value"
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Criteria Min Basket (₹)</label>
                  <input
                    id="promo-input-min"
                    type="number"
                    required
                    value={minBookingValue}
                    onChange={(e) => setMinBookingValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Campaign Category</label>
                  <select
                    id="promo-input-type"
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="General">General Campaign</option>
                    <option value="Festival">Festival Special</option>
                    <option value="Referral">Referral Program Code</option>
                    <option value="Cashback">Cashback Trigger</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Expiry Timeline</label>
                  <input
                    id="promo-input-expiry"
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-2">
                  <button
                    id="btn-promo-submit"
                    type="submit"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Deploy Promotion Code
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Table list of Promo Rules */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" id="promos-table-container">
            <table className="w-full text-left" id="promos-data-table">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-mono">
                  <th className="py-3.5 px-5">Voucher Code</th>
                  <th className="py-3.5 px-5">Category / Type</th>
                  <th className="py-3.5 px-5">Deduction Premium</th>
                  <th className="py-3.5 px-5">Minimum Basket Requirement</th>
                  <th className="py-3.5 px-5">Expiry Schedule</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/60">
                {promoCodes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/10">
                    <td className="py-3.5 px-5 font-mono font-black text-cyan-400">{p.code}</td>
                    <td className="py-3.5 px-5 text-slate-300">{p.type}</td>
                    <td className="py-3.5 px-5 font-bold font-mono text-slate-200">
                      {p.discountType === 'Percentage' ? `${p.discountValue}% Off` : `₹${p.discountValue} Flat`}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-400">₹{p.minBookingValue} minimum</td>
                    <td className="py-3.5 px-5 font-mono text-slate-400">{p.expiryDate}</td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        id={`btn-delete-promo-${p.id}`}
                        onClick={() => onDeletePromo(p.id)}
                        className="p-1 hover:bg-slate-800 text-rose-400 hover:text-rose-300 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FESTIVAL OFFERS */}
      {subTab === 'Festival' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="offers-festival-panel">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center gap-2">
              <Gift className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm">Monsoon Rain Splash</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Targeted across June-August months. Instantly indexes high discounts across emergency categories (Plumbering, Electrical, Appliance mechanisms) to aid home leaks during monsoons.
            </p>
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <p className="flex justify-between"><span className="text-slate-500">Global discount coefficient:</span> <span className="font-bold text-white">25% off</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Live Cities:</span> <span className="font-mono text-cyan-400">Mumbai, Dhaka, Kolkata</span></p>
            </div>
            <button 
              id="btn-edit-monsoon-offer"
              onClick={() => alert('Festival parameters updated successfully')} 
              className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white rounded-lg cursor-pointer"
            >
              Modify Festival Criteria
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0" />
              <h3 className="font-bold text-sm">Diwali & Puja Spark</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Targeted across October-November. Encourages pre-booking deep home cleanings, painting, and architectural carpenter improvements with bundle structures.
            </p>
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <p className="flex justify-between"><span className="text-slate-500">Bundle rebate multiplier:</span> <span className="font-bold text-white">1.5x points</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Live Cities:</span> <span className="font-mono text-cyan-400">All Cities</span></p>
            </div>
            <button 
              id="btn-activate-diwali-offer"
              onClick={() => alert('Diwali schedule finalized')} 
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Promote and Queue Diwali Schedule
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REFERRAL CAMPAIGNS */}
      {subTab === 'Referral' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6" id="offers-referral-panel">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <UserPlus className="h-5 w-5 text-indigo-400" />
            <span>Client Referral Kickback Rules</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="referral-constants">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-normal">
              <p className="text-slate-500 text-[10px] font-bold uppercase font-mono">Inviter Bonus Reward</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹250 Cash Credit</p>
              <p className="text-xs text-slate-400 mt-2">Paid instantly into the user’s Mistri waller after friend’s initial service completion.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-normal">
              <p className="text-slate-500 text-[10px] font-bold uppercase font-mono">New Invitee Register Voucher</p>
              <p className="text-xl font-bold text-cyan-400 mt-1">15% Cut first job</p>
              <p className="text-xs text-slate-400 mt-2">Voucher automatically keys-in on the invitee registration dashboard landing page.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-normal flex flex-col justify-between">
              <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase font-mono">Simulated Referral metrics</p>
                <p className="text-lg font-bold text-slate-200 mt-1">452 conversions this month</p>
              </div>
              <p className="text-[10px] text-cyan-400 font-bold uppercase font-mono">Acquisition cost ₹113,000</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="referral-config-fields">
            <div className="space-y-1 text-xs">
              <label className="text-slate-400 block font-semibold">Maximum Referral Threshold per client/monthly</label>
              <input type="number" defaultValue={20} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono" />
            </div>
            <div className="space-y-1 text-xs">
              <label className="text-slate-400 block font-semibold">Claim payout approval period (days)</label>
              <input type="number" defaultValue={3} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono" />
            </div>
            <div className="col-span-full pt-2">
              <button 
                id="btn-update-referral"
                onClick={() => alert('Referral rules updated')} 
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer"
              >
                Update Referral policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DISCOUNT RULES */}
      {subTab === 'Discounts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="offers-discounts-panel">
          <div>
            <h3 className="font-bold text-white text-base">Automatic Category-Wide Discount Policy</h3>
            <p className="text-xs text-slate-500 mt-1">Global discounts triggered based on hour blocks or service volume matrices, bypassing coupon inputs.</p>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden text-xs" id="discount-rules-matrix">
            <table className="w-full text-left bg-slate-950/40">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-500 font-mono">
                  <th className="py-2 px-3">Rule Designation</th>
                  <th className="py-2 px-3">Trigger criteria</th>
                  <th className="py-2 px-3">Resulting Discount</th>
                  <th className="py-2 px-3 text-right">Modify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Off-Peak Workhours Saver</td>
                  <td className="py-3 px-3">Booking scheduled between 12:00 PM - 3:00 PM (Tues-Thur)</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold font-mono">Flat 10% instant discount</td>
                  <td className="py-3 px-3 text-right">
                    <button onClick={() => alert('Feature mock-edit triggered')} className="text-xs text-cyan-400 hover:underline cursor-pointer">Configure</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-white">Bulk Multi-Labor Dispatch</td>
                  <td className="py-3 px-3">Basket coordinates containing ≥ 3 unique distinct technician classes</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold font-mono">15% on aggregate bill</td>
                  <td className="py-3 px-3 text-right">
                    <button onClick={() => alert('Feature mock-edit triggered')} className="text-xs text-cyan-400 hover:underline cursor-pointer">Configure</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CASHBACK CAMPAIGNS */}
      {subTab === 'Cashback' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6" id="offers-cashback-panel">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-emerald-400" />
                Cashback Campaigns
              </h3>
              <p className="text-xs text-slate-500 mt-1">Rebate flat values into user wallets upon successful app billing settlements.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              ACTIVE LEDGER RULE
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 leading-normal space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Current active rule: Pay-with-Online-Shop Cashback</h4>
            <p className="text-xs text-slate-200">
              Users shopping the internal Mistri e-stores for spare parts (PVC glues, wire bundles, coatings) get 5% cashback refunded into their primary technician checkout credit balance, max ₹250 per transaction order.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 font-mono">
              Last evaluation: June 10, 2026 00:22:15 UTC | Total disbursed: ₹45,210
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
