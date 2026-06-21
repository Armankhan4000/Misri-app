import React, { useState } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Users, 
  MapPin, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Eye, 
  Smartphone, 
  Target 
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'All' | 'Customers Only' | 'Technicians Only';
  targetCity: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'Active' | 'Scheduled' | 'Archived';
  viewsCount: number;
  createdAt: string;
}

export default function AnnouncementView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ANN-019',
      title: 'ঈদুল আজহা উপলক্ষে সার্ভিস বোনাস আপডেট ও অফার!',
      content: 'সম্মানিত মিস্ত্রি মেম্বারগণ, ঈদুল আজহা উপলক্ষে থাকছে বিশেষ কমিশন রেট। আগামী ২৩ জুন থেকে ২৬ জুন পর্যন্ত রেফারেল বোনাস এবং দৈনিক সম্পন্ন বুকিং ট্র্যাকিং টাস্কে থাকছে বাড়তি ৫০০ টাকা সরাসরি ওয়ালেট ক্যাশব্যাক বোনাস!',
      targetRole: 'Technicians Only',
      targetCity: 'Dhaka',
      scheduleDate: '2026-06-20',
      scheduleTime: '12:00',
      status: 'Active',
      viewsCount: 1420,
      createdAt: '2026-06-20'
    },
    {
      id: 'ANN-022',
      title: 'Monsoon Floods Disruption in Karwan Bazar Area',
      content: 'Safety team has marked Karwan Bazar and Tejgaon circle as red-zone risk due to high water clog waterlogged streets. Expect booking cancellations or slot delayed overrides for plumbing and AC diagnostics.',
      targetRole: 'All',
      targetCity: 'Dhaka',
      scheduleDate: '2026-06-21',
      scheduleTime: '08:00',
      status: 'Active',
      viewsCount: 412,
      createdAt: '2026-06-21'
    },
    {
      id: 'ANN-025',
      title: 'Upcoming App Maintenance Schedule: System Downtime',
      content: 'The core server databases will migrate cluster endpoints on June 28 at 02:00 AM. In-app client wallets, booking logs, and diagnostic requests will be frozen for 2 hours. Kindly lock active jobs early.',
      targetRole: 'All',
      targetCity: 'All Cities',
      scheduleDate: '2026-06-28',
      scheduleTime: '02:00',
      status: 'Scheduled',
      viewsCount: 0,
      createdAt: '2026-06-21'
    }
  ]);

  // Form State variables
  const [showCreator, setShowCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState<'All' | 'Customers Only' | 'Technicians Only'>('All');
  const [targetCity, setTargetCity] = useState('All Cities');
  const [scheduleDate, setScheduleDate] = useState('2026-06-22');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [isScheduled, setIsScheduled] = useState(false);

  // Submit Handler
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newAnn: Announcement = {
      id: `ANN-0${announcements.length + 20}`,
      title,
      content,
      targetRole,
      targetCity,
      scheduleDate: isScheduled ? scheduleDate : new Date().toISOString().split('T')[0],
      scheduleTime: isScheduled ? scheduleTime : new Date().toLocaleTimeString().slice(0, 5),
      status: isScheduled ? 'Scheduled' : 'Active',
      viewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAnnouncements([newAnn, ...announcements]);

    // Reset Form
    setTitle('');
    setContent('');
    setIsScheduled(false);
    setShowCreator(false);
  };

  const handleArchive = (id: string) => {
    setAnnouncements(announcements.map(ann => {
      if (ann.id === id) {
        return { ...ann, status: ann.status === 'Archived' ? 'Active' : 'Archived' };
      }
      return ann;
    }));
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  return (
    <div className="space-y-6" id="announcement-root">
      {/* Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-[#06b6d4] uppercase bg-cyan-950/40 border border-cyan-800/40 rounded-md font-mono mb-2 inline-block">
            In-App Messaging Matrix
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            ইন-অ্যাপ অ্যানাউন্সমেন্ট বোর্ড <span className="text-cyan-400 font-mono text-lg font-bold">/ Announcement Board</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            কাস্টমার ও সার্ভিস মিস্ত্রিদের ফোনে পুশ অ্যালার্ট হিসেবে ও অ্যাপ নোটিশ বোর্ডে সরাসরি প্রদর্শনের জন্য ব্রডকাস্ট নোটিশ ক্রিয়েট করুন।
          </p>
        </div>

        <button
          onClick={() => setShowCreator(!showCreator)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-905 text-xs font-black rounded-xl cursor-pointer flex items-center gap-1.5 self-start md:self-auto transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3px]" /> নোটিশ পোস্ট করুন
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator panel drawer */}
        <div className={`lg:col-span-1 space-y-4 ${showCreator ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans pb-3 border-b border-slate-800">
              <Megaphone className="h-4 w-4 text-cyan-400" /> ব্রডকাস্ট অ্যানাউন্সমেন্ট (Create Alert)
            </h3>

            <form onSubmit={handlePublish} className="space-y-4 text-xs font-sans">
              {/* Notice Title */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">নোটিশের শিরোনাম (Notice Title)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System upgrade notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Text Body */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">বিজ্ঞপ্তির বিবরণ (Description Content)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="বিস্তারিত বাংলায় অথবা ইংরেজিতে টাইপ করুন যাতে মিস্ত্রি বা ক্লায়েন্ট স্পষ্ট বুঝতে পারে..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-855 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              {/* Targeting specs */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-[8px]">গ্রাহক গ্রুপ (Target Aud.)</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value as any)}
                    className="w-full bg-slate-955 border border-slate-850 p-2 text-slate-300 rounded font-sans"
                  >
                    <option value="All">সকল গ্রাহক ও মিস্ত্রি (All)</option>
                    <option value="Customers Only">কাস্টমার মাত্র (Customers)</option>
                    <option value="Technicians Only">মিস্ত্রি পার্টনার মাত্র (Techs)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-505 font-bold uppercase tracking-wider block text-[8px]">শহর (Targeting City)</label>
                  <select
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-850 p-2 text-slate-300 rounded font-sans"
                  >
                    <option value="All Cities">সকল শহর (All Cities)</option>
                    <option value="Dhaka">ঢাকা (Dhaka)</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Karachi">Karachi</option>
                  </select>
                </div>
              </div>

              {/* Schedule switch */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">Schedule Notice Post?</span>
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="h-4 w-4 bg-slate-900 border-slate-850 rounded"
                  />
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-2 animate-slide-in">
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="bg-slate-900 p-1.5 border border-slate-800 text-[10px] text-white rounded font-mono"
                    />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="bg-slate-900 p-1.5 border border-slate-800 text-[10px] text-white rounded font-mono"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.01] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Smartphone className="h-4 w-4" />
                <span>{isScheduled ? 'তফসিল অনুযায়ী শিডিউল করুন' : 'তৎক্ষণাৎ পোস্ট করুন (Publish Now)'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Existing Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-205">ব্রডকাস্ট নোটিশ হিস্টোরি (Active and Scheduled Feeds)</span>
            <span className="text-[10px] text-slate-505 font-mono">Platform Nodes: Online</span>
          </div>

          <div className="space-y-4 max-h-[570px] overflow-y-auto pr-1">
            {announcements.map((ann) => (
              <div 
                key={ann.id}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 relative overflow-hidden transition-all hover:border-slate-700/60`}
              >
                {/* Targeting Pill overlay */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-slate-950 text-cyan-400 font-mono text-[9px] font-bold rounded-md flex items-center gap-1 border border-slate-850">
                        <Target className="h-2.5 w-2.5" /> {ann.targetRole}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-950 text-purple-400 font-mono text-[9px] font-bold rounded-md flex items-center gap-1 border border-slate-850">
                        <MapPin className="h-2.5 w-2.5" /> {ann.targetCity}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold border ${
                        ann.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        ann.status === 'Scheduled' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-slate-950 text-slate-500 border-slate-850'
                      }`}>
                        {ann.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white leading-snug">{ann.title}</h4>
                  </div>

                  <span className="text-[10px] text-slate-505 font-mono shrink-0">#{ann.id}</span>
                </div>

                <p className="text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-wrap">{ann.content}</p>

                {/* Footer Metrics and Actions */}
                <div className="pt-3.5 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                  <div className="flex items-center gap-4 text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-500" />
                      <strong>{ann.viewsCount.toLocaleString()}</strong> views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Publish window: {ann.scheduleDate} {ann.scheduleTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleArchive(ann.id)}
                      className="px-2.5 py-1 hover:bg-slate-800 text-slate-400 border border-slate-800 hover:border-slate-700 font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {ann.status === 'Archived' ? 'Unarchive' : 'Archive'}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1 px-1.5 bg-rose-950/20 hover:bg-rose-900/30 text-rose-450 border border-rose-800/30 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
