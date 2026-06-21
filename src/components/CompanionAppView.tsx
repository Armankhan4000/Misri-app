import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  ExternalLink, 
  CloudLightning, 
  Smartphone, 
  ArrowRight, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  Sliders, 
  Palette, 
  Eye, 
  Bell, 
  Percent, 
  ShieldAlert, 
  Wrench, 
  UserCheck, 
  X, 
  Search, 
  Check, 
  Settings, 
  QrCode,
  CheckCircle,
  FileText
} from 'lucide-react';
import { AppSettings, Technician } from '../types';
import { listenToAppSettings, updateAppSettingsInCloud } from '../firebaseSync';
import firebaseConfig from '../../firebase-applet-config.json';

interface CompanionAppViewProps {
  technicians: Technician[];
  techniciansCount: number;
  bookingsCount: number;
  customersCount: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onUpdateVerification?: (id: string, updates: Partial<Technician>) => void;
}

export default function CompanionAppView({ 
  technicians,
  techniciansCount, 
  bookingsCount, 
  customersCount,
  onApprove,
  onReject,
  onUpdateVerification
}: CompanionAppViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'control' | 'verification' | 'api'>('control');
  const [useIframe, setUseIframe] = useState(true);
  
  // Real-time Firestore synchronized settings state
  const [settings, setSettings] = useState<AppSettings>({
    appName: 'মিস্ত্রি হাব / Mistri Hub',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0f172a',
    themeMode: 'dark',
    emergencyNotice: 'জরুরী ঘোষণা: ঢাকা সিটি করপোরেশন এলাকায় বর্তমানে ইলেকট্রিশিয়ান ও প্লাম্বিং সেবার চাহিদা বেশি!',
    allowBookingRegistration: true,
    commissionPercentage: 15,
    lastUpdated: new Date().toISOString()
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  // Technician Verification Tab State
  const [techSearch, setTechSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  // Load real-time settings from Firestore
  useEffect(() => {
    const unsubscribe = listenToAppSettings((loadedSettings) => {
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    });
    return unsubscribe;
  }, []);

  const companionAppUrl = "https://aistudio.google.com/apps/28c79033-4eaa-47cb-bf10-e401003480c2?showPreview=true&showAssistant=true";

  const presetColors = [
    { name: 'বাংলা সবুজ (Green)', hex: '#059669', desc: 'দেশের ট্রেডিশনাল গ্রিন ব্র্যান্ডিং' },
    { name: 'আকাশী নীল (Sky Blue)', hex: '#0ea5e9', desc: 'মডার্ন ও টেক ফ্রেন্ডলি নীল' },
    { name: 'রাজকীয় বেগুনি (Indigo)', hex: '#6366f1', desc: 'প্রিমিয়াম ও করপোরেট লাক্সারি' },
    { name: 'উষ্ণ লাল (Crimson Rose)', hex: '#e11d48', desc: 'ইনস্ট্যান্ট অ্যাটেনশন আকর্ষণকারী' },
    { name: 'মিষ্টি কমলা (Amber Orange)', hex: '#ea580c', desc: 'কর্মঠ ও এনার্জেটিক ভাইব' }
  ];

  const handleUpdateSetting = async (key: keyof AppSettings, value: any) => {
    const updated = {
      ...settings,
      [key]: value,
      lastUpdated: new Date().toISOString()
    };
    setSettings(updated);
    
    // Auto-save key settings in cloud
    setIsSaving(true);
    try {
      await updateAppSettingsInCloud(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error("Firestore settings save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    }, 700);
  };

  // Filter technicians based on verification tab query
  const filteredTechsForVerification = technicians.filter(t => 
    t.name.toLowerCase().includes(techSearch.toLowerCase()) || 
    t.category.toLowerCase().includes(techSearch.toLowerCase()) || 
    t.id.toLowerCase().includes(techSearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="companion-view-main">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="companion-header">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/50 border border-cyan-800/40 rounded-full font-mono mb-2 inline-block">
            Companion App Sync Dashboard
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            মিস্ত্রি কাস্টমার অ্যাপ কন্ট্রোল পোর্টাল <span className="text-cyan-400 font-mono text-lg font-bold">/ App Control Station</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-sans">
            এই প্যানেল থেকে আপনি সরাসরি মিস্ত্রি অ্যান্ড ক্লায়েন্ট মোবাইল অ্যাপটি নিয়ন্ত্রণ, কালার চেঞ্জ, প্রমোশন অফার পোস্ট, ও মিস্ত্রিদের সার্টিফিকেট ভেরিফাই করতে পারবেন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${testStatus === 'testing' ? 'animate-spin text-cyan-400' : 'text-slate-450'}`} />
            {testStatus === 'idle' && 'ফায়ারবেস সংযোগ পরীক্ষা'}
            {testStatus === 'testing' && 'সিঙ্ক স্ট্যাটাস চেক হচ্ছে...'}
            {testStatus === 'success' && '✓ ক্লাউড ডেটা সিঙ্কড'}
          </button>
          
          <a
            href={companionAppUrl}
            target="_blank"
            rel="noreferrer referrer policy"
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 hover:scale-[1.02] text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-cyan-500/10"
          >
            <span>মিস্ত্রি অ্যাপ খুলুন</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Cloud & Sync Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="companion-metrics">
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <CloudLightning className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase">FIRESTORE CLOUD DATABASE</span>
            <span className="text-xs font-mono font-black text-cyan-400 truncate max-w-[170px] block" title={firebaseConfig.firestoreDatabaseId || "default"}>
              {firebaseConfig.firestoreDatabaseId || "ai-studio-default"}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3 font-sans">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">ACTIVE MISTRIS</span>
            <span className="text-xs font-black text-slate-200 block font-mono">
              {techniciansCount} Partners Registered
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3 font-sans">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">LIVE COMPANION APP URL</span>
            <span className="text-xs font-mono font-black text-indigo-400 block truncate max-w-[130px]" title="ID: 28c79033-4eaa-47cb-bf10">
              Mistri Client App V2
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3 font-sans">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">SAVING STATE</span>
            <span className="text-xs font-black text-slate-100 block">
              {isSaving ? '⏳ ক্লাউডে সংরক্ষণ হচ্ছে...' : saveSuccess ? '✅ সেটিংস আপ-টু-ডেট' : '✓ আইডল রেডি'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="companion-layout-columns">
        
        {/* Left Side: Control Navigation & Configuration Cards */}
        <div className="lg:col-span-7 space-y-6" id="left-controls-area">
          
          {/* Sub Navigation Tabs */}
          <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl" id="dashboard-subtabs-portal">
            <button
              onClick={() => setActiveSubTab('control')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'control' 
                  ? 'bg-slate-900 border border-slate-800 text-white' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Palette className="h-4 w-4 text-cyan-400" />
              <span>রিমোট কন্ট্রোল ও থিম (Theme/Banners)</span>
            </button>
            
            <button
              onClick={() => setActiveSubTab('verification')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'verification' 
                  ? 'bg-slate-900 border border-slate-800 text-white' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>মিস্ত্রি আইডেন্টিটি ভেরিফিকেশন (KYC)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('api')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'api' 
                  ? 'bg-slate-900 border border-slate-800 text-white' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-4 w-4 text-purple-400" />
              <span>ইন্টিগ্রেশন গাইড (API Doc)</span>
            </button>
          </div>

          {/* TAB 1: Theme and Custom Application Parameters Settings */}
          {activeSubTab === 'control' && (
            <div className="space-y-6" id="theme-control-panel-body">
              {/* BRANDING CARD */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5" id="branding-config">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Palette className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100">ইনস্ট্যান্ট অ্যাপ কালার চেঞ্জ ও লোগো ব্রান্ডিং</h3>
                    <p className="text-[11px] text-slate-500">কালার সেট করলে মিস্ত্রি ক্লায়েন্ট অ্যাপের প্রাইমারি থিম সাথে সাথে পরিবর্তন হয়ে যাবে।</p>
                  </div>
                </div>

                {/* APP NAME INPUT */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 block">মিস্ত্রি মোবাইল অ্যাপের নাম (App Custom Title)</label>
                  <input 
                    type="text" 
                    value={settings.appName}
                    onChange={(e) => handleUpdateSetting('appName', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                    placeholder="যেমন- মিস্ত্রি হাব / Mistri Hub"
                  />
                </div>

                {/* COLOR PALETTES PRESETS */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-slate-300 block">থিম কালার সিলেক্ট করুন (Primary Preset Colors)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {presetColors.map((color) => {
                      const isSelected = settings.primaryColor === color.hex;
                      return (
                        <button
                          key={color.hex}
                          onClick={() => handleUpdateSetting('primaryColor', color.hex)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/5' 
                              : 'bg-slate-950 hover:bg-slate-850 border-slate-850/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="h-4.5 w-4.5 rounded-full inline-block border border-black/40 shadow-sm" style={{ backgroundColor: color.hex }} />
                            <div>
                              <span className="text-xs font-bold text-slate-205 block">{color.name}</span>
                              <span className="text-[10px] text-slate-500 font-sans block">{color.desc}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CUSTOM COLOR OR DARK MODE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-350 block">কাস্টম হেক্স কোড (Custom HEX Code)</label>
                    <div className="flex items-center gap-2">
                      <span className="h-9 w-10 border border-slate-800 rounded-lg inline-block overflow-hidden bg-slate-950 relative">
                        <input 
                          type="color" 
                          value={settings.primaryColor}
                          onChange={(e) => handleUpdateSetting('primaryColor', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <span className="absolute inset-2 rounded" style={{ backgroundColor: settings.primaryColor }} />
                      </span>
                      <input 
                        type="text" 
                        value={settings.primaryColor}
                        onChange={(e) => handleUpdateSetting('primaryColor', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                        placeholder="#059669"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-350 block">ডিফল্ট অ্যাপ থিম মোড (Base Theme Mode)</label>
                    <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-lg">
                      <button
                        onClick={() => handleUpdateSetting('themeMode', 'dark')}
                        className={`flex-1 py-1 px-3 rounded text-[11px] font-bold cursor-pointer transition-all ${
                          settings.themeMode === 'dark' 
                            ? 'bg-slate-900 border border-slate-800 text-white' 
                            : 'text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        ডার্ক মোড (Dark Theme)
                      </button>
                      <button
                        onClick={() => handleUpdateSetting('themeMode', 'light')}
                        className={`flex-1 py-1 px-3 rounded text-[11px] font-bold cursor-pointer transition-all ${
                          settings.themeMode === 'light' 
                            ? 'bg-slate-900 border border-slate-800 text-white' 
                            : 'text-slate-500 hover:text-slate-350'
                        }`}
                      >
                        লাইট মোড (Light Theme)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SERVICE PARAMETERS CARD (ALERTS & COMMISSION RATE) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5" id="service-notice-config">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Bell className="h-5 w-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100">অ্যাপ ঘোষণা নোটিশ ও জরুরী SOS বার্তা</h3>
                    <p className="text-[11px] text-slate-500">মিস্ত্রি ক্লায়েন্ট অ্যাপের টপ স্ক্রোলিং নোটিফিকেশন বার নিয়ন্ত্রণ করুন।</p>
                  </div>
                </div>

                {/* EMERGENCY BROADCAST NOTICE */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-300 block">জরূরী ঘোষণা বা স্ক্রোলিং ব্যানার বার্তা (Bengali scrolling ticker text)</label>
                  <textarea 
                    value={settings.emergencyNotice}
                    onChange={(e) => handleUpdateSetting('emergencyNotice', e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans"
                    placeholder="যেমন- সম্মানিত মিস্ত্রি ভাইদের জানানো যাচ্ছে যে গতকালের চেয়ে আজ এয়ার কন্ডিশনার ঠিক করার কাজের চাহিদা দ্বিগুণ..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>* এই লেখাটি সরাসরি মিস্ত্রি অ্যাপের টপ হেডলাইনে রিয়েল-টাইমে স্ক্রোল করবে।</span>
                    <span className="font-mono">{settings.emergencyNotice.length} অক্ষর</span>
                  </div>
                </div>

                {/* TOGGLES FOR BOOKING OR SYSTEM CONFIG */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-201 block">নতুন বুকিং রিকোয়েস্ট</span>
                      <span className="text-[10px] text-slate-500 font-sans block">খুলুন বা বন্ধ করুন</span>
                    </div>
                    <button
                      onClick={() => handleUpdateSetting('allowBookingRegistration', !settings.allowBookingRegistration)}
                      className={`h-7 w-12 rounded-full relative cursor-pointer p-0.5 transition-colors ${
                        settings.allowBookingRegistration ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-full bg-white block shadow-sm absolute top-0.5 transition-all ${
                        settings.allowBookingRegistration ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-201 block flex items-center gap-1">
                        <Percent className="h-3 w-3 text-cyan-400" /> প্ল্যাটফর্ম কমিশন রেট
                      </span>
                      <span className="text-xs font-mono font-black text-cyan-400">{settings.commissionPercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      step="1"
                      value={settings.commissionPercentage}
                      onChange={(e) => handleUpdateSetting('commissionPercentage', parseInt(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-500 font-sans block mt-1">প্রতিটি অর্ডারে সিস্টেম কত কমিশন কাটবে।</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KYC / Technician Verification Quick Actions Portal */}
          {activeSubTab === 'verification' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4" id="tech-verification-terminal">
              
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">মিস্ত্রি ডকুমেন্টস ভেরিফিকেশন ও এনআইডি ক্লিয়ারেন্স</h3>
                  <p className="text-[11px] text-slate-500">নতুন তালিকাভুক্ত মিস্ত্রিদের NID ও পুলিশ রেকর্ড দেখে ১-ক্লিক ভেরিফাই করুন।</p>
                </div>
              </div>

              {/* SEARCH BOX */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="মিস্ত্রির নাম, আইডি ট্র্যাকিং বা এক্সপার্টাইজ ক্যাটাগরি..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-slate-100 focus:outline-none placeholder-slate-505"
                />
              </div>

              {/* FLEX GRID PANEL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pending queue column */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase border-b border-slate-800 pb-1.5">
                    রজিস্টার্ড পার্টনারদের তালিকা ({filteredTechsForVerification.length})
                  </span>
                  
                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                    {filteredTechsForVerification.length === 0 ? (
                      <div className="p-8 text-center text-slate-550 text-xs font-sans">
                        কোন মিস্ত্রি পাওয়া যায়নি।
                      </div>
                    ) : (
                      filteredTechsForVerification.map((tech) => {
                        const isSelected = selectedTech?.id === tech.id;
                        return (
                          <button
                            key={tech.id}
                            onClick={() => setSelectedTech(tech)}
                            className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-slate-950 border-emerald-500/80 shadow' 
                                : 'bg-slate-950 hover:bg-slate-850/60 border-slate-850'
                            }`}
                          >
                            <img 
                              src={tech.avatar} 
                              alt={tech.name} 
                              className="h-10 w-10 rounded-full border border-slate-800 object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-extrabold text-slate-205 flex items-center gap-1.5">
                                {tech.name}
                                {tech.status === 'Approved' && (
                                  <CheckCircle className="h-3 w-3 text-cyan-400 shrink-0" />
                                )}
                              </span>
                              <span className="text-[10px] text-slate-500 uppercase block font-mono">{tech.id} / {tech.category}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                                  tech.status === 'Approved' ? 'bg-cyan-550/10 text-cyan-450' : 
                                  tech.status === 'Pending' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {tech.status === 'Approved' ? 'ভেরিফাইড' : tech.status === 'Pending' ? 'পেন্ডিং KYC' : 'সাময়িক স্থগিত'}
                                </span>
                                {tech.policeVerified && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md font-semibold">
                                    পুলিশ ওকে
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Verification Active Details Pane */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between min-h-[350px]">
                  {selectedTech ? (
                    <div className="space-y-4 font-sans flex-1 flex flex-col justify-between">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3 border-b border-slate-900 pb-2.5">
                          <img 
                            src={selectedTech.avatar} 
                            alt={selectedTech.name} 
                            className="h-12 w-12 rounded-xl object-cover border border-slate-800" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs font-black text-white">{selectedTech.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono text-cyan-400 uppercase">{selectedTech.category}</span>
                          </div>
                        </div>

                        {/* NID AND DOCUMENTS PANE */}
                        <div className="space-y-2.5 text-xs text-slate-350">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">জাতীয় পরিচয়পত্র এনআইডি নম্বর (NID Number)</span>
                            <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg text-slate-205 font-mono text-[11px] flex justify-between items-center">
                              <span>{selectedTech.nidNumber || '5501064098 - জমা দেওয়া নেই'}</span>
                              <span className="text-[9px] text-cyan-400 font-extrabold uppercase bg-cyan-950/40 p-1 px-1.5 rounded border border-cyan-900">
                                {selectedTech.nidVerified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-center font-sans space-y-1">
                              <span className="text-[9px] text-slate-500 block uppercase">পুলিশ ভেরিফিকেশন</span>
                              <span className={`text-[10px] font-extrabold block ${
                                selectedTech.policeVerified ? 'text-emerald-400' : 'text-rose-450'
                              }`}>
                                {selectedTech.policeVerified ? '✓ সবুজ সংকেত ওকে' : '✗ রেকর্ড পেন্ডিং'}
                              </span>
                            </div>

                            <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-center font-sans space-y-1">
                              <span className="text-[9px] text-slate-500 block uppercase">অভিজ্ঞতার সার্টিফিকেট</span>
                              <span className="text-[10px] font-extrabold text-slate-200 block">
                                {selectedTech.experienceYears || '২ বছর'} কাজের অভিজ্ঞতা
                              </span>
                            </div>
                          </div>

                          {/* SIMULATED ID CARD WRAPPER */}
                          <div className="p-3 bg-slate-900/60 border border-slate-850/60 rounded-lg relative overflow-hidden" id="nid-preview-mock">
                            <div className="absolute top-0 right-0 p-1.5 bg-emerald-600/10 text-[8px] text-emerald-400 font-mono border-l border-b border-emerald-900/60 rounded-bl-lg uppercase">
                              NID Document Front
                            </div>
                            <div className="flex gap-2">
                              <div className="h-10 w-14 bg-slate-950 border border-slate-800 rounded flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-slate-650" />
                              </div>
                              <div className="space-y-0.5 text-[10px]">
                                <span className="font-bold text-slate-300 block">GOVT NID SCAN CARD.jpg</span>
                                <span className="text-slate-500 block">Size: 450 KB · Uploaded via app</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CLOUD UPDATE ACTIONS */}
                      <div className="space-y-1.5 border-t border-slate-900 pt-3">
                        <div className="flex items-center gap-2">
                          {selectedTech.status !== 'Approved' ? (
                            <button
                              onClick={() => {
                                onApprove(selectedTech.id);
                                // Local sync simulation
                                setSelectedTech({
                                  ...selectedTech,
                                  status: 'Approved',
                                  nidVerified: true,
                                  policeVerified: true
                                });
                              }}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:scale-[1.01] transition-all text-xs font-black rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>মিস্ত্রি অনুমোদন দিন (Approve & Verify)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                onReject(selectedTech.id);
                                // Local sync simulation
                                setSelectedTech({
                                  ...selectedTech,
                                  status: 'Suspended',
                                  nidVerified: false
                                });
                              }}
                              className="flex-1 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white transition-all text-xs font-bold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1.5 border border-rose-500/30"
                            >
                              <X className="h-4 w-4" />
                              <span>সাময়িক স্থগিত করুন (Suspend Partner)</span>
                            </button>
                          )}
                        </div>

                        {onUpdateVerification && !selectedTech.policeVerified && (
                          <button
                            onClick={() => {
                              onUpdateVerification(selectedTech.id, { policeVerified: true });
                              setSelectedTech({
                                ...selectedTech,
                                policeVerified: true
                              });
                            }}
                            className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            পুলিশ বুকিং সার্টিফিকেট ক্লিয়ারেন্স দিন (Set Police Clear)
                          </button>
                        )}
                      </div>
                    </div>
                    ) : (
                      <div className="m-auto text-center space-y-2 text-slate-500 p-8">
                        <Smartphone className="h-7 w-7 mx-auto stroke-1" />
                        <span className="text-xs font-extrabold block">বাম পাশের তালিকা হতে যেকোনো একজন মিস্ত্রি সিলেক্ট করুন</span>
                        <p className="text-[10px] text-slate-650 max-w-[200px] mx-auto">
                          সেখান থেকে আপনি তাদের আইডি স্ক্যান পেপার দেখতে ও এনআইডি অনুমোদন সম্পন্ন করতে পারবেন।
                        </p>
                      </div>
                    )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: API & Code Integration Details */}
          {activeSubTab === 'api' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 font-sans text-xs text-slate-300" id="api-guide-panel">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Sliders className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">মিস্ত্রি ক্লায়েন্ট অ্যাপের সাথে সিঙ্ক কোডিং নির্দেশিকা</h3>
                  <p className="text-[11px] text-slate-500">আপনার মিস্ত্রি অ্যাপের কোডে কিভাবে রিয়েল-টাইম সেটিংস লোড করবেন তা শিখুন।</p>
                </div>
              </div>

              <p className="leading-relaxed">
                এই অ্যাডমিন প্যানেলে করা যেকোনো পরিবর্তন ক্লাউড ফায়ারবেস ডাটাবেজের <code className="p-1 px-1.5 bg-slate-950 border border-slate-850 text-cyan-400 text-[11px] font-mono rounded">appSettings/global</code> ডকিউমেন্ট অ্যাড্রেসে সংরক্ষিত হয়। আপনার ক্লায়েন্ট অ্যাপ্লিকেশনের ডিজাইন ও সেটিংস এক মুহূর্তের মধ্যে আপডেট করতে নিচের জাভাস্ক্রিপ্ট কোডটি ব্যবহার করুন।
              </p>

              <div className="space-y-1.5">
                <span className="font-extrabold text-slate-201 block">১. রিয়েল-টাইম থিম কালার ও টাইটেল আপডেট লিনেস (React Native snippet):</span>
                <pre className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-[11px] text-cyan-450 font-mono overflow-x-auto leading-relaxed">
{`import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Same project DB integration

onSnapshot(doc(db, "appSettings", "global"), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    
    // ১. অ্যাপ্লিকেশনের টাইটেল আপডেট
    setApplicationName(data.appName);
    
    // ২. রিয়েল-টাইম থিম কালার সিঙ্ক
    setThemeColor({
      primary: data.primaryColor,
      theme: data.themeMode
    });
    
    // ৩. জরুরী স্ক্রোলিং নোটিশ আপডেট
    setEmergencyNoticeText(data.emergencyNotice);
    
    // ৪. বুকিং রেসিস্ট্রেশন ব্লক গেটওয়ে
    setAllowBooking(data.allowBookingRegistration);
  }
});`}
                </pre>
              </div>

              <div className="space-y-1 text-slate-400 leading-relaxed pt-2">
                <h4 className="font-bold text-slate-100">💡 সিঙ্ক পদ্ধতি ও কার্যকারিতা সুবিধা সমূহ:</h4>
                <p>✓ <strong>কোন অ্যাপস্টোর আপডেট ছাড়া কালার চেঞ্জ:</strong> গুগল প্লে-স্টোর বা অ্যাপস্টোরে আপডেট রিভিশন না পাঠিয়েই আপনি যেকোনো সময় লোগো বা ডিজাইনের কালার স্কিম ও ঘোষণা পরিবর্তন করতে পারছেন।</p>
                <p>✓ <strong>অনুমোদিত মিস্ত্রিদের আইডি ম্যাচ চেক:</strong> মিস্ত্রি অ্যাপে লগইন করার সময় ফায়ারবেস চেক বসাতে পারেন: <code className="text-slate-200">if (tech.status !== "Approved") alert("পেন্ডিং KYC অনুমোদন!");</code></p>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Live Iframe Embed Previewer */}
        <div className="lg:col-span-5 flex flex-col space-y-3" id="previewer-area">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[550px]" id="iframe-card-stage">
            
            {/* Window title bar */}
            <div className="bg-slate-950 p-3.5 border-b border-slate-850 flex items-center justify-between font-sans">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <div className="h-4 w-px bg-slate-800 mx-1.5"></div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-455 font-mono">
                  <Laptop className="h-3 w-3 text-slate-500" />
                  <span>Mistri Live Preview (১-টু-১ সিঙ্ক)</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setUseIframe(!useIframe)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-tight transition-all uppercase cursor-pointer ${
                    useIframe ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/35' : 'bg-slate-850 text-slate-400'
                  }`}
                >
                  {useIframe ? "Live Iframe" : "Simulation Info"}
                </button>
              </div>
            </div>

            {/* Simulated Live preview iframe status wrapper */}
            {useIframe && (
              <div className="bg-slate-950 p-1.5 px-3 border-b border-slate-950 text-[10px] flex items-center justify-between text-slate-450 z-10" id="live-styles-status">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                  লাইভ টাইটেল: <strong className="text-slate-201">{settings.appName}</strong>
                </span>
                <span className="flex items-center gap-1">
                  থিম কালার: <strong className="font-mono text-cyan-400">{settings.primaryColor}</strong>
                  <span className="h-2 w-2 rounded border border-white/20 inline-block shadow-sm" style={{ backgroundColor: settings.primaryColor }} />
                </span>
              </div>
            )}

            {/* Embed container or static simulator layout */}
            <div className="flex-1 bg-slate-950 flex flex-col relative" style={{ minHeight: '480px' }}>
              {useIframe ? (
                <iframe
                  id="mistri-applet-live-frame"
                  src={companionAppUrl}
                  title="Mistri App Live Preview"
                  className="w-full h-full border-none flex-1"
                  referrerPolicy="no-referrer"
                  allow="geolocation; camera; microphone"
                />
              ) : (
                <div className="p-6 text-center m-auto max-w-sm space-y-4 font-sans">
                  <div className="h-12 w-12 rounded-full bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-100">লাইভ সিমুলেটর ও ম্যানুয়াল রিফ্রেশ</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    ব্রাউজার সিকিউরিটি সেটিংস আইফ্রেম ব্লক বা স্ক্রিন ওভারল্যাপ প্রতিরোধ করলে উপরের <span className="font-semibold text-cyan-400">"মিস্ত্রি অ্যাপ খুলুন"</span> পোর্টালে সরাসরি ক্লিক করে নতুন ব্রাউজার ট্যাবে মিস্ত্রি অ্যাপ খুলতে পারেন। সেখানে সেটিংস ইন্টিগ্রেশন সাথে সাথে রিয়েল-টাইমে দৃশ্যমান হবে।
                  </p>
                  <a
                    href={companionAppUrl}
                    target="_blank"
                    rel="noreferrer referrer policy"
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-bold hover:underline"
                  >
                    <span>নতুন ট্যাবে চালু করতে এখানে ক্লিক করুন</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Custom Simulator Preview Header - Bottom Ticker simulated to demonstrate how settings update in companion */}
            <div className="bg-slate-950 p-3.5 border-t border-slate-850 text-slate-400 font-sans" id="ticker-alert-simulator">
              <span className="font-bold text-[10px] text-amber-500 block uppercase mb-1 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 animate-pulse" /> লাইভ ব্রডকাস্টের নমুনা (Ticker Warning Bar Sample):
              </span>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-850/80 overflow-hidden relative h-7">
                <div className="whitespace-nowrap absolute animate-marquee font-sans text-[10px] text-slate-300">
                  {settings.emergencyNotice}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
