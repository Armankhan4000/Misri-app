import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Search, 
  CheckCircle, 
  XSquare, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  Award, 
  FileText, 
  Download, 
  UserCheck, 
  X,
  Gauge,
  MapPin
} from 'lucide-react';
import { Technician } from '../types';

interface TechnicianViewProps {
  technicians: Technician[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleSuspend: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onUpdateVerification?: (id: string, updates: Partial<Technician>) => void;
  onViewLocation?: (id: string) => void;
}

export default function TechnicianManagementView({ 
  technicians, 
  onApprove, 
  onReject, 
  onToggleSuspend, 
  onToggleFeatured,
  onUpdateVerification,
  onViewLocation
}: TechnicianViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'Pending' | 'Approved' | 'Suspended'>('Pending');
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);

  // Editable draft states for the active technician details modal
  const selectedTech = technicians.find(t => t.id === selectedTechId);
  const [techNid, setTechNid] = useState('');
  const [techNidVerified, setTechNidVerified] = useState(false);
  const [techPoliceVerified, setTechPoliceVerified] = useState(false);
  const [techExpYears, setTechExpYears] = useState(1);

  React.useEffect(() => {
    if (selectedTech) {
      setTechNid(selectedTech.nidNumber || '');
      setTechNidVerified(!!selectedTech.nidVerified);
      setTechPoliceVerified(!!selectedTech.policeVerified);
      setTechExpYears(selectedTech.experienceYears || 1);
    }
  }, [selectedTechId, selectedTech]);

  const filteredTechs = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tech.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tech.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tech.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && tech.status === tab;
  });

  return (
    <div className="space-y-6" id="technician-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="technician-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Technician Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Perform KYC verifications, feature top builders, & audit performance
          </p>
        </div>
      </div>

      {/* Verification Queue & Active Filters Navigation Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl" id="technician-controls">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="search-technicians-input"
            type="text"
            placeholder="Search technician name, skill, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2" id="technician-tabs">
          {(['Pending', 'Approved', 'Suspended'] as const).map((t) => {
            const count = technicians.filter(tech => tech.status === t).length;
            return (
              <button
                id={`tech-tab-selector-${t}`}
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer relative transition-all ${
                  tab === t 
                    ? 'bg-cyan-600 text-slate-950 shadow-md shadow-cyan-600/10' 
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {t === 'Pending' ? 'Verification Queue' : t === 'Approved' ? 'Approved List' : 'Suspended List'}
                <span className={`ml-2 px-1.5 py-0.5 text-[9px] font-mono rounded ${
                  tab === t 
                    ? 'bg-slate-950 text-cyan-400' 
                    : 'bg-slate-900 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Technicians Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="technicians-grid">
        {filteredTechs.map((tech) => (
          <motion.div
            id={`tech-card-${tech.id}`}
            layout
            key={tech.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/60 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between relative overflow-hidden"
          >
            {/* Banner element indicating status / featured */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-slate-900 flex">
              {tech.isFeatured && <div className="flex-1 bg-amber-500" />}
              {tech.status === 'Approved' && !tech.isFeatured && <div className="flex-1 bg-cyan-500" />}
              {tech.status === 'Pending' && <div className="flex-1 bg-rose-500 animate-pulse" />}
              {tech.status === 'Suspended' && <div className="flex-1 bg-slate-600" />}
            </div>

            <div>
              {/* Header section with status & info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <img 
                    src={tech.avatar} 
                    alt={tech.name} 
                    className="h-12 w-12 rounded-xl object-cover border border-slate-800" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-base font-sans">{tech.name}</h3>
                      {tech.isFeatured && (
                        <Award className="h-4 w-4 text-amber-400 shrink-0" title="Featured Member" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{tech.category}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.id} • {tech.city}</p>
                  </div>
                </div>

                {onViewLocation && (
                  <button
                    id={`btn-track-tech-${tech.id}`}
                    onClick={() => onViewLocation(tech.id)}
                    className="p-1.5 px-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 rounded-lg border border-cyan-800/30 font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1 shadow-sm text-[10px]"
                    title="লোকেশন ট্র্যাকিং দেখুন"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <span>লোকেশন</span>
                  </button>
                )}
              </div>

              {/* Performance Indicator Metrics */}
              {tech.status !== 'Pending' && (
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/60 text-center mb-4 text-xs" id={`performance-metrics-${tech.id}`}>
                  <div>
                    <p className="text-slate-500 text-[9px] uppercase font-mono">Rating</p>
                    <p className="font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-0.5 font-mono">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                      {tech.rating > 0 ? tech.rating.toFixed(1) : 'New'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[9px] uppercase font-mono">Jobs Done</p>
                    <p className="font-bold text-slate-200 mt-0.5 font-mono">{tech.jobsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[9px] uppercase font-mono">Earnings</p>
                    <p className="font-bold text-emerald-400 mt-0.5 font-mono">₹{(tech.revenueGenerated / 1000).toFixed(1)}k</p>
                  </div>
                </div>
              )}

              {/* Verification Queue items specifically */}
              {tech.status === 'Pending' && (
                <div className="bg-slate-950/60 border border-slate-800/40 rounded-lg p-3 mb-3 space-y-2.5" id={`kyc-details-${tech.id}`}>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Credentials Submitted
                  </p>
                  <div className="flex justify-between items-center text-xs text-slate-350">
                    <span className="truncate max-w-[120px] text-[11px] font-sans">Govt ID & Utility Certification</span>
                    <a 
                      href={tech.documentUrl || '#'} 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('This initiates secure download of Gov Identification Document (NID) for ' + tech.name);
                      }} 
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-semibold cursor-pointer underline"
                    >
                      <Download className="h-3 w-3" /> Get Docs
                    </a>
                  </div>
                </div>
              )}

              {/* Security Shield & Anti-Fake Oversight Panel */}
              <div className="bg-slate-950/55 rounded-xl p-3 mb-3 border border-slate-850/80 space-y-2" id={`security-shield-${tech.id}`}>
                <div className="flex justify-between items-center pb-0.5 border-b border-slate-900">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                    Verified Oversight
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Exp: {tech.experienceYears || 1} Yrs</span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                  {/* NID Input inline toggle */}
                  <div className="flex items-center justify-between pb-0.5">
                    <span className="text-[11px] text-slate-400 font-sans">NID: <span className="font-mono text-white text-[10px]">{tech.nidNumber || 'Not configured'}</span></span>
                    <button
                      id={`tech-toggle-nid-${tech.id}`}
                      onClick={() => {
                        onUpdateVerification?.(tech.id, { 
                          nidVerified: !tech.nidVerified,
                          nidNumber: tech.nidNumber || `BD-NID-${Math.floor(Math.random() * 900000) + 100000}`
                        });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        tech.nidVerified 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}
                    >
                      {tech.nidVerified ? 'Verified ID ✓' : 'Verify NID ⚙'}
                    </button>
                  </div>

                  {/* Police clearance toggle */}
                  <div className="flex items-center justify-between pb-0.5">
                    <span className="text-[11px] text-slate-400 font-sans">Police Background</span>
                    <button
                      id={`tech-toggle-police-${tech.id}`}
                      onClick={() => {
                        onUpdateVerification?.(tech.id, { policeVerified: !tech.policeVerified });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        tech.policeVerified 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                      }`}
                    >
                      {tech.policeVerified ? 'Cleared ✓' : 'Uncleared ⚙'}
                    </button>
                  </div>

                  {/* Years of Experience Editor */}
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[11px] text-slate-400 font-sans">Experience Years</span>
                    <div className="flex items-center gap-1.5" id={`exp-picker-${tech.id}`}>
                      <button
                        id={`btn-exp-dec-${tech.id}`}
                        onClick={() => {
                          const nextExp = Math.max(1, (tech.experienceYears || 1) - 1);
                          onUpdateVerification?.(tech.id, { experienceYears: nextExp });
                        }}
                        className="h-5 w-5 bg-slate-800 hover:bg-slate-700 text-xs font-black rounded flex items-center justify-center cursor-pointer text-slate-300"
                        title="Decrement experience years"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold text-white w-4 text-center">{tech.experienceYears || 1}</span>
                      <button
                        id={`btn-exp-inc-${tech.id}`}
                        onClick={() => {
                          const nextExp = (tech.experienceYears || 1) + 1;
                          onUpdateVerification?.(tech.id, { experienceYears: nextExp });
                        }}
                        className="h-5 w-5 bg-slate-800 hover:bg-slate-700 text-xs font-black rounded flex items-center justify-center cursor-pointer text-slate-300"
                        title="Increment experience years"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid card actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-800/40">
              {tech.status === 'Pending' ? (
                <>
                  <button
                    id={`btn-approve-${tech.id}`}
                    onClick={() => onApprove(tech.id)}
                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    id={`btn-reject-${tech.id}`}
                    onClick={() => onReject(tech.id)}
                    className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-800 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <XSquare className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              ) : (
                <>
                  <button
                    id={`btn-feature-${tech.id}`}
                    onClick={() => onToggleFeatured(tech.id)}
                    className={`flex-1 py-1.5 border font-semibold rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 relative cursor-pointer transition-all ${
                      tech.isFeatured 
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-text-amber-300 border-amber-500/30' 
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Star className={`h-3 w-3 ${tech.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                    {tech.isFeatured ? 'Featured' : 'Make Featured'}
                  </button>
                  <button
                    id={`btn-suspend-tech-${tech.id}`}
                    onClick={() => onToggleSuspend(tech.id)}
                    className={`flex-1 py-1.5 font-semibold rounded-lg text-[10px] sm:text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      tech.status === 'Approved' 
                        ? 'bg-slate-950 hover:bg-rose-550/10 text-rose-400 border border-slate-800 hover:border-rose-500/20' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {tech.status === 'Approved' ? 'Suspend' : 'Activate'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}

        {filteredTechs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl" id="empty-techs-card">
            No technicians catalogued under this tab search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
