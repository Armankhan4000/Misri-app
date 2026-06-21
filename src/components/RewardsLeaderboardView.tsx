import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Search, 
  HelpCircle, 
  Crown, 
  Check, 
  Plus, 
  ArrowRight, 
  HardHat, 
  Gift, 
  Tv 
} from 'lucide-react';
import { Technician } from '../types';

interface LeaderboardProps {
  technicians: Technician[];
  onRewardWallet?: (techId: string, amount: number, memo: string) => void;
}

export default function RewardsLeaderboardView({ technicians, onRewardWallet }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [badgesState, setBadgesState] = useState<{ [key: string]: 'Gold' | 'Silver' | 'Bronze' | 'None' }>({
    'TECH-101': 'Gold',
    'TECH-104': 'Gold',
    'TECH-102': 'Silver',
    'TECH-103': 'Bronze',
    'TECH-105': 'None',
    'TECH-106': 'None'
  });

  // Reward state variables
  const [rewardAmount, setRewardAmount] = useState(1000);
  const [rewardMemo, setRewardMemo] = useState('Excellent performance weekly bonus');
  const [targetTechId, setTargetTechId] = useState('TECH-101');
  const [successMsg, setSuccessMsg] = useState('');

  // Sorter / Filter core
  const getLeaderboardData = () => {
    let list = [...technicians];
    if (selectedCategory !== 'ALL') {
      list = list.filter(t => t.category === selectedCategory);
    }

    // Sort by weighted rank index: rating * completedJobs + revenue
    return list.sort((a, b) => {
      const weightA = a.rating * a.jobsCompleted + (a.revenueGenerated / 100);
      const weightB = b.rating * b.jobsCompleted + (b.revenueGenerated / 100);
      return weightB - weightA;
    });
  };

  const rankedTechs = getLeaderboardData();

  const handleAssignBadge = (techId: string, badge: 'Gold' | 'Silver' | 'Bronze' | 'None') => {
    setBadgesState({
      ...badgesState,
      [techId]: badge
    });
  };

  const handleTriggerBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTechId || rewardAmount <= 0) return;

    if (onRewardWallet) {
      onRewardWallet(targetTechId, rewardAmount, rewardMemo);
    }

    const tech = technicians.find(t => t.id === targetTechId);
    setSuccessMsg(`৳${rewardAmount.toLocaleString()} cash credit successfully released to ${tech?.name}'s Mistri System Wallet!`);
    
    setTimeout(() => setSuccessMsg(''), 4500);

    // Reset Form
    setRewardMemo('Performance leaderboard reward');
  };

  return (
    <div className="space-y-6" id="leaderboard-root">
      {/* Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-[#d97706] uppercase bg-amber-950/40 border border-amber-800/40 rounded-md font-mono mb-2 inline-block">
            Mistri Reward Systems v3.0
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            লিডারবোর্ড ও মিস্ত্রি পুরষ্কার <span className="text-cyan-400 font-mono text-lg font-bold">/ Leaderboard & Badges</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            সরাসরি কাজের সংখ্যা, চমৎকার রেটিং এবং আয়ের ভিত্তিতে রিয়েল-টাইম লিডারবোর্ড ট্র্যাকিং করুন, মেডেল ব্যাজ সেট করুন এবং সরাসরি ওয়ালেটে বোনাস কমিশন ক্রেডিট পাঠিয়ে দিন।
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl flex items-center gap-2 text-xs text-emerald-400 font-sans animate-slide-in">
          <Check className="h-4 w-4 shrink-0 stroke-[3px]" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Leaderboard Queue table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filters selectors */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">সময়সূচী (Timeframe):</span>
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold font-mono ${
                  timeframe === 'weekly' ? 'bg-cyan-600 border-cyan-800 text-slate-950' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                WEEKLY (সাপ্তাহিক)
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold font-mono ${
                  timeframe === 'monthly' ? 'bg-cyan-600 border-cyan-800 text-slate-950' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                MONTHLY (মাসিক)
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold shrink-0">ক্যাটাগরি:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-1.5 text-slate-200 text-xs rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Disciplines</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="AC Mechanic">AC Mechanic</option>
              </select>
            </div>
          </div>

          {/* Leaderboard Table rows */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-450 uppercase font-mono text-[9px] font-black">
                  <th className="p-4 w-12 text-center">Rank</th>
                  <th className="p-4">Technician Partner</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4 text-center">Jobs Done</th>
                  <th className="p-4 text-center">Score rating</th>
                  <th className="p-4 text-center">Earned Revenue</th>
                  <th className="p-4 text-center">Mistri Badge VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {rankedTechs.map((tech, idx) => {
                  const badge = badgesState[tech.id] || 'None';
                  const isTopThree = idx < 3;
                  return (
                    <tr key={tech.id} className="hover:bg-slate-850/30 transition-all">
                      {/* Rank Indicator */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {isTopThree ? (
                            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-black font-mono text-[11px] ${
                              idx === 0 ? 'bg-yellow-500 text-slate-950 shadow-inner ring-2 ring-yellow-400/20' :
                              idx === 1 ? 'bg-slate-400 text-slate-950' : 'bg-amber-700 text-slate-950'
                            }`}>
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="text-slate-505 font-mono text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                      </td>

                      {/* Bio */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={tech.avatar} alt="tech avatar" className="h-8 w-8 rounded-full border border-slate-805 object-cover shrink-0" referrerPolicy="referrer" />
                          <div>
                            <span className="font-bold text-[#f7fafc] block">{tech.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono italic">{tech.city}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-350">{tech.category}</td>
                      <td className="p-4 text-center font-mono font-bold text-slate-200">{tech.jobsCompleted}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 font-mono font-bold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{tech.rating > 0 ? tech.rating.toFixed(1) : 'No Rating'}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center font-mono font-black text-emerald-450">
                        ৳{tech.revenueGenerated.toLocaleString()}
                      </td>

                      {/* Badge Controller toggles */}
                      <td className="p-4">
                        <div className="flex justify-center">
                          <select
                            value={badge}
                            onChange={(e) => handleAssignBadge(tech.id, e.target.value as any)}
                            className={`p-1.5 text-[9px] font-black uppercase rounded-lg font-mono border focus:outline-none ${
                              badge === 'Gold' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 font-extrabold' :
                              badge === 'Silver' ? 'bg-slate-300/10 text-slate-300 border-slate-400/35' :
                              badge === 'Bronze' ? 'bg-amber-600/10 text-amber-600 border-amber-600/20' : 'bg-slate-950 text-slate-500 border-slate-850'
                            }`}
                          >
                            <option value="None">No Badge</option>
                            <option value="Gold">🎖️ Gold</option>
                            <option value="Silver">🥈 Silver</option>
                            <option value="Bronze">🥉 Bronze</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reward Bonus Trigger box */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans pb-3 border-b border-slate-800">
              <Gift className="h-4 w-4 text-yellow-500 animate-bounce" /> বোনাস পুরষ্কার রিলিজ ফর্ম (Send Cash Credit)
            </h3>

            <form onSubmit={handleTriggerBonus} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-405 font-bold uppercase tracking-wider block text-[8px]">১. মিস্ত্রি মেম্বার সিলেক্ট করুন (Select Mistri Partner)</label>
                <select
                  value={targetTechId}
                  onChange={(e) => setTargetTechId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-3 text-slate-200 text-xs rounded-xl focus:outline-none"
                >
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category} - {t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-405 font-bold uppercase tracking-wider block text-[8px]">২. বোনাস এমাউন্ট (Reward Value - BDT)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">৳</span>
                  <input
                    type="number"
                    required
                    min={100}
                    max={10000}
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-8 pr-3 py-2.5 text-slate-200 text-xs font-mono font-bold focus:outline-none"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-405 font-bold uppercase tracking-wider block text-[8px]">৩. ওয়ালেট ট্রানজেকশন কমেন্ট (Memo Statement)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eid special top plumber performance reward"
                  value={rewardMemo}
                  onChange={(e) => setRewardMemo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-[1.01] text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Award className="h-4 w-4" />
                <span>সিস্টেম ওয়ালেটে বোনাস পাঠান (Release Bonus)</span>
              </button>
            </form>
          </div>

          {/* Quick Informational stats box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 space-y-3">
            <span className="font-bold text-white block uppercase tracking-wider text-[10px]">REWARDS POLICIES INFO & DISCIPLINE</span>
            <p className="leading-relaxed">
              Every month, the platform automatically flags top-performing partners and suggests badge upgrades based on completed jobs, average rating, and lower cancellation rates.
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-855 space-y-1">
              <div className="flex justify-between">
                <span>Gold Badge Standard:</span>
                <span className="text-yellow-500 font-bold">50+ Jobs, 4.8★</span>
              </div>
              <div className="flex justify-between">
                <span>Silver Badge Standard:</span>
                <span className="text-slate-350 font-bold">30+ Jobs, 4.5★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
