import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Activity, 
  Edit, 
  Trash2, 
  Key, 
  Eye, 
  Lock 
} from 'lucide-react';

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  permissions: {
    [key: string]: 'Full' | 'View' | 'None';
  };
  lastActive: string;
}

interface SubAdminLog {
  timestamp: string;
  email: string;
  action: string;
  ip: string;
}

export default function SubAdminView() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([
    {
      id: 'SADM-001',
      name: 'Muntasir Mahmud',
      email: 'muntasir.m@mistri.com',
      role: 'Operations dispatcher',
      status: 'Active',
      createdAt: '2026-05-10',
      permissions: {
        dashboard: 'View',
        bookings: 'Full',
        technicians: 'View',
        commission: 'None',
        shop: 'View',
        settings: 'None'
      },
      lastActive: '2026-06-20 16:30'
    },
    {
      id: 'SADM-002',
      name: 'Fariha Yasmin',
      email: 'fariha.y@mistri.com',
      role: 'Support Manager',
      status: 'Active',
      createdAt: '2026-05-20',
      permissions: {
        dashboard: 'View',
        bookings: 'Full',
        technicians: 'Full',
        commission: 'None',
        shop: 'None',
        settings: 'None'
      },
      lastActive: '2026-06-20 17:42'
    },
    {
      id: 'SADM-003',
      name: 'Tahmid Hasan',
      email: 'tahmid.h@mistri.com',
      role: 'Finance Specialist',
      status: 'Suspended',
      createdAt: '2026-04-12',
      permissions: {
        dashboard: 'View',
        bookings: 'View',
        technicians: 'None',
        commission: 'Full',
        shop: 'Full',
        settings: 'None'
      },
      lastActive: '2026-06-18 11:15'
    }
  ]);

  const [logs, setLogs] = useState<SubAdminLog[]>([
    { timestamp: '2026-06-20 17:42:15', email: 'fariha.y@mistri.com', action: 'Approved technician Kabir Ahmed paperwork', ip: '192.168.22.45' },
    { timestamp: '2026-06-20 16:29:40', email: 'muntasir.m@mistri.com', action: 'Dispatched booking BOOK-9952 to Imran', ip: '103.220.67.11' },
    { timestamp: '2026-06-19 14:10:02', email: 'fariha.y@mistri.com', action: 'Created scheduled push notification preset', ip: '192.168.22.45' },
    { timestamp: '2026-06-18 11:14:55', email: 'tahmid.h@mistri.com', action: 'Modified plumbing commission percentage rate', ip: '202.91.45.201' }
  ]);

  // Form State
  const [showCreator, setShowCreator] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState<{ [key: string]: 'Full' | 'View' | 'None' }>({
    dashboard: 'View',
    bookings: 'Full',
    technicians: 'View',
    commission: 'None',
    shop: 'None',
    settings: 'None'
  });

  const [selectedAdmin, setSelectedAdmin] = useState<SubAdmin | null>(null);

  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) return;

    const newAdmin: SubAdmin = {
      id: `SADM-0${subAdmins.length + 1}`,
      name,
      email,
      role,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      permissions: { ...permissions },
      lastActive: 'Never active'
    };

    setSubAdmins([...subAdmins, newAdmin]);
    
    // Add creation audit trace log
    const newLog: SubAdminLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      email: 'armanhossain08102000@gmail.com', // Active Super Admin
      action: `Created new sub-admin credential index: ${email} (${role})`,
      ip: '103.22.61.182'
    };
    setLogs([newLog, ...logs]);

    // Reset fields
    setName('');
    setEmail('');
    setRole('');
    setShowCreator(false);
  };

  const handleTogglePermission = (adminId: string, moduleKey: string, newValue: 'Full' | 'View' | 'None') => {
    setSubAdmins(subAdmins.map(admin => {
      if (admin.id === adminId) {
        const updatedPerms = { ...admin.permissions, [moduleKey]: newValue };
        
        // Push update to Activity Log
        const triggerLog: SubAdminLog = {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          email: 'armanhossain08102000@gmail.com',
          action: `Altered sub-admin ${admin.email} perm for [${moduleKey}] index to: ${newValue}`,
          ip: '103.22.61.182'
        };
        setTimeout(() => setLogs(prev => [triggerLog, ...prev]), 50);

        return { ...admin, permissions: updatedPerms };
      }
      return admin;
    }));
  };

  const handleDeleteAdmin = (id: string) => {
    const target = subAdmins.find(a => a.id === id);
    if (!target) return;
    setSubAdmins(subAdmins.filter(a => a.id !== id));
    
    const removalLog: SubAdminLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      email: 'armanhossain08102000@gmail.com',
      action: `Revoked & Deleted sub-admin login token: ${target.email}`,
      ip: '103.22.61.182'
    };
    setLogs([removalLog, ...logs]);
  };

  const handleUpdateStatus = (id: string, newStatus: 'Active' | 'Suspended') => {
    setSubAdmins(subAdmins.map(admin => {
      if (admin.id === id) {
        return { ...admin, status: newStatus };
      }
      return admin;
    }));
  };

  const modules = [
    { key: 'dashboard', label: 'Dashboard Overview / কাস্টম চার্ট' },
    { key: 'bookings', label: 'Dispatches & Bookings / বুকিং রিকোয়েস্ট' },
    { key: 'technicians', label: 'Technician Directories / মিস্ত্রি ম্যানেজমেন্ট' },
    { key: 'commission', label: 'Commission Levels / ফি সেটিংস' },
    { key: 'shop', label: 'Online Spares Catalog / স্পেয়ার্স শপ' },
    { key: 'settings', label: 'Security & Root System Config' }
  ];

  return (
    <div className="space-y-6" id="subadmin-view-main">
      {/* Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-amber-500 uppercase bg-amber-950/40 border border-amber-800/40 rounded-md font-mono mb-2 inline-block">
            Sub-Admin Gatekeeper Hub
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            সহকারী এডমিন ও রোল সেটিংস <span className="text-cyan-400 font-mono text-lg font-bold">/ Access Gate Control</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            সহকারী মডারেটরদের জন্য নির্দিষ্ট মডিউলে ভিউ, ফুল এডিট অথবা নো-অ্যাক্সেস পারমিশন সেট আপ করুন এবং তাদের কাজের লগ সার্বক্ষণিক মনিটরিং করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sub Admin Listing & Roles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-200">সিস্টেম সাব-এডমিন টিম ({subAdmins.length} জন সক্রিয়)</span>
            <button
              onClick={() => setShowCreator(!showCreator)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4 stroke-[3px]" /> এডমিন যুক্ত করুন
            </button>
          </div>

          {/* Form Creator */}
          {showCreator && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-slide-in">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans pb-3 border-b border-slate-800">
                <Shield className="h-4 w-4 text-cyan-400" /> নতুন সহকারী এডমিন নিয়োগ ফর্ম (Add Staff Mod)
              </h3>

              <form onSubmit={handleCreateSubAdmin} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">পূর্ণ নাম (Staff Full Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakib Al Hasan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">অফিসিয়াল ইমেইল (Email ID)</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. shakib@mistri.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold">পদবী বা কাজের রোল (Role Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mirpur Area Head"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Setup initial permissions right inside form */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-350 block">Initial Permissions Setup:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {modules.map(m => (
                      <div key={m.key} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-medium text-slate-400">{m.label}</span>
                        <select
                          value={permissions[m.key]}
                          onChange={(e) => setPermissions({ ...permissions, [m.key]: e.target.value as any })}
                          className="bg-slate-900 border border-slate-800 p-1 text-[10px] text-white rounded font-mono"
                        >
                          <option value="None">None</option>
                          <option value="View">View Only</option>
                          <option value="Full">Full Write</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreator(false)}
                    className="px-4 py-2 border border-slate-800 bg-slate-920 hover:bg-slate-850 rounded-xl font-bold cursor-pointer text-slate-400"
                  >
                    বাতিল (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-black rounded-xl cursor-pointer"
                  >
                    প্যানেল এডমিট করুন (Approve Member)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sub-Admins Card List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subAdmins.map(admin => (
              <div 
                key={admin.id}
                onClick={() => setSelectedAdmin(admin)}
                className={`bg-slate-900 border rounded-2xl p-4 space-y-4 hover:border-cyan-500/45 transition-all cursor-pointer ${
                  selectedAdmin?.id === admin.id ? 'border-cyan-600/80 bg-slate-900/90 shadow-lg shadow-cyan-950/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm shadow-inner">
                      {admin.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{admin.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{admin.email}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                    admin.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {admin.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">পদবী (Job Title):</span>
                    <span className="text-slate-300 font-bold">{admin.role}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Last Session Active:</span>
                    <span className="text-slate-450">{admin.lastActive}</span>
                  </div>
                </div>

                {/* Rapid Action Buttons */}
                <div className="flex justify-between items-center text-[10px] pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(admin.id, admin.status === 'Active' ? 'Suspended' : 'Active');
                      }}
                      className={`px-2 py-1 rounded border font-mono font-bold hover:bg-slate-800 ${
                        admin.status === 'Active' ? 'border-yellow-600/30 text-yellow-500' : 'border-emerald-600/30 text-emerald-400'
                      }`}
                    >
                      {admin.status === 'Active' ? 'SUSPEND' : 'ACTIVATE'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAdmin(admin.id);
                      }}
                      className="px-2 py-1 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 rounded border border-rose-800/30 font-mono font-bold"
                    >
                      REVOKE
                    </button>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold font-mono">VIEW RULES →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected / Admin Role Permission Map & Logs */}
        <div className="space-y-4">
          {selectedAdmin ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-white font-sans">{selectedAdmin.name}</h3>
                  <p className="text-[10px] text-slate-500">রোল ম্যাপ মডিউল / Role Permission Level</p>
                </div>
                <Users className="h-5 w-5 text-cyan-400" />
              </div>

              {/* PERMISSION CONTROLLER MAPPED ITEMS */}
              <div className="space-y-2.5">
                {modules.map(mod => {
                  const currPerm = selectedAdmin.permissions[mod.key] || 'None';
                  return (
                    <div key={mod.key} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-300">{mod.label}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase font-mono ${
                          currPerm === 'Full' ? 'bg-cyan-500/10 text-cyan-400' :
                          currPerm === 'View' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {currPerm}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        {(['None', 'View', 'Full'] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => handleTogglePermission(selectedAdmin.id, mod.key, p)}
                            className={`py-1 text-[9px] font-bold uppercase rounded font-mono transition-colors cursor-pointer ${
                              currPerm === p 
                                ? 'bg-cyan-705 border border-cyan-800/40 text-slate-950' 
                                : 'bg-slate-920 hover:bg-slate-900 text-slate-500 hover:text-slate-350'
                            }`}
                          >
                            {p === 'None' ? 'No Entry' : p === 'View' ? 'Read' : 'Write'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-2">
              <Shield className="h-8 w-8 mx-auto text-slate-600 stroke-1" />
              <p className="text-xs">পারমিশন ভিউ এবং এডিট প্যানেল দেখতে বামের যেকোন একটি সাব-এডমিন প্রোফাইলে ট্যাপ করুন।</p>
            </div>
          )}

          {/* Sub Admin Activity Audit logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-white font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" /> RECENT STAFF ACTION LOGS
            </h3>

            <div className="divide-y divide-slate-800/80 pr-1 max-h-[290px] overflow-y-auto" id="subadmin-mod-scroller">
              {logs.map((log, idx) => (
                <div key={idx} className="py-2.5 text-[11px] space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="font-bold text-cyan-500">{log.email}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 font-sans">{log.action}</p>
                  <p className="text-[9px] text-slate-600 font-mono">Terminal IP address: {log.ip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
