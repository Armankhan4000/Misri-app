import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  CreditCard, 
  ShieldAlert, 
  Shield, 
  Users, 
  History, 
  Download, 
  Save, 
  AlertTriangle, 
  CheckCircle,
  Key,
  Database,
  Lock,
  Mail
} from 'lucide-react';
import { SystemLog } from '../types';

interface SettingsProps {
  logs: SystemLog[];
  currentAdminEmail?: string;
  onAdminEmailChange?: (newEmail: string) => void;
}

export default function SettingsView({ 
  logs, 
  currentAdminEmail = 'armanhossain0810200@gmail.com', 
  onAdminEmailChange 
}: SettingsProps) {
  const [subTab, setSubTab] = useState<'App' | 'Payments' | 'Gateways' | 'Security' | 'Admins' | 'Backup'>('App');
  const [downloading, setDownloading] = useState(false);

  // App Settings States
  const [dispatchRadius, setDispatchRadius] = useState(15);
  const [taxRate, setTaxRate] = useState(18);
  const [currency, setCurrency] = useState('INR');

  // Payment Gateway States
  const [stripeActive, setStripeActive] = useState(true);
  const [razorpayActive, setRazorpayActive] = useState(true);
  const [stripeSecret, setStripeSecret] = useState('sk_live_51M••••••••••••••••••••');

  // SMS API Gateway States
  const [twilioSid, setTwilioSid] = useState('ACba90f77••••••••••••••••');
  const [twilioToken, setTwilioToken] = useState('••••••••••••••••••••••••');

  // Security States
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Security change states
  const [credCurrentPassword, setCredCurrentPassword] = useState('');
  const [credNewEmail, setCredNewEmail] = useState(currentAdminEmail);
  const [credNewPassword, setCredNewPassword] = useState('');
  const [credConfirmPassword, setCredConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    const savedPassword = localStorage.getItem('mistri_admin_password') || '@1310694000';
    if (credCurrentPassword !== savedPassword) {
      setCredError('ভুল বর্তমান পাসওয়ার্ড! পুনরায় চেষ্টা করুন। (Your current password is required)');
      return;
    }

    if (!credNewEmail.trim()) {
      setCredError('নতুন ইমেইল খালি হতে পারে না।');
      return;
    }

    if (credNewPassword && credNewPassword.length < 6) {
      setCredError('নতুন পাসওয়ার্ডটি অন্ততঃপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (credNewPassword !== credConfirmPassword) {
      setCredError('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড ম্যাচ করেনি!');
      return;
    }

    // Persist changes to local storage
    localStorage.setItem('mistri_admin_email', credNewEmail.trim().toLowerCase());
    if (credNewPassword) {
      localStorage.setItem('mistri_admin_password', credNewPassword);
    }

    if (onAdminEmailChange) {
      onAdminEmailChange(credNewEmail.trim().toLowerCase());
    }

    // Update locally too
    setAdmins(prev => 
      prev.map(a => 
        a.role === 'Super Admin' 
          ? { ...a, email: credNewEmail.trim().toLowerCase() } 
          : a
      )
    );

    setCredSuccess('অ্যাডমিন ক্রেডেনশিয়ালস সফলভাবে আপডেট হয়েছে!');
    setCredCurrentPassword('');
    setCredNewPassword('');
    setCredConfirmPassword('');
  };

  // Admin users list
  const [admins, setAdmins] = useState([
    { email: 'armanhossain08102000@gmail.com', role: 'Super Admin', authLevel: 'Full Access' },
    { email: 'finance.auditor@mistri.com', role: 'Financial Auditor', authLevel: 'Ledgers Only' },
    { email: 'support.rep@mistri.com', role: 'Customer Support', authLevel: 'Disputes Only' }
  ]);

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Customer Support');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setAdmins([
      ...admins,
      {
        email: newAdminEmail,
        role: newAdminRole,
        authLevel: newAdminRole === 'Super Admin' ? 'Full Access' : newAdminRole === 'Financial Auditor' ? 'Ledgers Only' : 'Disputes Only'
      }
    ]);
    setNewAdminEmail('');
  };

  const handleBackupDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      
      // Simulate file download
      const backupData = {
        app_id: '49df8671-6bfd-4281-a661-ea14bde79577',
        timestamp: '2026-06-10T00:40:00Z',
        integrity_hash: 'sha256-dfa79e4f0282b99c0d23588ef1c29e28989',
        status: 'SUCCESSFUL'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'backup-mistri-2026-06-10.json';
      link.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="space-y-6" id="settings-view-main">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="settings-header">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            System & App Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain application parameters, payment gateways, role permissions, & download database backups
          </p>
        </div>
      </div>

      {/* Grid segments nav */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 pb-3" id="settings-segment-nav">
        {[
          { id: 'App', label: 'App Settings', icon: Settings },
          { id: 'Payments', label: 'Payment Settings', icon: CreditCard },
          { id: 'Gateways', label: 'SMS API Gateway', icon: Key },
          { id: 'Security', label: 'Security & 2FA', icon: Shield },
          { id: 'Admins', label: 'Admin Roles & Access', icon: Users },
          { id: 'Backup', label: 'System Backup & Logs', icon: Database }
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              id={`settings-tab-select-${tab.id}`}
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                subTab === tab.id 
                  ? 'bg-cyan-600 text-slate-950 font-extrabold' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComp className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: GENERAL APP SETTINGS */}
      {subTab === 'App' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="settings-app-panel">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">App Operation Constants</h3>
            <p className="text-xs text-slate-500">Configure core dispatch distance loops & municipal tax rates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="app-config-fields">
            {/* Dispatch Radius */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold block">Maximum Technician Dispatch Radius</span>
                <span className="text-cyan-400 font-mono font-bold">{dispatchRadius} KM</span>
              </div>
              <input 
                id="app-dispatch-radius-slider"
                type="range" 
                min="5" 
                max="50" 
                value={dispatchRadius} 
                onChange={(e) => setDispatchRadius(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded h-1.5"
              />
              <p className="text-[10px] text-slate-500">The perimeter boundary skilled workers are authorized to dispatch within.</p>
            </div>

            {/* Tax Rates */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold block">Consolidated service tax (GST / VAT)</span>
                <span className="text-cyan-400 font-mono font-bold">{taxRate}%</span>
              </div>
              <input 
                id="app-tax-rate-slider"
                type="range" 
                min="0" 
                max="30" 
                value={taxRate} 
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 rounded h-1.5"
              />
              <p className="text-[10px] text-slate-500">Tax coefficient added to final customer billing receipts at checkout.</p>
            </div>

            {/* System currency */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-300 block font-bold">Standard App Operational Currency</label>
              <select
                id="app-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="BDT">Bangladeshi Taka (৳)</option>
                <option value="PKR">Pakistani Rupee (₨)</option>
                <option value="USD">United States Dollar ($)</option>
              </select>
            </div>
          </div>

          <button
            id="btn-save-app-settings"
            onClick={() => alert('App operation constants updated successfully!')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Save className="h-4 w-4" /> Save App Settings
          </button>
        </div>
      )}

      {/* SUB-TAB 2: PAYMENT SETTINGS */}
      {subTab === 'Payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="settings-payments-panel">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Payment Gateway Parameters</h3>
            <p className="text-xs text-slate-500">Enable or configure third-party transaction gateways for app checkouts.</p>
          </div>

          <div className="space-y-5" id="payment-gateways-inputs">
            {/* Stripe */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3" id="stripe-settings-box">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input 
                    id="stripe-active-checkbox"
                    type="checkbox" 
                    checked={stripeActive} 
                    onChange={(e) => setStripeActive(e.target.checked)}
                    className="accent-cyan-400 h-4 w-4" 
                  />
                  <span className="font-bold text-white text-sm">Stripe Payments API Gateway</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stripeActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {stripeActive ? 'Active Engine' : 'Offline'}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <label className="text-slate-400 block font-semibold">Stripe Live Private Secret Token Key</label>
                <input 
                  id="stripe-secret-input"
                  type="password" 
                  value={stripeSecret}
                  onChange={(e) => setStripeSecret(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-350 rounded p-2 text-xs font-mono" 
                />
              </div>
            </div>

            {/* Razorpay */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3" id="razorpay-settings-box">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input 
                    id="razorpay-active-checkbox"
                    type="checkbox" 
                    checked={razorpayActive} 
                    onChange={(e) => setRazorpayActive(e.target.checked)}
                    className="accent-cyan-400 h-4 w-4" 
                  />
                  <span className="font-bold text-white text-sm">Razorpay UPI & Wallet Gateway</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${razorpayActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {razorpayActive ? 'Active Engine' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-save-payment-gateways"
            onClick={() => alert('API credentials saved successfully')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Save className="h-4 w-4" /> Save Gateways API Keys
          </button>
        </div>
      )}

      {/* SUB-TAB 3: SMS API GATEWAY */}
      {subTab === 'Gateways' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="settings-sms-panel">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">SMS Gateway Integration</h3>
            <p className="text-xs text-slate-500">Configure standard bulk SMS messaging webhooks to dispatch verify OTPs & booking notifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300" id="sms-api-keys">
            <div className="space-y-1">
              <label className="text-slate-450 block font-bold">Twilio API SID Key</label>
              <input 
                id="twilio-sid-input"
                type="text" 
                value={twilioSid} 
                onChange={(e) => setTwilioSid(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono p-2.5 rounded-lg" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-450 block font-bold">Twilio Auth Secret Key</label>
              <input 
                id="twilio-token-input"
                type="password" 
                value={twilioToken} 
                onChange={(e) => setTwilioToken(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono p-2.5 rounded-lg" 
              />
            </div>
          </div>

          <button
            id="btn-save-sms-api"
            onClick={() => alert('SMS API configurations validated!')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Save className="h-4 w-4" /> Save Token Credentials
          </button>
        </div>
      )}

      {/* SUB-TAB 4: SECURITY SETTINGS */}
      {subTab === 'Security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6" id="settings-security-panel">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Security Protocols & Locks</h3>
            <p className="text-xs text-slate-500">Configure administrative console authentication & token safeguards.</p>
          </div>

          <div className="space-y-4 text-xs" id="security-switches">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200 block">Enforce Admin 2-Factor Authentication (2FA)</span>
                <span className="text-slate-500 text-[10px]">Prompts administrative accounts for secure verification OTPs during access logins.</span>
              </div>
              <input 
                id="two-factor-checkbox"
                type="checkbox" 
                checked={twoFactor} 
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="accent-cyan-400 h-4.5 w-4.5" 
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="font-bold text-slate-200 block">Administrative Console Idle Timeout (minutes)</label>
              <input 
                id="session-timeout-input"
                type="number" 
                value={sessionTimeout} 
                onChange={(e) => setSessionTimeout(Number(e.target.value))} 
                className="bg-slate-900 border border-slate-800 text-slate-200 font-mono p-2 rounded w-24" 
              />
              <p className="text-[10px] text-slate-500 mt-1">Saves your session and logs out automatically if inactive.</p>
            </div>
          </div>

          {/* Super Admin Credential Form */}
          <div className="border-t border-slate-800 pt-6 mt-6 space-y-4" id="credential-change-block">
            <div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5 font-sans">
                <Key className="h-4.5 w-4.5 text-cyan-400" />
                এডমিন ক্রেডেনশিয়ালস ও পাসওয়ার্ড পরিবর্তন / Super Admin Credentials
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                নিরাপত্তার স্বার্থে সুপার এডমিন ইমেইল এবং প্যানেল অ্যাক্সেস পাসওয়ার্ড এখান থেকে পরিবর্তন করতে পারবেন।
              </p>
            </div>

            {credError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-sans">
                {credError}
              </div>
            )}

            {credSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-sans">
                {credSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-bold block font-sans">নতুন ইমেইল এড্রেস / New Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <input 
                    type="email"
                    required
                    value={credNewEmail}
                    onChange={(e) => setCredNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-bold block font-sans">বর্তমান পাসওয়ার্ড / Current Password (Verification)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                  </span>
                  <input 
                    type="password"
                    required
                    placeholder="বর্তমান পাসওয়ার্ড দিন"
                    value={credCurrentPassword}
                    onChange={(e) => setCredCurrentPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-bold block font-sans">নতুন পাসওয়ার্ড / New Password (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-cyan-400/40" />
                  </span>
                  <input 
                    type="password"
                    placeholder="নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
                    value={credNewPassword}
                    onChange={(e) => setCredNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-bold block font-sans">নতুন পাসওয়ার্ড নিশ্চিত করুন / Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-cyan-400/40" />
                  </span>
                  <input 
                    type="password"
                    placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                    value={credConfirmPassword}
                    onChange={(e) => setCredConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] shadow-lg shadow-cyan-600/10 font-sans"
                >
                  <Save className="h-4 w-4" />
                  <span>ক্রেডেনশিয়ালস পরিবর্তন করুন / Update Admin Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ADMIN ROLES & ACCESS */}
      {subTab === 'Admins' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6" id="settings-roles-panel">
          <div>
            <h3 className="font-bold text-white text-base">Authorized Administrative Accounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Maintain personnel identities with structural role access permissions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin-personnels-layout">
            {/* List admins */}
            <div className="lg:col-span-2 space-y-2" id="admins-list">
              {admins.map(person => (
                <div key={person.email} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-xs">
                  <div>
                    <h5 className="font-bold text-white font-sans">{person.email}</h5>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Assigned: {person.role}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
                    {person.authLevel}
                  </span>
                </div>
              ))}
            </div>

            {/* Create Admin Form */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3" id="admin-user-create-form">
              <h4 className="text-xs font-bold text-white uppercase block">Authorize New Personnel</h4>
              <form onSubmit={handleAddAdmin} className="space-y-3 text-xs" id="personnel-addition-form">
                <div className="space-y-1">
                  <label className="text-slate-400 block font-semibold">User Email Address</label>
                  <input
                    id="new-admin-email"
                    type="email"
                    required
                    placeholder="personnel@mistri.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 block font-semibold">Assigned Access Profile</label>
                  <select
                    id="new-admin-role"
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300"
                  >
                    <option value="Customer Support">Customer Support (Disputes Only)</option>
                    <option value="Financial Auditor">Financial Auditor (Ledgers Only)</option>
                    <option value="Super Admin">Super Admin (Full Access)</option>
                  </select>
                </div>
                <button
                  id="btn-submit-personnel"
                  type="submit"
                  className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded cursor-pointer transition-colors"
                >
                  Publish Authorization Certificate
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: SYSTEM LOGS & BACKUPS */}
      {subTab === 'Backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="settings-backup-panel">
          
          {/* Backups trigger */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4" id="backup-trigger-box">
            <div>
              <h3 className="font-bold text-white text-sm">System Database Backups</h3>
              <p className="text-xs text-slate-500 mt-1">Export full server-side databases (listings, transactions, profiles) to localized secure JSON archives.</p>
            </div>

            <button
              id="btn-trigger-backup-download"
              onClick={handleBackupDownload}
              disabled={downloading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {downloading ? (
                <>
                  <div className="h-4.5 w-4.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dumping Datasets...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Backup File</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-500 font-mono text-center">Version: 49df8671-6bfd-4281-a661-ea14bde79577</p>
          </div>

          {/* Core Logs Viewer */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between" id="logs-panel">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <History className="h-4.5 w-4.5 text-slate-400" />
                  Live Administrative Security Logs
                </h3>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="logs-feed">
                {logs.map((log, idx) => (
                  <div key={idx} className="p-2 border border-slate-800 bg-slate-950/60 rounded-lg text-xs leading-normal">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        log.level === 'INFO' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : log.level === 'WARNING' 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.level}
                      </span>
                      <span>{log.timestamp} UTC</span>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px]"><strong className="text-cyan-400">[{log.module}]</strong> {log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
