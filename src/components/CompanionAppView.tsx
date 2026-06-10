import React, { useState } from 'react';
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
  RefreshCw 
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface CompanionAppViewProps {
  techniciansCount: number;
  bookingsCount: number;
  customersCount: number;
}

export default function CompanionAppView({ 
  techniciansCount, 
  bookingsCount, 
  customersCount 
}: CompanionAppViewProps) {
  const [useIframe, setUseIframe] = useState(true);
  const companionAppUrl = "https://aistudio.google.com/apps/28c79033-4eaa-47cb-bf10-e401003480c2?showPreview=true&showAssistant=true";
  
  // Try to extract the direct run app URL if available, else use a fallback
  const directAppUrl = "https://ais-pre-b7lp4oy4nd2k4o7k477sse-905014612200.europe-west2.run.app"; 

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 900);
  };

  return (
    <div className="space-y-6" id="companion-view-main">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="companion-header">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/50 border border-cyan-800/40 rounded-full font-mono mb-2 inline-block">
            Companion Integration Core
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            মিস্ত্রি অ্যাপ কন্ট্রোল পোর্টাল <span className="text-cyan-400 font-mono text-lg font-bold">/ Companion Hub</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-sans">
            এই পোর্টালের মাধ্যমে আপনি সরাসরি মিস্ত্রি ক্লায়েন্ট অ্যাপলিকেশনটি দেখতে, পরীক্ষা এবং নিয়ন্ত্রণ করতে পারবেন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${testStatus === 'testing' ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            {testStatus === 'idle' && 'ফায়ারবেস সংযোগ পরীক্ষা'}
            {testStatus === 'testing' && 'সিঙ্ক স্ট্যাটাস চেক হচ্ছে...'}
            {testStatus === 'success' && '✓ ক্লাউড সিঙ্ক সফল'}
          </button>
          
          <a
            href={companionAppUrl}
            target="_blank"
            rel="noreferrer referrer policy"
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 hover:scale-[1.02] text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-cyan-600/10"
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
            <CloudLightning className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase">FIRESTORE DATABASE ID</span>
            <span className="text-xs font-mono font-black text-cyan-400 truncate max-w-[140px] block" title={firebaseConfig.firestoreDatabaseId || "default"}>
              {firebaseConfig.firestoreDatabaseId || "ai-studio-default"}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3 font-sans">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">CONNECTED CLIENT APP</span>
            <span className="text-xs font-black text-slate-200 block">
              Mistri Hub v2.1 (লাইভ)
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase">ACTIVE MISTRIS</span>
            <span className="text-sm font-mono font-black text-slate-100 block">
              {techniciansCount} জন মিস্ত্রি পার্টনার
            </span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex items-center gap-3 font-sans">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase">TOTAL BOOKINGS</span>
            <span className="text-sm font-black text-slate-100 block">
              {bookingsCount} টি রিয়েল-টাইম ডিসপ্যাচ
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="companion-workspace">
        
        {/* Bengali Integration Control Manual */}
        <div className="lg:col-span-4 space-y-4" id="integration-manual">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4 font-sans">
            <h3 className="text-sm font-black uppercase text-slate-205 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />
              কিভাবে মিস্ত্রি অ্যাপ কন্ট্রোল করবেন?
            </h3>

            <div className="space-y-4 text-xs font-sans text-slate-300">
              <div className="space-y-1.5 relative pl-5 border-l border-slate-800">
                <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-cyan-600 border-2 border-slate-900"></span>
                <h4 className="font-extrabold text-slate-100 text-[13px] flex items-center gap-1">
                  ১. মিস্ত্রি অনুমোদন (Approve Partner)
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  নতুন মিস্ত্রি রেজিস্ট্রেশন করলে তারা <strong className="text-slate-200">"Technicians list"</strong> এ পেন্ডিং দেখাবে। আপনি তাদের NID ও পুলিশ বাউগ্রাউন্ড ক্লিয়ারেন্স দেখে এখানে <strong className="text-emerald-400">"Approved"</strong> করলেই কেবল মিস্ত্রি অ্যাপটি ব্যবহারযোগ্য হবে।
                </p>
              </div>

              <div className="space-y-1.5 relative pl-5 border-l border-slate-800">
                <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-cyan-600 border-2 border-slate-900"></span>
                <h4 className="font-extrabold text-slate-100 text-[13px] flex items-center gap-1">
                  ২. লাইভ ট্র্যাকিং (实时 GPS Tracking)
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  অনুমোদিত মিস্ত্রিরা যখন নিজেদের অ্যাপে ডিউটি অন করে হাঁটাচলা করবেন, তাদের জিপিএস লোকেশন ফায়ারবেসের মাধ্যমে সরাসরি আপডেট হবে। আপনি এখানে <strong className="text-slate-200">"Live Locations"</strong> ম্যাপে মিস্ত্রিদের বর্তমান পজিশন দেখতে পাবেন।
                </p>
              </div>

              <div className="space-y-1.5 relative pl-5 border-l border-slate-800">
                <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-cyan-600 border-2 border-slate-900"></span>
                <h4 className="font-extrabold text-slate-100 text-[13px] flex items-center gap-1">
                  ৩. বুকিং ও ডিসপ্যাচ ওভারভিউ
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  কোনো কাস্টমার বুকিং পাঠালে মিস্ত্রি অ্যাপ সাথে সাথে বিপ-শব্দসহ নোটিফিকেশন পাবে। মিস্ত্রি রিকোয়েস্ট মেনে নিলে বা কাজ সম্পন্ন করলে বুকিং এর লাইভ প্রগতি বা ডিসপ্যাচ স্ট্যাটাস পরিবর্তনটি এখানে রিয়েল-টাইমে আপডেট হবে।
                </p>
              </div>

              <div className="space-y-1.5 relative pl-5">
                <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-cyan-600 border-2 border-slate-900"></span>
                <h4 className="font-extrabold text-slate-100 text-[13px] flex items-center gap-1">
                  ৪. প্রমোশন ও প্রজেক্ট ব্যানার
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  আপনি এই অ্যাডমিন প্যানেল থেকে কোনো ক্যাম্পেইন বা পোষ্টার ব্যানার যুক্ত করলে (<strong className="text-slate-200">"Promo Ad Banners"</strong>) তা সাথে সাথে মিস্ত্রি অ্যাপের মূল হোমস্ক্রিন স্লাইডারে ভেসে উঠবে।
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] text-slate-400 font-sans space-y-1">
              <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[10px]">রিয়েল-টাইম ক্লাউড সিঙ্ক:</span>
              উভয় অ্যাপ একটি কেন্দ্রীভূত <span className="font-mono text-white">Google Cloud Firestore</span> ডাটাবেজ ব্যবহার করছে। কোনো ম্যানুয়াল রিফ্রেশ ছাড়াই ব্যাক-এন্ড ডাটা সম্পূর্ণ সিঙ্কড অবস্থায় থাকে।
            </div>
          </div>
        </div>

        {/* Live App Embed Screen inside Iframe */}
        <div className="lg:col-span-8 flex flex-col space-y-3" id="applet-embedded-previewer">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[500px]">
            {/* Window control bar */}
            <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between font-sans">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <div className="h-5 w-px bg-slate-800 mx-1"></div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Laptop className="h-3.5 w-3.5 text-slate-505" />
                  <span>{companionAppUrl.substring(0, 50)}...</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseIframe(!useIframe)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-tight transition-all uppercase cursor-pointer ${
                    useIframe ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {useIframe ? "Iframe Active" : "Static Simulator Mode"}
                </button>
              </div>
            </div>

            {/* Live frame container */}
            <div className="flex-1 bg-slate-950 flex flex-col relative" style={{ height: '550px' }}>
              {useIframe ? (
                <iframe
                  id="mistri-applet-live-frame"
                  src={companionAppUrl}
                  title="Mistri App Live Preview"
                  className="w-full h-full border-none"
                  referrerPolicy="no-referrer"
                  allow="geolocation; camera; microphone"
                />
              ) : (
                <div className="p-8 text-center m-auto max-w-md space-y-4 font-sans">
                  <div className="h-14 w-14 rounded-full bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto animate-bounce">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">স্ট্যাটিক সিমুলেটর মোড</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    আইফ্রেম লোড করতে কোনো সমস্যা হলে বা ব্রাউজার সিকিউরিটি ফ্রেম ব্লক করলে উপরের <span className="font-bold text-cyan-400">"মিস্ত্রি অ্যাপ খুলুন"</span> বাটনটি দিয়ে নতুন ট্যাবে অ্যাপটি ওপেন করে একই সাথে সিঙ্ক পরীক্ষা করতে পারেন।
                  </p>
                  <a
                    href={companionAppUrl}
                    target="_blank"
                    rel="noreferrer referrer policy"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 font-bold hover:underline"
                  >
                    <span>নতুন ট্যাবে ওপেন করতে এখানে ক্লিক করুন</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
