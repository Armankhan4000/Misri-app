import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Megaphone, 
  MapPin, 
  CalendarDays, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  Zap, 
  CheckCircle, 
  Wrench, 
  Eye, 
  X,
  Sparkles
} from 'lucide-react';
import { Banner, Technician } from '../types';

interface AdViewProps {
  banners: Banner[];
  technicians: Technician[];
  onCreateBanner: (newBanner: Omit<Banner, 'id' | 'clicks'>) => void;
  onDeleteBanner: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export default function AdvertisementManagementView({ 
  banners, 
  technicians, 
  onCreateBanner, 
  onDeleteBanner,
  onToggleFeatured
}: AdViewProps) {
  // Setup banner creator form states
  const [showCreator, setShowCreator] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600');
  const [location, setLocation] = useState('All Cities');
  const [startDate, setStartDate] = useState('2026-06-10');
  const [endDate, setEndDate] = useState('2026-07-10');
  const [scheduleDays, setScheduleDays] = useState<string[]>(['Saturday', 'Sunday']);

  const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (scheduleDays.includes(day)) {
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onCreateBanner({
      title,
      imageUrl,
      location,
      startDate,
      endDate,
      scheduleDays,
      status: 'Scheduled'
    });

    // Reset Form
    setTitle('');
    setLocation('All Cities');
    setScheduleDays(['Saturday', 'Sunday']);
    setShowCreator(false);
  };

  return (
    <div className="space-y-8" id="advertisement-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="ad-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Advertisement & Banners
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Build home screen promo banners, focus localized ads, and manage sponsored service providers
          </p>
        </div>
        <button
          id="btn-toggle-banner-form"
          onClick={() => setShowCreator(!showCreator)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {showCreator ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreator ? 'Cancel Creator' : 'Create Campaign Banner'}
        </button>
      </div>

      {/* Campaign creator drawer */}
      {showCreator && (
        <motion.div
          id="banner-creator-form-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6 text-white font-bold" id="creator-header">
            <Megaphone className="h-5 w-5 text-cyan-400" />
            <span>Create Hot Banner Campaign</span>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" id="banner-create-form">
            <div className="space-y-4">
              {/* Campaign Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">Campaign Title</label>
                <input
                  id="ad-input-title"
                  type="text"
                  required
                  placeholder="e.g., Monsoon Paint Special 15% Off"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">Banner Image URL</label>
                <input
                  id="ad-input-image"
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Geographic Location Targeting */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">Location Targeting</label>
                <input
                  id="ad-input-location"
                  type="text"
                  placeholder="e.g., Mumbai, Delhi, All Cities"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Campaign Schedule & Dates */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">Start Date</label>
                  <input
                    id="ad-input-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">End Date</label>
                  <input
                    id="ad-input-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Days schedule */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase block font-mono">Weekly Campaign Schedule</label>
                <div className="flex flex-wrap gap-1.5" id="schedule-days-selector">
                  {daysOptions.map(day => (
                    <button
                      id={`day-select-btn-${day}`}
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        scheduleDays.includes(day)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-500 border border-slate-800/80'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit creator action */}
              <button
                id="btn-ad-submit"
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors mt-2"
              >
                <CheckCircle className="h-4 w-4" /> Save and Deploy Ad Campaign
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Banner Advertisement lists */}
      <div className="space-y-4" id="banner-list-section">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Deployed App Home Banners</h3>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="banners-grid-layout">
          {banners.map((ban) => (
            <div
              id={`banner-card-${ban.id}`}
              key={ban.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:border-slate-700/60 transition-all"
            >
              <div className="w-full md:w-2/5 relative h-36 md:h-auto">
                <img 
                  src={ban.imageUrl} 
                  alt={ban.title} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold shadow-md ${
                  ban.status === 'Active' 
                    ? 'bg-emerald-600 text-white' 
                    : ban.status === 'Scheduled' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {ban.status}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between" id={`banner-card-info-${ban.id}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{ban.id}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-cyan-400" /> {ban.clicks} Clicks
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base leading-snug">{ban.title}</h4>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                    Target: <span className="font-semibold text-slate-300">{ban.location}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <CalendarDays className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                    Timeline: <span className="font-mono text-[10px] text-slate-300">{ban.startDate} to {ban.endDate}</span>
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ban.scheduleDays.map(day => (
                      <span key={day} className="text-[8px] font-sans font-black bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
                        {day.substring(0,3)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    id={`btn-delete-campaign-${ban.id}`}
                    onClick={() => onDeleteBanner(ban.id)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-800 text-rose-400 hover:text-rose-300 rounded border border-slate-800/60 hover:border-rose-500/10 cursor-pointer text-xs"
                    title="Terminate Campaign"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsored Technicians Management */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4" id="sponsored-technicians-section">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
            Sponsored & Priority Providers Setup
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Maintain top rated providers that receive visual badges & recommendation algorithm bumps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="sponsored-techs-grid">
          {technicians
            .filter(t => t.status === 'Approved')
            .map(tech => (
              <div 
                id={`sponsored-list-item-${tech.id}`}
                key={tech.id} 
                className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={tech.avatar} 
                    alt={tech.name} 
                    className="h-9 w-9 rounded-full object-cover border border-slate-800" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-white text-xs">{tech.name}</h5>
                    <p className="text-[10px] text-slate-500 font-sans">{tech.category} • {tech.rating} Stars</p>
                  </div>
                </div>

                <button
                  id={`btn-sponsor-toggle-${tech.id}`}
                  onClick={() => onToggleFeatured(tech.id)}
                  className={`px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    tech.isFeatured 
                      ? 'bg-amber-500/10 hover:bg-amber-550/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Zap className={`h-3 w-3 ${tech.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                  {tech.isFeatured ? 'Featured Priority' : 'Boost Listing'}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
