import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart4, 
  MapPin, 
  TrendingUp, 
  Layers, 
  Users, 
  Award, 
  DollarSign,
  ArrowUpRight,
  TrendingDown,
  Star
} from 'lucide-react';
import { Customer, Technician, Booking } from '../types';

interface AnalyticsProps {
  customers: Customer[];
  technicians: Technician[];
  bookings: Booking[];
}

export default function AnalyticsView({ customers, technicians, bookings }: AnalyticsProps) {
  
  // Custom groupings calculations
  const topEarningCategories = [
    { name: 'Appliance Repair', volume: 182000, share: '36.7%', growth: '+15%' },
    { name: 'Electrician', volume: 124000, share: '25.0%', growth: '+22%' },
    { name: 'AC Mechanic', volume: 95000, share: '19.1%', growth: '+8%' },
    { name: 'Plumber', volume: 68000, share: '13.7%', growth: '-4%' },
    { name: 'Carpenter', volume: 26000, share: '5.5%', growth: '+14%' }
  ];

  const topCities = [
    { city: 'Mumbai', orders: 1540, income: 185000, activeTechs: 145 },
    { city: 'Delhi', orders: 1210, income: 142000, activeTechs: 120 },
    { city: 'Bangalore', orders: 980, income: 110000, activeTechs: 98 },
    { city: 'Dhaka', orders: 540, income: 58000, activeTechs: 48 },
    { city: 'Karachi', orders: 340, income: 42000, activeTechs: 32 }
  ];

  const topEarners = technicians
    .filter(t => t.status === 'Approved')
    .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
    .slice(0, 4);

  return (
    <div className="space-y-6" id="analytics-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="analytics-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Deep Corporate Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Audit comprehensive ledger indices, check municipal densities, & view technician leaderboards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="analytics-card-grid">
        
        {/* Category Share Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="category-share-panel">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
              <Layers className="h-4 w-4 text-cyan-400" /> Top Performing Categories
            </h3>
            <p className="text-[11px] text-slate-500">Transaction volume clustered by workforce discipline</p>
          </div>

          <div className="divide-y divide-slate-800" id="category-leaderboard">
            {topEarningCategories.map(cat => (
              <div key={cat.name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{cat.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Share: {cat.share}</p>
                </div>

                <div className="text-right font-mono">
                  <p className="font-bold text-white">₹{cat.volume.toLocaleString()}</p>
                  <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${cat.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cat.growth.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {cat.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="municipal-density-panel">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
              <MapPin className="h-4 w-4 text-purple-400" /> Municipal Densities & Income
            </h3>
            <p className="text-[11px] text-slate-500">Regional dispatch distributions & income gross values</p>
          </div>

          <div className="divide-y divide-slate-800" id="cities-leaderboard">
            {topCities.map(city => (
              <div key={city.city} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{city.city}</p>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">{city.activeTechs} active providers</p>
                </div>

                <div className="text-right font-mono">
                  <p className="font-bold text-white">₹{city.income.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">{city.orders} bookings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earners Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="provider-leaderboard-panel">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
              <Award className="h-4 w-4 text-amber-400" /> Rated Technician Leaderboard
            </h3>
            <p className="text-[11px] text-slate-500">Highest gross earners based on platform invoicing</p>
          </div>

          <div className="space-y-3" id="provider-leaderboard-ranks">
            {topEarners.map((tech, idx) => (
              <div key={tech.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs hover:border-slate-700 transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono font-bold w-4">#{idx+1}</span>
                  <img src={tech.avatar} alt={tech.name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-white text-[11px]">{tech.name}</p>
                    <p className="text-[9px] text-slate-500 font-sans">{tech.category}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="font-bold text-emerald-400">₹{(tech.revenueGenerated / 1000).toFixed(1)}k</p>
                  <p className="text-[9px] text-amber-500 flex items-center justify-end gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                    {tech.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
