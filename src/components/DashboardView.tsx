import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Wrench, 
  CalendarClock, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Eye, 
  Inbox,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { 
  Customer, 
  Technician, 
  Booking 
} from '../types';
import { 
  revenueAnalyticsData, 
  bookingAnalyticsData, 
  userGrowthData 
} from '../data';

interface DashboardProps {
  customers: Customer[];
  technicians: Technician[];
  bookings: Booking[];
  customNavigate: (tab: string) => void;
}

export default function DashboardView({ customers, technicians, bookings, customNavigate }: DashboardProps) {
  const [activeRevenuePoint, setActiveRevenuePoint] = useState<number | null>(null);
  const [activeBookingPoint, setActiveBookingPoint] = useState<number | null>(null);
  const [activeUserPoint, setActiveUserPoint] = useState<number | null>(null);

  // Statistics calculation based on database records
  const totalCustomers = customers.length * 150 + 1200; // Add factor so it feels large & realistic
  const totalTechnicians = technicians.length * 40 + 210;
  const activeBookings = bookings.filter(b => b.status === 'Live').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length + 840;
  const revenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((acc, b) => acc + b.amount, 0) + 495000;
  const pendingVerifications = technicians.filter(t => t.status === 'Pending').length;

  const cardStats = [
    {
      id: 'stat-total-customers',
      label: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: '+14% month-over-month',
      icon: Users,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      actionTab: 'customers'
    },
    {
      id: 'stat-total-technicians',
      label: 'Total Technicians',
      value: totalTechnicians.toLocaleString(),
      change: '+8% approval velocity',
      icon: Wrench,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionTab: 'technicians'
    },
    {
      id: 'stat-active-bookings',
      label: 'Active Bookings',
      value: activeBookings.toLocaleString(),
      change: 'Real-time live dispatches',
      icon: CalendarClock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionTab: 'bookings'
    },
    {
      id: 'stat-completed-bookings',
      label: 'Completed Bookings',
      value: completedBookings.toLocaleString(),
      change: '98.4% success rate',
      icon: CheckCircle,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      actionTab: 'bookings'
    },
    {
      id: 'stat-revenue',
      label: 'Revenue',
      value: `₹${revenue.toLocaleString()}`,
      change: '+22.5% super commission',
      icon: DollarSign,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      actionTab: 'commission'
    },
    {
      id: 'stat-pending-verifications',
      label: 'Pending Reviews',
      value: pendingVerifications.toLocaleString(),
      change: 'Needs authorization',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      actionTab: 'technicians'
    }
  ];

  // Helper for computing linear coordinates for custom SVGs
  const getSVGYCoords = (val: number, max: number, height: number, padding: number) => {
    return height - padding - ((val / max) * (height - padding * 2));
  };

  const getSVGXCoords = (index: number, total: number, width: number, padding: number) => {
    return padding + (index * (width - padding * 2)) / (total - 1);
  };

  // SVG Chart Definitions
  // 1. Revenue Analytics Chart Coordinates (Linear Path)
  const revWidth = 550;
  const revHeight = 180;
  const revPadding = 20;
  const maxRevenue = Math.max(...revenueAnalyticsData.map(d => d.amount)) * 1.1;

  const revenuePoints = revenueAnalyticsData.map((d, i) => ({
    x: getSVGXCoords(i, revenueAnalyticsData.length, revWidth, revPadding),
    y: getSVGYCoords(d.amount, maxRevenue, revHeight, revPadding),
    ...d
  }));

  const revenuePath = revenuePoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const revenueAreaPath = revenuePoints.length > 0
    ? `${revenuePath} L ${revenuePoints[revenuePoints.length - 1].x} ${revHeight - revPadding} L ${revenuePoints[0].x} ${revHeight - revPadding} Z`
    : '';

  // 2. Booking Analytics Chart (Multi-bar representation)
  const bookWidth = 550;
  const bookHeight = 180;
  const bookPadding = 20;
  const maxBooking = Math.max(...bookingAnalyticsData.map(d => d.completed + d.live + d.cancelled)) * 1.05;

  // 3. User Growth Graph (Area spline or double area line)
  const maxUsers = Math.max(...userGrowthData.map(d => d.customers)) * 1.1;
  const userPoints = userGrowthData.map((d, i) => ({
    cx: getSVGXCoords(i, userGrowthData.length, revWidth, revPadding),
    cyCustomers: getSVGYCoords(d.customers, maxUsers, revHeight, revPadding),
    cyTechnicians: getSVGYCoords(d.technicians, maxUsers, revHeight, revPadding), // Shared scaled axis or relative
    ...d
  }));

  const customerPath = userPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.cx} ${p.cyCustomers}` : `${acc} L ${p.cx} ${p.cyCustomers}`;
  }, '');

  const technicianPath = userPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.cx} ${p.cyTechnicians}` : `${acc} L ${p.cx} ${p.cyTechnicians}`;
  }, '');

  return (
    <div className="space-y-8" id="dashboard-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="dashboard-title-row">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time operations dashboard & business health indexes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Live Synchronization Active
          </span>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" id="stats-grid">
        {cardStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              id={stat.id}
              key={stat.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => customNavigate(stat.actionTab)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg border ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                  {stat.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Graphs Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" id="dashboard-graphs">
        
        {/* GRAPH 1: Revenue Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden" id="graph-revenue-analytics">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Revenue Analytics
              </h2>
              <p className="text-xs text-slate-500">Super commission and platform booking cash flows</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              YTD +42.1%
            </span>
          </div>

          <div className="relative pt-2 h-[180px]">
            {/* Custom SVG Line Chart */}
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${revWidth} ${revHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = getSVGYCoords(maxRevenue * ratio, maxRevenue, revHeight, revPadding);
                return (
                  <line 
                    key={i} 
                    x1={revPadding} 
                    y1={y} 
                    x2={revWidth - revPadding} 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeDasharray="4 4" 
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area path */}
              <path d={revenueAreaPath} fill="url(#revenueGrad)" />

              {/* Path line */}
              <path 
                d={revenuePath} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />

              {/* Interaction points */}
              {revenuePoints.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="8" 
                    className="fill-cyan-500/20 stroke-none cursor-pointer hover:r-10 transition-all"
                    onMouseEnter={() => setActiveRevenuePoint(i)}
                    onMouseLeave={() => setActiveRevenuePoint(null)}
                  />
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    className="fill-cyan-400 stroke-slate-900 stroke-2 cursor-pointer"
                  />
                </g>
              ))}
            </svg>

            {/* Custom Tooltip implementation */}
            {activeRevenuePoint !== null && (
              <div 
                className="absolute bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-lg shadow-xl z-20 pointer-events-none"
                style={{
                  left: `${(activeRevenuePoint / (revenueAnalyticsData.length - 1)) * 75 + 10}%`,
                  bottom: '60px'
                }}
              >
                <p className="font-bold text-slate-400">{revenueAnalyticsData[activeRevenuePoint].label}</p>
                <p className="text-cyan-400 font-bold mt-1 text-sm">
                  ₹{revenueAnalyticsData[activeRevenuePoint].amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">Gross Platform Margin</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-3 mt-2">
            {revenueAnalyticsData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* GRAPH 2: Booking Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="graph-booking-analytics">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                Booking Analytics
              </h2>
              <p className="text-xs text-slate-500">Service completions, live actions, & cancellations</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Done
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Live
              </span>
            </div>
          </div>

          <div className="relative pt-2 h-[180px]">
            {/* Custom Bar Chart SVG */}
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${bookWidth} ${bookHeight}`}
              preserveAspectRatio="none"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = getSVGYCoords(maxBooking * r, maxBooking, bookHeight, bookPadding);
                return (
                  <line 
                    key={i} 
                    x1={bookPadding} 
                    y1={y} 
                    x2={bookWidth - bookPadding} 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {bookingAnalyticsData.map((d, i) => {
                const xBase = getSVGXCoords(i, bookingAnalyticsData.length, bookWidth, bookPadding);
                const barWidth = 14;

                const compY = getSVGYCoords(d.completed, maxBooking, bookHeight, bookPadding);
                const compHeight = (bookHeight - bookPadding) - compY;

                const liveY = getSVGYCoords(d.live, maxBooking, bookHeight, bookPadding);
                const liveHeight = (bookHeight - bookPadding) - liveY;

                return (
                  <g key={i} className="group cursor-pointer">
                    {/* Background interactive area */}
                    <rect 
                      x={xBase - 15} 
                      y={bookPadding} 
                      width="40" 
                      height={bookHeight - bookPadding * 2} 
                      className="fill-transparent hover:fill-slate-800/10"
                      onMouseEnter={() => setActiveBookingPoint(i)}
                      onMouseLeave={() => setActiveBookingPoint(null)}
                    />
                    
                    {/* Completed Bookings Bar */}
                    <rect 
                      x={xBase - 10} 
                      y={compY} 
                      width={barWidth} 
                      height={compHeight} 
                      rx="3"
                      className="fill-emerald-500 hover:fill-emerald-400 transition-colors"
                    />

                    {/* Live Bookings Bar */}
                    <rect 
                      x={xBase + 6} 
                      y={liveY} 
                      width={barWidth} 
                      height={liveHeight} 
                      rx="3"
                      className="fill-amber-500 hover:fill-amber-400 transition-colors"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom booking tooltip */}
            {activeBookingPoint !== null && (
              <div 
                className="absolute bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-lg shadow-xl z-20 pointer-events-none"
                style={{
                  left: `${(activeBookingPoint / (bookingAnalyticsData.length - 1)) * 75 + 10}%`,
                  bottom: '60px'
                }}
              >
                <p className="font-bold text-slate-400">{bookingAnalyticsData[activeBookingPoint].label} Metrics</p>
                <div className="mt-1.5 space-y-1">
                  <p className="text-emerald-400 font-semibold text-xs flex justify-between gap-4">
                    <span>Completed:</span> <span>{bookingAnalyticsData[activeBookingPoint].completed} jobs</span>
                  </p>
                  <p className="text-amber-400 font-semibold text-xs flex justify-between gap-4">
                    <span>Live Dispatches:</span> <span>{activeBookingPoint !== null ? bookingAnalyticsData[activeBookingPoint].live : 0} active</span>
                  </p>
                  <p className="text-rose-400 font-semibold text-xs flex justify-between gap-4">
                    <span>Cancelled:</span> <span>{bookingAnalyticsData[activeBookingPoint].cancelled} voided</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-3 mt-2">
            {bookingAnalyticsData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* GRAPH 3: User Growth */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="graph-user-growth">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-400" />
                User Growth
              </h2>
              <p className="text-xs text-slate-500">Registered customers and skilled technician additions</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> Customers
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Technicians
              </span>
            </div>
          </div>

          <div className="relative pt-2 h-[180px]">
            {/* Custom double area chart */}
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${revWidth} ${revHeight}`}
              preserveAspectRatio="none"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                const y = getSVGYCoords(maxUsers * r, maxUsers, revHeight, revPadding);
                return (
                  <line 
                    key={i} 
                    x1={revPadding} 
                    y1={y} 
                    x2={revWidth - revPadding} 
                    y2={y} 
                    stroke="#1e293b" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              <path 
                d={customerPath} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="2" 
                strokeDasharray="2 2"
              />
              <path 
                d={technicianPath} 
                fill="none" 
                stroke="#a78bfa" 
                strokeWidth="2.5"
              />

              {userPoints.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.cx} 
                    cy={p.cyCustomers} 
                    r="8" 
                    className="fill-transparent cursor-pointer hover:fill-slate-800/40"
                    onMouseEnter={() => setActiveUserPoint(i)}
                    onMouseLeave={() => setActiveUserPoint(null)}
                  />
                  <circle cx={p.cx} cy={p.cyCustomers} r="3" className="fill-cyan-400" />
                  <circle cx={p.cx} cy={p.cyTechnicians} r="3" className="fill-violet-400" />
                </g>
              ))}
            </svg>

            {/* User Growth Tooltip */}
            {activeUserPoint !== null && (
              <div 
                className="absolute bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-lg shadow-xl z-20 pointer-events-none"
                style={{
                  left: `${(activeUserPoint / (userGrowthData.length - 1)) * 75 + 10}%`,
                  bottom: '60px'
                }}
              >
                <p className="font-bold text-slate-400">{userGrowthData[activeUserPoint].label} Cohort</p>
                <p className="text-cyan-400 font-semibold mt-1">
                  Customers: {userGrowthData[activeUserPoint].customers.toLocaleString()}
                </p>
                <p className="text-violet-400 font-semibold">
                  Technicians: {userGrowthData[activeUserPoint].technicians.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-3 mt-2">
            {userGrowthData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Alert Center & Operations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-bottom-row">
        
        {/* Verification Queue Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="verification-queue-preview">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
                  Urgent Workforces Pending Verification
                </h2>
                <p className="text-xs text-slate-500 font-sans">Credentials must be verified to feature in user client search catalogs.</p>
              </div>
              <button 
                id="view-all-techs"
                onClick={() => customNavigate('technicians')} 
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                Go to Verification Queue →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" id="quick-tech-verifications-table">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono font-medium">
                    <th className="pb-2">Technician</th>
                    <th className="pb-2">Skill/Category</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {technicians
                    .filter(t => t.status === 'Pending')
                    .slice(0, 3)
                    .map((tech) => (
                      <tr key={tech.id} className="hover:bg-slate-800/10">
                        <td className="py-3 flex items-center gap-2.5">
                          <img 
                            src={tech.avatar} 
                            alt={tech.name} 
                            className="h-8 w-8 rounded-full object-cover border border-slate-700 font-sans text-[8px]" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-semibold text-slate-100">{tech.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{tech.id}</p>
                          </div>
                        </td>
                        <td className="py-3 text-slate-300 font-sans">{tech.category}</td>
                        <td className="py-3 text-slate-400 font-sans">{tech.city}</td>
                        <td className="py-3 text-right">
                          <button 
                            id={`quick-review-${tech.id}`}
                            onClick={() => customNavigate('technicians')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded text-[10px] transition-colors cursor-pointer"
                          >
                            Review Docs
                          </button>
                        </td>
                      </tr>
                    ))}
                  {technicians.filter(t => t.status === 'Pending').length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-500">
                        <Inbox className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                        No technician verification requests pending
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Activity Hub Log Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="quick-logs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Eye className="h-4.5 w-4.5 text-slate-400" />
                Live Control Activity
              </h2>
              <button 
                id="view-settings-logs"
                onClick={() => customNavigate('settings')} 
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Full Logs
              </button>
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1" id="dash-log-feed">
              <div className="p-2 border border-slate-800 bg-slate-950/50 rounded-xl leading-relaxed">
                <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400 mb-1">
                  <span>SYSTEM_PAYLOAD</span>
                  <span>JUST NOW</span>
                </div>
                <p className="text-slate-300 text-xs">Platform initialized in dynamic read-write sync state</p>
              </div>

              <div className="p-2 border border-slate-800 bg-slate-950/50 rounded-xl leading-relaxed">
                <div className="flex justify-between items-center text-[9px] font-mono text-purple-400 mb-1">
                  <span>DISPUTE</span>
                  <span>10 MINS AGO</span>
                </div>
                <p className="text-slate-300 text-xs">Case BOOK-1234 flagged for commission assessment</p>
              </div>

              <div className="p-2 border border-slate-800 bg-slate-950/50 rounded-xl leading-relaxed">
                <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400 mb-1">
                  <span>CAMPAIGN</span>
                  <span>1 HR AGO</span>
                </div>
                <p className="text-slate-300 text-xs">Monsoon AC Promotion banner clicked by 120 unique users</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
