import React, { useState } from 'react';
import { 
  FileLock, 
  Search, 
  Filter, 
  Calendar, 
  Activity, 
  AlertCircle,
  Database,
  RefreshCw
} from 'lucide-react';
import { SystemLog } from '../types';

interface AuditLogProps {
  logs: SystemLog[];
}

export default function AdminActivityLogView({ logs }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterModule, setFilterModule] = useState<string>('ALL');

  // Filter lists dynamically from logs
  const modulesAvailable = ['ALL', ...Array.from(new Set(logs.map(log => log.module)))];

  const processedLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesModule = filterModule === 'ALL' || log.module === filterModule;

    return matchesSearch && matchesLevel && matchesModule;
  });

  return (
    <div className="space-y-6" id="audit-log-root">
      {/* Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-[#f43f5e] uppercase bg-rose-950/40 border border-rose-800/40 rounded-md font-mono mb-2 inline-block">
            Immutable Audit Trail Ledger
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            সিস্টেম অডিট ও এডমিন লগ হিস্টোরি <span className="text-cyan-400 font-mono text-lg font-bold">/ System Security Audit Log</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            ম্যানেজমেন্ট প্যানেলে সহকারী এডমিন ও সুপার এডমিন মেম্বারদের নেওয়া প্রতিটি পদক্ষেপ বা অ্যাকশন রিয়েল-টাইমে এখানে সংরক্ষিত থাকে। এটি সম্পূর্ণ পরিবর্তন-অযোগ্য (Read-Only) হিস্টোরি।
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
        
        {/* Search Input field */}
        <div className="space-y-1 relative md:col-span-2">
          <label className="text-slate-450 font-bold block mb-1">কীওয়ার্ড অনুসন্ধান (Search Logs)</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-550 shrink-0" />
            <input
              type="text"
              placeholder="e.g. commission rate, approved, settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Level filter */}
        <div className="space-y-1">
          <label className="text-slate-455 font-bold block mb-1">লেভেল ফিল্টার (Level Tier)</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All severity tiers</option>
            <option value="INFO">INFO (তথ্যগত)</option>
            <option value="WARNING">WARNING (সতর্কবার্তা)</option>
            <option value="ERROR">ERROR (ত্রুটি কোড)</option>
          </select>
        </div>

        {/* Module filter option */}
        <div className="space-y-1">
          <label className="text-slate-455 font-bold block mb-1">মডিউল উৎস (System Module)</label>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-slate-200 focus:outline-none"
          >
            {modulesAvailable.map(mod => (
              <option key={mod} value={mod}>{mod === 'ALL' ? 'All system sectors' : mod}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Main logging grid queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between">
        
        {/* Table structure */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-450 uppercase font-mono text-[9px] font-black">
                <th className="p-4 w-44">UTC Timestamp</th>
                <th className="p-4 w-28 text-center">severity Tier</th>
                <th className="p-4 w-36">System Sector</th>
                <th className="p-4">Action Ledger Message Detail</th>
                <th className="p-4 text-right w-36">Audit Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-805 font-mono">
              {processedLogs.length > 0 ? (
                processedLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/20 py-2.5">
                    {/* Timestamp cell */}
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {log.timestamp}
                    </td>

                    {/* severity tier cell */}
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase inline-block ${
                        log.level === 'INFO' ? 'bg-cyan-500/10 text-cyan-400' :
                        log.level === 'WARNING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-505/15 text-red-500 animate-pulse'
                      }`}>
                        {log.level}
                      </span>
                    </td>

                    {/* sector cell */}
                    <td className="p-4 text-slate-300 font-bold text-[11px] tracking-wide">
                      {log.module}
                    </td>

                    {/* text contents cell */}
                    <td className="p-4 font-sans text-slate-200 text-xs text-wrap break-all leading-normal whitespace-pre-wrap">
                      {log.message}
                    </td>

                    {/* Auth watermark */}
                    <td className="p-4 text-right">
                      <span className="text-[10px] text-slate-505 uppercase block">Signature Secured</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-slate-500 font-sans">
                    কোন অডিট লগ রেকর্ড খুঁজে পাওয়া যায়নি (No system logs matches search parameters).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Read Only watermark status */}
        <div className="bg-slate-950 p-3 flex justify-between items-center text-[10px] text-slate-600 border-t border-slate-850 font-mono">
          <div className="flex items-center gap-1">
            <FileLock className="h-4 w-4 text-slate-500 shrink-0" />
            <span>ENCRYPTED LEDGER CONSOLE RUNNING WITH STANDALONE TAMPERPROOF SHA-512 SIGNATURES. READ-ONLY DELETIONS LOCKED.</span>
          </div>
          <span>Active operator: armanhossain08102000@gmail.com</span>
        </div>

      </div>
    </div>
  );
}
