import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, AlertCircle, Wrench } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('armanhossain0810200@gmail.com');
  const [password, setPassword] = useState('@1310694000');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your admin email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate server-side admin login authentication
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
    }, 800);
  };

  const setDemoCredentials = () => {
    setEmail('armanhossain0810200@gmail.com');
    setPassword('@1310694000');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
        id="login-container"
      >
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8" id="login-header">
            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
              <Wrench className="h-8 w-8 animate-pulse text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              MISTRI SUPER ADMIN
            </h1>
            <p className="text-slate-400 text-sm">
              Control Panel Authorization Required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" id="login-form">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-400"
                id="login-error"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
                  placeholder="admin@mistri.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-600/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Authorize Control Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Assist */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center" id="demo-credentials-container">
            <button
              id="autofill-credentials"
              onClick={setDemoCredentials}
              className="text-xs text-cyan-400/80 hover:text-cyan-400 transition-colors underline cursor-pointer"
            >
              Use Super Admin credentials (armanhossain0810200@gmail.com)
            </button>
          </div>
        </div>

        {/* Security watermark footer */}
        <p className="text-center text-xs text-slate-600 mt-8 font-mono">
          SECURE CONNECTION SHA-256 | IP: RESTRICTED
        </p>
      </motion.div>
    </div>
  );
}
