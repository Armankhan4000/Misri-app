import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  MessageSquare, 
  Megaphone, 
  Smartphone, 
  Send, 
  Target, 
  Users, 
  Wrench, 
  Database,
  History,
  CheckCircle,
  Inbox
} from 'lucide-react';

export default function NotificationsSenderView() {
  const [activeTab, setActiveTab] = useState<'Push' | 'Sms' | 'Announcements'>('Push');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Push notification state
  const [pushTitle, setPushTitle] = useState('Monsoon AC Service Special!');
  const [pushBody, setPushBody] = useState('Monsoon has arrived! Book premium AC mechanics at 25% flat cashback now.');
  const [pushTarget, setPushTarget] = useState<'all' | 'customers' | 'technicians'>('all');

  // 2. SMS Campaign state
  const [smsBody, setSmsBody] = useState('Hi {customer_name}, your dispatch booking {booking_id} is verified. Skilled Mistri represents Havells is heading.');
  const [smsCohort, setSmsCohort] = useState<'all' | 'customers'>('customers');

  // 3. System Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('Upcoming Regulatory Compliance Checklist update');
  const [announcementBody, setAnnouncementBody] = useState('To adhere to newly enacted national technician work regulations, secondary verification of digital identity cards (NID) will occur on June 15.');

  // Prepopulated logs
  const [dispatchedNotices, setDispatchedNotices] = useState([
    { id: 'not-01', title: 'Emergency Cyclone AC service support', body: 'AC Mechanics in coastal zones receive dynamic hazard rate offsets.', target: 'Technicians', timestamp: '2026-06-08 14:22', style: 'Push' },
    { id: 'not-02', title: 'System-wide Server Upgrade Window', body: 'Admin control panel offline on June 11, 01:00 UTC', target: 'All', timestamp: '2026-06-05 09:00', style: 'Announcement' }
  ]);

  const triggerSuccessAlert = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle || !pushBody) return;

    setDispatchedNotices([
      {
        id: `not-${Math.floor(Math.random() * 1000)}`,
        title: pushTitle,
        body: pushBody,
        target: pushTarget === 'all' ? 'All' : pushTarget === 'customers' ? 'Customers' : 'Technicians',
        timestamp: 'Just Now',
        style: 'Push'
      },
      ...dispatchedNotices
    ]);

    triggerSuccessAlert(`Push Alert successfully broadcasted to ${pushTarget} cohort!`);
    
    // Clear
    setPushTitle('');
    setPushBody('');
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsBody) return;

    setDispatchedNotices([
      {
        id: `not-${Math.floor(Math.random() * 1000)}`,
        title: 'Bulk SMS Campaign Broadcast',
        body: smsBody,
        target: smsCohort === 'all' ? 'All' : 'Customers',
        timestamp: 'Just Now',
        style: 'SMS'
      },
      ...dispatchedNotices
    ]);

    triggerSuccessAlert(`Bulk SMS Campaign successfully dispatched via Twilio/SMS API Gateway.`);
    setSmsBody('');
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) return;

    setDispatchedNotices([
      {
        id: `not-${Math.floor(Math.random() * 1000)}`,
        title: announcementTitle,
        body: announcementBody,
        target: 'All dashboard panels',
        timestamp: 'Just Now',
        style: 'Announcement'
      },
      ...dispatchedNotices
    ]);

    triggerSuccessAlert('Global announcement pinned successfully to user dashboard home feeds!');
    setAnnouncementTitle('');
    setAnnouncementBody('');
  };

  return (
    <div className="space-y-6" id="notifications-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="notification-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            App Notification Hub
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dispatch instant notifications, build SMS marketing campaigns, & broadcast global compliance notices
          </p>
        </div>
      </div>

      {/* Success Banner toaster inside view */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2"
            id="toast-notification-success"
          >
            <CheckCircle className="h-4.5 w-4.5" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Segment navigation subtab */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3 font-sans" id="notif-segments">
        {[
          { id: 'Push', label: 'Push Broadcast Alerts', icon: Bell },
          { id: 'Sms', label: 'SMS campaigns & Text templates', icon: MessageSquare },
          { id: 'Announcements', label: 'Compliance Announcements', icon: Megaphone }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              id={`notif-tab-select-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-600 text-slate-950 font-extrabold' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="notif-content-layout">
        
        {/* LEFT COLUMN: Broadcasting Forms */}
        <div className="lg:col-span-7 space-y-6" id="notif-creator-column">
          
          {/* Broadcaster 1: Push Broadcasts */}
          {activeTab === 'Push' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5" id="push-creator-card">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Bell className="h-4.5 w-4.5 text-cyan-400" />
                <span>Broadcaster System Push Notification</span>
              </div>

              <form onSubmit={handleSendPush} className="space-y-4" id="push-creation-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Push Header Notification</label>
                  <input
                    id="push-input-title"
                    type="text"
                    required
                    placeholder="e.g., Get ₹300 Plumbing Discount Today"
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Push Payload Body Message</label>
                  <textarea
                    id="push-input-body"
                    required
                    rows={3}
                    placeholder="Limit to 120 characters for clean mobile viewing..."
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                {/* Target filters */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Target Auditing Cohort</label>
                  <div className="flex gap-4">
                    {[
                      { id: 'all', label: 'All Users', icon: Target },
                      { id: 'customers', label: 'Customers Only', icon: Users },
                      { id: 'technicians', label: 'Technicians Only', icon: Wrench }
                    ].map(cohort => (
                      <button
                        id={`push-cohort-select-${cohort.id}`}
                        key={cohort.id}
                        type="button"
                        onClick={() => setPushTarget(cohort.id as any)}
                        className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          pushTarget === cohort.id 
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <cohort.icon className="h-4 w-4 shrink-0" />
                        <span>{cohort.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="btn-broadcast-push"
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Broadcast Push Notification payload
                </button>
              </form>
            </div>
          )}

          {/* Broadcaster 2: SMS text messaging */}
          {activeTab === 'Sms' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5" id="sms-creator-card">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                <span>SMS Bulks Campaign Broadcast (Twilio API Integration)</span>
              </div>

              <form onSubmit={handleSendSms} className="space-y-4" id="sms-campaign-form">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <label className="font-bold text-slate-400 uppercase block">Character Text Template</label>
                    <span className="text-slate-500 font-bold">Recommended: Under 160 characters</span>
                  </div>
                  <textarea
                    id="sms-input-body"
                    required
                    rows={4}
                    placeholder="Use placeholders like {customer_name}, {booking_id} to automatically bind data tags..."
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Tags helpers */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block font-mono">Dynamic tag inject assistance</span>
                  <div className="flex gap-1.5" id="sms-tag-helpers">
                    {['{customer_name}', '{booking_id}', '{technician_name}', '{service_category}'].map(tag => (
                      <button
                        id={`btn-inject-tag-${tag}`}
                        key={tag}
                        type="button"
                        onClick={() => setSmsBody(smsBody + ' ' + tag)}
                        className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-[10px] text-indigo-400 rounded-lg font-mono border border-slate-800 cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 block font-semibold">Bulk Target Audience</label>
                    <select
                      id="sms-target-audience-select"
                      value={smsCohort}
                      onChange={(e) => setSmsCohort(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300"
                    >
                      <option value="customers">All customers database (7,200 recipients)</option>
                      <option value="all">Entire platform users (7,710 recipients)</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 block font-semibold">Estimated API Dispatch Fee</label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-mono font-bold">
                      ₹{(smsCohort === 'customers' ? 7200 * 0.15 : 7710 * 0.15).toFixed(0)} (~0.15 per SMS)
                    </div>
                  </div>
                </div>

                <button
                  id="btn-broadcast-sms"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Fire Bulk SMS Campaign Gateway
                </button>
              </form>
            </div>
          )}

          {/* Broadcaster 3: Announcements */}
          {activeTab === 'Announcements' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5" id="announcement-creator-card">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Megaphone className="h-4.5 w-4.5 text-amber-400" />
                <span>Broadcast regulatory/promotional compliance Announcements</span>
              </div>

              <form onSubmit={handleSendAnnouncement} className="space-y-4" id="announcement-form">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Announcement Header Title</label>
                  <input
                    id="announcement-input-title"
                    type="text"
                    required
                    placeholder="e.g., Mandatory Gov GST tax changes starting July"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Announcement Body Statement</label>
                  <textarea
                    id="announcement-input-body"
                    required
                    rows={4}
                    value={announcementBody}
                    onChange={(e) => setAnnouncementBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-xs focus:outline-none font-sans"
                  />
                </div>

                <button
                  id="btn-post-announcement"
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Send className="h-3.5 w-3.5" /> Pin Announcement to feed
                </button>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: PREVIEW BROADCAST SIMULATORS */}
        <div className="lg:col-span-5 space-y-6" id="notif-simulators-column">
          
          {/* Smartphone mockup previewer to make it incredible */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center" id="smartphone-preview-panel">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 w-full text-left">Mobile View Preview Simulation</h3>

            <div className="w-[240px] h-[480px] rounded-[32px] border-4 border-slate-950 bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between" id="smartphone-device">
              
              {/* Speaker & notch */}
              <div className="absolute top-0 right-0 left-0 h-4 bg-slate-950 flex justify-center items-center z-30">
                <div className="w-16 h-3 bg-slate-900 rounded-full" />
              </div>

              {/* Dynamic screen display */}
              <div className="flex-1 bg-slate-900 relative p-4 pt-6 space-y-4 flex flex-col justify-start overflow-hidden">
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                  <span>12:40 PM</span>
                  <span>5G Ready</span>
                </div>

                {/* SIMPUSH: push alert simulation */}
                {activeTab === 'Push' && pushTitle && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-lg space-y-1"
                    id="phone-push-alert"
                  >
                    <div className="flex items-center gap-1 text-[8px] font-bold text-cyan-400 uppercase">
                      <Bell className="h-2.5 w-2.5 shrink-0" />
                      <span>Mistri Platform</span>
                    </div>
                    <p className="text-[10px] font-black text-white leading-tight">{pushTitle}</p>
                    <p className="text-[8px] text-slate-400 line-clamp-2 leading-relaxed">{pushBody}</p>
                  </motion.div>
                )}

                {/* SIMSMS: sms text simulation */}
                {activeTab === 'Sms' && smsBody && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800 shrink-0 self-end max-w-[80%] text-[8px]"
                    id="phone-sms-bubble"
                  >
                    <p className="text-slate-300 leading-snug font-mono text-[8px]">
                      {smsBody
                        .replace('{customer_name}', 'Aarav')
                        .replace('{booking_id}', 'BOOK-9912')}
                    </p>
                    <span className="text-[6px] text-indigo-400 text-right block mt-1">Twilio text dispatch</span>
                  </motion.div>
                )}

                {/* Announcement mockup */}
                {activeTab === 'Announcements' && announcementTitle && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[8px]"
                    id="phone-announcement-card"
                  >
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Megaphone className="h-3 w-3 shrink-0" /> Announcement
                    </div>
                    <p className="font-bold text-white text-[9px] leading-tight">{announcementTitle}</p>
                    <p className="text-slate-400 leading-normal line-clamp-4">{announcementBody}</p>
                  </motion.div>
                )}
              </div>

              {/* Bottom home handle */}
              <div className="h-4 bg-slate-950 flex justify-center items-center">
                <div className="w-16 h-1 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* HISTORIC CAMPAIGNS FEED LOGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3" id="dispatched-notif-logs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" /> Historic Campaign Broadcaster Logs
        </h3>

        <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs bg-slate-950/40">
          {dispatchedNotices.map(log => (
            <div key={log.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-2 hover:bg-slate-800/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                    log.style === 'Push' 
                      ? 'bg-cyan-500/15 text-cyan-400' 
                      : log.style === 'Announcement' 
                        ? 'bg-amber-500/15 text-amber-400' 
                        : 'bg-indigo-500/15 text-indigo-400'
                  }`}>
                    {log.style}
                  </span>
                  <h4 className="font-bold text-white text-xs">{log.title}</h4>
                </div>
                <p className="text-slate-400 text-xs">{log.body}</p>
              </div>

              <div className="flex items-center gap-6 text-[10px] text-slate-500 font-mono shrink-0">
                <span>Cohort: <strong className="text-slate-300 font-sans">{log.target}</strong></span>
                <span>{log.timestamp} UTC</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
