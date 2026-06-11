import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Wallet, 
  Receipt, 
  LifeBuoy, 
  Image as ImageIcon, 
  Check, 
  X, 
  Search, 
  Download, 
  MessageSquare, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  User, 
  Clock, 
  ThumbsUp, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  Send,
  FileText,
  Hammer
} from 'lucide-react';
import { Language, getTranslation } from '../translations';

// ---------------------- TYPES DEFINITION ----------------------
interface Review {
  id: string;
  bookingId: string;
  customerName: string;
  technicianName: string;
  rating: number;
  comment: string;
  date: string;
  category: string;
  isFeatured: boolean;
}

interface WalletLedger {
  id: string;
  userId: string;
  userName: string;
  role: 'Technician' | 'Customer';
  balance: number;
  totalWithdrawn: number;
  payoutRequests: PayoutRequest[];
}

interface PayoutRequest {
  id: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  paymentMethod: string;
  accountDetails: string;
}

interface Invoice {
  id: string;
  bookingId: string;
  customerName: string;
  customerAddress: string;
  technicianName: string;
  category: string;
  date: string;
  baseAmount: number;
  partsCost: number;
  commissionRate: number; // e.g. 0.15 for 15%
  discount: number;
  taxAmount: number; // 5% standard vat/tax
  totalAmount: number;
}

interface SupportTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  category: 'Billing' | 'Job Quality' | 'App Issue' | 'Dispute';
  createdAt: string;
  priority: 'High' | 'Medium' | 'Low';
  messages: {
    sender: 'Admin' | 'Customer';
    text: string;
    time: string;
  }[];
}

interface PhotoVerificationJob {
  id: string;
  bookingId: string;
  technicianName: string;
  category: string;
  date: string;
  description: string;
  beforePhoto: string;
  afterPhoto: string;
  status: 'Pending Verification' | 'Approved' | 'Flagged';
  notes?: string;
}

interface ServiceSuiteViewProps {
  language: Language;
}

export default function ServiceSuiteView({ language = 'bn' }: ServiceSuiteViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ratings' | 'wallet' | 'invoice' | 'support' | 'photos'>('ratings');

  // ---------- LOCAL MEMORY / LOCAL STORAGE STATE WITH SEED DATA ----------
  
  // 1. Ratings & Reviews System State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mistri_reviews');
    if (saved) return JSON.parse(saved);
    const defaults: Review[] = [
      {
        id: 'REV-901',
        bookingId: 'BOOK-9952',
        customerName: 'Aarav Sharma',
        technicianName: 'Imran Malik',
        rating: 5,
        comment: 'অনেক নিখুঁত কাজ করেছেন ভাই! এসি একদম ঠান্ডা হচ্ছে এখন। থ্যাংক ইউ!',
        date: '2026-06-10',
        category: 'AC Mechanic',
        isFeatured: true
      },
      {
        id: 'REV-902',
        bookingId: 'BOOK-9844',
        customerName: 'Priya Patel',
        technicianName: 'Suresh Kumar',
        rating: 4,
        comment: 'পানির কলের লিকেজ ঠিক হয়েছে। তবে আসতে ২০ মিনিট লেট হয়েছিল। কাজ চমৎকার।',
        date: '2026-06-08',
        category: 'Plumber',
        isFeatured: false
      },
      {
        id: 'REV-903',
        bookingId: 'BOOK-9721',
        customerName: 'Rahman Khan',
        technicianName: 'Nisha Sethi',
        rating: 5,
        comment: 'মাইক্রোওয়েভ ওভেনটি ঠিক করায় এখন ফ্যামিলি অনেক হ্যাপি। উনি খুব প্রফেশনাল।',
        date: '2026-06-09',
        category: 'Appliance Repair',
        isFeatured: true
      },
      {
        id: 'REV-904',
        bookingId: 'BOOK-9610',
        customerName: 'Ananya Sen',
        technicianName: 'Farhan Akhtar',
        rating: 2,
        comment: 'কাজের মান ভালো না। রিয়ার লাইট লাগাতে যেয়ে স্ক্রুটা ঢিলা রেখে গেছে। অসন্তুষ্ট।',
        date: '2026-06-05',
        category: 'AC Mechanic',
        isFeatured: false
      }
    ];
    return defaults;
  });

  // 2. Wallets & Pay-out System State
  const [wallets, setWallets] = useState<WalletLedger[]>(() => {
    const saved = localStorage.getItem('mistri_wallets');
    if (saved) return JSON.parse(saved);
    const defaults: WalletLedger[] = [
      {
        id: 'WAL-101',
        userId: 'TECH-101',
        userName: 'Imran Malik (AC / Electrician)',
        role: 'Technician',
        balance: 18450,
        totalWithdrawn: 68000,
        payoutRequests: [
          { id: 'PAY-401', amount: 5000, date: '2026-06-11', status: 'Pending', paymentMethod: 'bKash', accountDetails: '+880 1712-334455' },
          { id: 'PAY-302', amount: 12000, date: '2026-06-01', status: 'Approved', paymentMethod: 'Bank Transfer', accountDetails: 'DBBL: 220.103.4912' }
        ]
      },
      {
        id: 'WAL-102',
        userId: 'TECH-102',
        userName: 'Suresh Kumar (Plumber)',
        role: 'Technician',
        balance: 8200,
        totalWithdrawn: 44000,
        payoutRequests: [
          { id: 'PAY-402', amount: 3500, date: '2026-06-11', status: 'Pending', paymentMethod: 'Nagad', accountDetails: '+880 1819-880022' }
        ]
      },
      {
        id: 'WAL-104',
        userId: 'TECH-104',
        userName: 'Nisha Sethi (Appliances)',
        role: 'Technician',
        balance: 24100,
        totalWithdrawn: 92000,
        payoutRequests: []
      }
    ];
    return defaults;
  });

  // 3. Invoice & Billing System State
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('mistri_invoices');
    if (saved) return JSON.parse(saved);
    const defaults: Invoice[] = [
      {
        id: 'INV-2026-001',
        bookingId: 'BOOK-9952',
        customerName: 'Aarav Sharma',
        customerAddress: 'House 42, Road 12, Gulshan-2, Dhaka',
        technicianName: 'Imran Malik',
        category: 'Electrician',
        date: '2026-06-10',
        baseAmount: 1200,
        partsCost: 350,
        commissionRate: 0.15,
        discount: 100,
        taxAmount: 72.5,
        totalAmount: 1522.5
      },
      {
        id: 'INV-2026-002',
        bookingId: 'BOOK-9844',
        customerName: 'Priya Patel',
        customerAddress: 'Apartment 4B, Banani Avenue, Dhaka',
        technicianName: 'Suresh Kumar',
        category: 'Plumber',
        date: '2026-06-08',
        baseAmount: 800,
        partsCost: 1200,
        commissionRate: 0.15,
        discount: 0,
        taxAmount: 100,
        totalAmount: 2100
      },
      {
        id: 'INV-2026-003',
        bookingId: 'BOOK-9721',
        customerName: 'Rahman Khan',
        customerAddress: 'Sector 4, Uttara, Dhaka',
        technicianName: 'Nisha Sethi',
        category: 'Appliance Repair',
        date: '2026-06-09',
        baseAmount: 1500,
        partsCost: 0,
        commissionRate: 0.15,
        discount: 150,
        taxAmount: 67.5,
        totalAmount: 1417.5
      }
    ];
    return defaults;
  });

  // 4. Customer Support System State
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('mistri_tickets');
    if (saved) return JSON.parse(saved);
    const defaults: SupportTicket[] = [
      {
        id: 'TKT-8802',
        customerName: 'Aarav Sharma',
        customerPhone: '+880 1711-223344',
        issue: 'আমার বুকিং এর পেমেন্ট ডাবল কেটে নেওয়া হয়েছে। রিফান্ড প্রয়োজন।',
        status: 'Open',
        category: 'Billing',
        createdAt: '2026-06-11 10:15',
        priority: 'High',
        messages: [
          { sender: 'Customer', text: 'আসসালামু আলাইকুম, আমি আজ সকালে বিকাশ দিয়ে পেমেন্ট করার সময় ২ বার টাকা কেটে গেছে। কাইন্ডলি চেক করবেন।', time: '10:15' }
        ]
      },
      {
        id: 'TKT-8803',
        customerName: 'Priya Patel',
        customerPhone: '+880 1819-224466',
        issue: 'মিস্ত্রি সঠিক সরঞ্জাম আনেনি, তাই কাজ আজ শেষ করতে পারেনি।',
        status: 'In Progress',
        category: 'Job Quality',
        createdAt: '2026-06-10 16:40',
        priority: 'Medium',
        messages: [
          { sender: 'Customer', text: 'মিস্ত্রি এসেছিলেন কিন্তু উনি পাইপের লক খোলার চাবি আনেননি। আমার কাজ আপাতত আটকে আছে।', time: '16:40' },
          { sender: 'Admin', text: 'প্রিয় গ্রাহক, আমরা দুঃখিত। ইতিমধ্যেই উক্ত টেকনিশিয়ানের সাথে যোগাযোগ করেছি এবং আগামীকাল সকাল ১০ টার মধ্যে উনি কাজ সম্পন্ন করবেন।', time: '17:10' }
        ]
      },
      {
        id: 'TKT-8804',
        customerName: 'Md. Karim',
        customerPhone: '+880 1673-991100',
        issue: 'অ্যাপ্লিকেশন প্রোমোশন কোড কাজ করছে না।',
        status: 'Resolved',
        category: 'App Issue',
        createdAt: '2026-06-09 11:15',
        priority: 'Low',
        messages: [
          { sender: 'Customer', text: 'সবুজ অ্যাপ কুপন "MISTRI20" ইনপুট দিলে ডাবল রেট দেখাচ্ছে।', time: '11:15' },
          { sender: 'Admin', text: 'আসসালামু আলাইকুম, কুপনটির মেয়াদ শেষ হয়েছিল। আমরা ব্যাকএন্ড থেকে নতুন কুপন "MISTRI50" যুক্ত করেছি। এখন ট্রাই করুন।', time: '11:45' },
          { sender: 'Customer', text: 'থ্যাংক ইউ, এখন কাজ করছে!', time: '11:58' }
        ]
      }
    ];
    return defaults;
  });

  // 5. Job Before/After Photo Verification State
  const [photoJobs, setPhotoJobs] = useState<PhotoVerificationJob[]>(() => {
    const saved = localStorage.getItem('mistri_photo_jobs');
    if (saved) return JSON.parse(saved);
    const defaults: PhotoVerificationJob[] = [
      {
        id: 'JOB-VER-301',
        bookingId: 'BOOK-9952',
        technicianName: 'Imran Malik',
        category: 'AC Mechanic',
        date: '2026-06-11',
        description: 'ইন্ডোর আউটডোর এসি কয়েল ইউনিটের গ্যাস রিফিল ও ডাস্ট ওয়াশ সম্পূর্ণ সম্পন্ন।',
        beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500', // Dusty/opened AC components
        afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500', // Sparkling clean unit
        status: 'Pending Verification'
      },
      {
        id: 'JOB-VER-302',
        bookingId: 'BOOK-9844',
        technicianName: 'Suresh Kumar',
        category: 'Plumber',
        date: '2026-06-10',
        description: 'বাথরুমের বেসিন পাইপের ফাটা প্লাস্টিক জয়েন্ট পরিবর্তন এবং সিস্যাল পুটিং ট্রিটমেন্ট।',
        beforePhoto: 'https://images.unsplash.com/photo-1542013936693-8848e5740a7a?w=500', // Damaged pipes
        afterPhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500', // Sealed pipeline
        status: 'Approved'
      }
    ];
    return defaults;
  });

  // Save states to localStorage whenever modified
  useEffect(() => {
    localStorage.setItem('mistri_reviews', JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem('mistri_wallets', JSON.stringify(wallets));
  }, [wallets]);
  useEffect(() => {
    localStorage.setItem('mistri_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('mistri_tickets', JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem('mistri_photo_jobs', JSON.stringify(photoJobs));
  }, [photoJobs]);

  // ---------- INTERACTION LOGICS ----------
  
  // 1 & 5. Reviews and Quality photo verification
  const handleToggleFeaturedReview = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
  };

  const handleVerifyQuality = (id: string, decision: 'Approved' | 'Flagged', adminNote?: string) => {
    setPhotoJobs(prev => prev.map(j => j.id === id ? { ...j, status: decision, notes: adminNote } : j));
  };

  // 2. Wallets & payout approvals
  const handleApprovePayout = (walletId: string, requestId: string) => {
    setWallets(prev => prev.map(w => {
      if (w.id === walletId) {
        let payoutAmount = 0;
        const updatedReqs = w.payoutRequests.map(r => {
          if (r.id === requestId && r.status === 'Pending') {
            payoutAmount = r.amount;
            return { ...r, status: 'Approved' as const };
          }
          return r;
        });

        if (payoutAmount > 0) {
          return {
            ...w,
            balance: Math.max(0, w.balance - payoutAmount),
            totalWithdrawn: w.totalWithdrawn + payoutAmount,
            payoutRequests: updatedReqs
          };
        }
      }
      return w;
    }));
  };

  const handleRejectPayout = (walletId: string, requestId: string) => {
    setWallets(prev => prev.map(w => {
      if (w.id === walletId) {
        const updatedReqs = w.payoutRequests.map(r => {
          if (r.id === requestId) {
            return { ...r, status: 'Rejected' as const };
          }
          return r;
        });
        return {
          ...w,
          payoutRequests: updatedReqs
        };
      }
      return w;
    }));
  };

  // 3. Invoice generating & filtering
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(invoices[0] || null);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  
  // 4. Support chat dynamic typing
  const [activeTicketId, setActiveTicketId] = useState<string>(tickets[0]?.id || '');
  const [chatInputMessage, setChatInputMessage] = useState('');

  const currentTicket = tickets.find(t => t.id === activeTicketId);

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputMessage.trim() || !activeTicketId) return;

    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          status: 'In Progress' as const,
          messages: [
            ...t.messages,
            {
              sender: 'Admin',
              text: chatInputMessage.trim(),
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
    setChatInputMessage('');
  };

  const handleCloseTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' as const } : t));
  };


  return (
    <div className="space-y-6" id="service-suite-main">
      
      {/* View Header with Bengali, English Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5" id="suite-header">
        <div>
          <span className="px-2.5 py-1 text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-800/40 rounded-full font-mono mb-2 inline-block">
            Mistri Platform Premium Additions
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            ম্যানেজমেন্ট স্যুট <span className="text-emerald-400 font-mono text-lg font-bold">/ Service Suite Portal</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-sans">
            প্ল্যাটফর্মটির বিশ্বাসযোগ্যতা, পেমেন্ট ক্লিয়ারেন্স ও গ্রাহক সন্তুষ্টি নিশ্চিতে ৫টি হাই-প্রোফাইল ব্যাকএন্ড কন্ট্রোল প্যানেল।
          </p>
        </div>

        {/* Dynamic Quick Overview Stat pill */}
        <div className="flex items-center gap-3 mt-4 md:mt-0 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">PLATFORM STATUS</span>
              <span className="text-xs text-slate-200 font-black">All Modules Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/50" id="suite-subtabs">
        <button
          onClick={() => setActiveSubTab('ratings')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'ratings' 
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-black' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
          }`}
        >
          <Star className={`h-4 w-4 ${activeSubTab === 'ratings' ? 'text-emerald-400 fill-emerald-400/20' : ''}`} />
          <span>১. রেটিং ও রিভিউ ফিড</span>
        </button>

        <button
          onClick={() => setActiveSubTab('wallet')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'wallet' 
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-black' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>২. ওয়ালেট ও উইথড্রল</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invoice')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'invoice' 
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-black' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>৩. ইনভয়েস ও বিলিং</span>
        </button>

        <button
          onClick={() => setActiveSubTab('support')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'support' 
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-black' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
          }`}
        >
          <LifeBuoy className="h-4 w-4" />
          <span>৪. কাস্টমার সাপোর্ট হেল্পডেস্ক</span>
        </button>

        <button
          onClick={() => setActiveSubTab('photos')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
            activeSubTab === 'photos' 
              ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-black' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>৫. কাজের ছবি ভেরিফিকেশন (Before/After)</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB BODY */}
      <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-1" id="suite-display-container">
        
        {/* ======================= TAB 1: RATINGS & REVIEWS ======================= */}
        {activeSubTab === 'ratings' && (
          <div className="p-4 space-y-6 animate-fade-in" id="ratings-sub-panel">
            {/* Header statistics and summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider font-mono">Platform Average</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                  <span className="text-2xl font-black text-white font-mono">4.62 / 5.00</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-2 font-sans">মোট ২৪০+ টি জেনুইন ফিডব্যাক</span>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl font-sans">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">হাইভ ক্লিয়ারেন্স রেট</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  ৯৮.৪% পজিটিভ
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">৪ বা ৫ স্টার পেয়েছেন বেশিরভাগ মিস্ত্রি</span>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl font-sans">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">অভিযোগ/লো স্কোর ফ্ল্যাগ</span>
                <div className="text-xl font-black text-rose-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-450" />
                  <span>২টি রিভিউ ফ্লাগড</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">৩ স্টারের নিচের রিভিউগুলো অডিটাধীন</span>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-2xl font-sans">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Featured Reviews Selected</span>
                <div className="text-2xl font-black text-cyan-400 mt-1">
                  {reviews.filter(r => r.isFeatured).length} টি হোমস্ক্রিন ফিড
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">গ্রাহকদের কাছে এগুলো প্রদর্শিত হবে</span>
              </div>
            </div>

            {/* List of customer reviews */}
            <div className="border border-slate-850/60 rounded-2xl overflow-hidden bg-slate-900/30">
              <div className="bg-slate-950 p-4 border-b border-slate-805 flex items-center justify-between font-sans">
                <h3 className="text-xs font-black uppercase text-slate-200">
                  গ্রাহকদের জমা দেওয়া সকল রিভিউ ও কমেন্টসমূহ / Real Reviews List
                </h3>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  Data updated: Live
                </span>
              </div>

              <div className="divide-y divide-slate-900">
                {reviews.map(r => (
                  <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-900/30 transition-colors">
                    <div className="space-y-2 flex-1 font-sans">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-slate-100">{r.customerName}</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-xs text-slate-400 font-extrabold flex items-center gap-1">
                          <User className="h-3 w-3 inline text-emerald-400" /> {r.technicianName} ({r.category})
                        </span>
                        <span className="text-[10px] bg-slate-800/80 text-indigo-400 border border-slate-700/50 px-2 py-0.5 rounded font-mono font-bold">
                          {r.bookingId}
                        </span>
                      </div>

                      {/* Stars visualization */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} 
                          />
                        ))}
                        <span className="text-[11px] font-bold text-slate-400 ml-1.5 font-mono">{r.rating} / 5</span>
                      </div>

                      <p className="text-xs text-slate-350 leading-relaxed max-w-2xl bg-slate-950/40 p-3 rounded-xl border border-slate-900/80">
                        "{r.comment}"
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                        <span>জমা দেওয়ার তারিখ: {r.date}</span>
                      </div>
                    </div>

                    {/* Review administrative features */}
                    <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleFeaturedReview(r.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide cursor-pointer transition-all flex items-center gap-1 font-sans border ${
                          r.isFeatured 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-slate-950 text-slate-450 border-slate-800/80 hover:border-slate-705 shadow-md'
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {r.isFeatured ? 'হোম স্লাইডারে পিন করা আছে' : 'হোম স্লাইডারে পিন করুন'}
                      </button>

                      {r.rating <= 2 && (
                        <div className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-lg flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-rose-450" />
                          <span>ফ্ল্যাগড প্যানেল অডিট</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* ======================= TAB 2: WALLET & WIHDRAWAL SYSTEM ======================= */}
        {activeSubTab === 'wallet' && (
          <div className="p-4 space-y-6 animate-fade-in font-sans" id="wallet-sub-panel">
            {/* Wallet core system details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">মোট প্ল্যাটফর্ম ডিপোজিট রিজার্ভ</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1 flex items-center">
                    <DollarSign className="h-7 w-7 text-emerald-500" />
                    <span>১,৫৬,৪৫০ ৳ <span className="text-xs font-bold text-slate-400 font-sans">BDT</span></span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-850">
                  গ্রাহকদের দেওয়া পেমেন্ট ব্যাংক, বিকাশ ও নগদ গেটওয়ের মাধ্যমে সরাসরি প্ল্যাটফর্ম ট্রাস্ট ফান্ডে জমা হয়।
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">মিস্ত্রিদের পেমেন্ট ক্লিয়ারড বুকিং</span>
                  <div className="text-2xl font-black text-indigo-400 mt-1 flex items-center">
                    <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                    <span className="ml-1">৫,০৭,৫০০ ৳ <span className="text-xs text-slate-400">BDT</span></span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-850">
                  সরাসরি মিস্ত্রি পার্টনারদের একাউন্টে জমা হওয়া বুকিং ডিসপ্যাচ কমিশন বাদে ক্লিয়ারড ফান্ডের সর্বমোট পরিমাণ।
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">পেন্ডিং উইথড্রয়াল রিকোয়েস্ট</span>
                  <div className="text-2xl font-black text-rose-400 mt-1 flex items-center">
                    <Clock className="h-6 w-6 text-rose-400 animate-pulse" />
                    <span className="ml-1.5">
                      {wallets.reduce((acc, w) => acc + w.payoutRequests.filter(r => r.status === 'Pending').length, 0)} টি পেন্ডিং উইথড্রয়াল
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-405 leading-relaxed mt-3 pt-3 border-t border-slate-850">
                  মিস্ত্রিদের জমাকৃত ফান্ডের বিপরীতে গেটওয়ে উইথড্রল রিকোয়েস্ট প্যানেল। কাইন্ডলি নিচে ভেরিফাই ও এপ্রুভ করুন।
                </p>
              </div>
            </div>

            {/* Payout requests management block */}
            <div className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-900/30">
              <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-200">
                  উইথড্র রিকোয়েস্ট ও গেটওয়ে এপ্রুভাল / Technician Cashout Requests Queue
                </h3>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] py-1 px-2.5 rounded font-bold border border-emerald-800/40 uppercase">
                  payout control active
                </span>
              </div>

              {wallets.some(w => w.payoutRequests.length > 0) ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 uppercase font-mono text-[10px] text-slate-450 border-b border-slate-850">
                      <tr>
                        <th className="p-4 font-semibold">মিস্ত্রি আইডি / নাম</th>
                        <th className="p-4 font-semibold">টাকার পরিমাণ (Amount)</th>
                        <th className="p-4 font-semibold">পেমেন্ট মেথড ও হিসাব</th>
                        <th className="p-4 font-semibold">তারিখ (Date)</th>
                        <th className="p-4 font-semibold">অবস্থা (Status)</th>
                        <th className="p-4 font-semibold text-right">পদক্ষেপ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 border-none">
                      {wallets.flatMap(w => 
                        w.payoutRequests.map(r => (
                          <tr key={r.id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-slate-100 block">{w.userName}</span>
                              <span className="font-mono text-[10px] text-slate-500 block">UserId: {w.userId} | Wallet: {w.id}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-mono font-black text-slate-100 text-sm">{r.amount} ৳</span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-wider block w-fit mb-1">
                                {r.paymentMethod}
                              </span>
                              <span className="font-mono text-slate-350 select-all block text-[11px]">{r.accountDetails}</span>
                            </td>
                            <td className="p-4 font-mono text-slate-450 text-[11px]">{r.date}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider flex items-center gap-1 w-fit ${
                                r.status === 'Pending' 
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                                  : r.status === 'Approved' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-slate-950 text-slate-500 border-slate-800'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${r.status==='Pending' ? 'bg-rose-400 animate-pulse' : r.status==='Approved' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                                {r.status === 'Pending' && 'পেন্ডিং এপ্রুভাল'}
                                {r.status === 'Approved' && 'সফল এপ্রুভড'}
                                {r.status === 'Rejected' && 'বাতিল করা হয়েছে'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {r.status === 'Pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleRejectPayout(w.id, r.id)}
                                    className="p-1 px-2.5 bg-slate-950 hover:bg-rose-950 hover:text-white border border-slate-800 hover:border-rose-800/40 text-slate-400 font-extrabold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                                    title="Reject cashout"
                                  >
                                    <X className="h-3 w-3" />
                                    <span>বাতিল</span>
                                  </button>
                                  <button
                                    onClick={() => handleApprovePayout(w.id, r.id)}
                                    className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] text-slate-950 font-black rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                                    title="Accept and pay"
                                  >
                                    <Check className="h-3 w-3" />
                                    <span>টাকা পাঠান</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-bold block pr-2">No action needed</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">উইথড্র করতে চেয়ে কোনো রিকোয়েস্ট জমা পড়েনি।</div>
              )}
            </div>
          </div>
        )}


        {/* ======================= TAB 3: INVOICE & BILLING SYSTEM ======================= */}
        {activeSubTab === 'invoice' && (
          <div className="p-4 space-y-6 animate-fade-in font-sans" id="invoice-sub-panel">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Search & List */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">রিসিপ্ট ডিরেক্টরি / Search Invoices</h4>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pr-3 pl-3.5 flex items-center text-slate-400 pointers-event-none">
                      <Search className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="কাস্টমার নাম বা ইনভয়েস আইডি..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 pl-10 pr-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-850">
                  <div className="bg-slate-950 p-3.5 text-xs font-black text-slate-350 uppercase select-none">
                    INVOICES ({invoices.length})
                  </div>
                  
                  {invoices
                    .filter(inv => 
                      inv.customerName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) || 
                      inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
                    )
                    .map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => setSelectedInvoice(inv)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                          selectedInvoice?.id === inv.id 
                            ? 'bg-emerald-600/10 border-l-4 border-emerald-500' 
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-100 block">{inv.customerName}</span>
                          <span className="font-mono text-[10px] text-slate-500 block">ID: {inv.id} • {inv.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-slate-205 block">{inv.totalAmount} ৳</span>
                          <span className="text-[10px] text-slate-500 font-mono block">{inv.date}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Right Column: Invoice Simulator look */}
              <div className="lg:col-span-7">
                {selectedInvoice ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px]" id="invoice-sheet">
                    {/* Control Bar inside app */}
                    <div className="bg-slate-950 p-4 border-b border-slate-850/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-black text-slate-200">সার্টিফিকেট ইনভয়েস প্রিভিউ / Dynamic Receipt Invoice</span>
                      </div>
                      <button 
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        <span>ডাউনলোড বা প্রিন্ট রিসিপ্ট</span>
                      </button>
                    </div>

                    {/* Simulation Sheet of Tax Invoice */}
                    <div className="p-6 md:p-8 flex-1 bg-white text-slate-900 space-y-6" id="invoice-printed-content">
                      {/* Brand Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-black text-lg tracking-wider">
                            <Hammer className="h-5 w-5 text-emerald-600 inline" />
                            <span>MISTRI CORP.</span>
                          </div>
                          <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                            House 15, Lakeview Road, Banani Model Town,<br />
                            Dhaka 1213, Bangladesh.<br />
                            বিন নম্বর / BIN: ০১২৪৭৩৩৯১৮-৯০১
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wide">মাস্টার ট্যাক্স ইনভয়েস</span>
                          <span className="text-lg font-mono font-bold block text-slate-800">{selectedInvoice.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono block">মুশলক নম্বর: ৬.৩ (Invoice Mushak)</span>
                        </div>
                      </div>

                      {/* Client / Tech Split */}
                      <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-205 py-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-450 uppercase font-bold block">বরাবর / Service Recipient:</span>
                          <span className="font-bold text-slate-800 block">{selectedInvoice.customerName}</span>
                          <p className="text-slate-500 leading-normal text-[10px] max-w-[200px]">{selectedInvoice.customerAddress}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] text-slate-450 uppercase font-bold block">সেবাদাতা মিস্ত্রি / Professional:</span>
                          <span className="font-bold text-slate-800 block">{selectedInvoice.technicianName}</span>
                          <p className="text-slate-500 text-[10px]">{selectedInvoice.category} Expert</p>
                          <span className="text-[10px] text-slate-400 font-mono block">তারিখ / Order Date: {selectedInvoice.date}</span>
                        </div>
                      </div>

                      {/* Items details table */}
                      <div className="space-y-3">
                        <div className="flex justify-between font-bold text-[10px] uppercase text-slate-500 border-b border-slate-205 pb-1 font-sans">
                          <span>বর্ণনা / SERVICE JOB LINE ITEMS</span>
                          <span>মোট মূল্য / TAXABLE BDT</span>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-slate-800">
                            <div className="space-y-0.5">
                              <span className="font-bold">১. প্রফেশনাল সার্ভিস চার্জ (Base Service Fee)</span>
                              <p className="text-[10px] text-slate-450">ক্যাব ও টেকনিশিয়ানের সাইট সার্ভিস ভিজিট ফি</p>
                            </div>
                            <span className="font-mono">{selectedInvoice.baseAmount.toFixed(2)} ৳</span>
                          </div>

                          {selectedInvoice.partsCost > 0 && (
                            <div className="flex justify-between text-slate-800">
                              <div className="space-y-0.5">
                                <span className="font-bold">২. খুচরা যন্ত্রাংশ বা মালামাল বাবদ (Spare Parts)</span>
                                <p className="text-[10px] text-slate-450">অর্ডার এগ্রিমেন্ট অনুযায়ী ব্যবহৃত অতিরিক্ত যন্ত্রাংশ ফি</p>
                              </div>
                              <span className="font-mono">{selectedInvoice.partsCost.toFixed(2)} ৳</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Breakdown math block */}
                      <div className="flex justify-end pt-4" id="invoice-breakdown-math">
                        <div className="w-64 space-y-1.5 text-xs text-slate-700 border-t border-slate-105 pt-3">
                          <div className="flex justify-between font-mono">
                            <span>উপ-মোট / Subtotal Price:</span>
                            <span>{(selectedInvoice.baseAmount + selectedInvoice.partsCost).toFixed(2)} ৳</span>
                          </div>
                          
                          {selectedInvoice.discount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-bold font-mono">
                              <span>ডিসকাউন্ট / Promo Offer:</span>
                              <span>-{selectedInvoice.discount.toFixed(2)} ৳</span>
                            </div>
                          )}

                          <div className="flex justify-between font-mono">
                            <span>ভ্যাট ও সম্পূরক শুল্ক (5% SD):</span>
                            <span>{selectedInvoice.taxAmount.toFixed(2)} ৳</span>
                          </div>

                          <div className="flex justify-between font-mono">
                            <span>প্ল্যাটফর্ম চার্জ / Convenience Fee:</span>
                            <span>{(selectedInvoice.baseAmount * selectedInvoice.commissionRate).toFixed(2)} ৳</span>
                          </div>

                          <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-350 pt-2 font-mono">
                            <span>সর্বমোট পরিশোধ / TOTAL:</span>
                            <span>{selectedInvoice.totalAmount.toFixed(2)} ৳</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer signatures */}
                      <div className="flex justify-between text-[9px] text-slate-400 pt-8 font-sans">
                        <div className="text-center">
                          <div className="h-10 w-24 border-b border-slate-300 mx-auto opacity-40"></div>
                          <span className="block mt-1">গ্রাহকের স্বাক্ষর (Client Receipt)</span>
                        </div>
                        <div className="text-center">
                          <div className="h-10 w-24 border-b border-slate-300 mx-auto opacity-40"></div>
                          <span className="block mt-1">অনুমোদিত ম্যানেজার (Mistri Officer)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">ইনভয়েস তালিকা থেকে রিসিপ্ট সিলেক্ট করুন।</div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ======================= TAB 4: CUSTOMER SUPPORT CENTER ======================= */}
        {activeSubTab === 'support' && (
          <div className="p-4 space-y-6 animate-fade-in font-sans" id="support-sub-panel">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left column: Ticket queues */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-202">গ্রাহক টিকিট তালিকা / Ticket Desk</span>
                    <span className="bg-rose-950 text-rose-400 font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                      Incoming support requests
                    </span>
                  </div>

                  <div className="divide-y divide-slate-855">
                    {tickets.map(t => (
                      <div
                        key={t.id}
                        onClick={() => setActiveTicketId(t.id)}
                        className={`p-4 cursor-pointer transition-colors space-y-2 ${
                          activeTicketId === t.id ? 'bg-emerald-600/10 border-l-4 border-emerald-500' : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-100">{t.customerName}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            t.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {t.priority} Urgent
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 truncate leading-relaxed">
                          {t.issue}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                          <span>শ্রেণী: {t.category}</span>
                          <span className={`px-2 py-0.5 rounded ${
                            t.status === 'Open' 
                              ? 'bg-rose-500/10 text-rose-400' 
                              : t.status === 'In Progress' 
                              ? 'bg-amber-500/10 text-amber-400' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {t.status === 'Open' && 'নতুন অভিযোগ'}
                            {t.status === 'In Progress' && 'চলতি তদন্ত'}
                            {t.status === 'Resolved' && 'সমাধান সফল'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Dynamic Chat Transcript */}
              <div className="lg:col-span-7">
                {currentTicket ? (
                  <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
                    
                    {/* Header info */}
                    <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="space-y-1 select-all">
                        <span className="text-xs font-black text-slate-100">{currentTicket.customerName} ({currentTicket.customerPhone})</span>
                        <p className="text-[10px] text-slate-400 font-mono">Topic: {currentTicket.issue}</p>
                      </div>

                      {currentTicket.status !== 'Resolved' ? (
                        <button
                          onClick={() => handleCloseTicket(currentTicket.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                        >
                          সমাধান সম্পন্ন করুন (Solve)
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-slate-950 text-emerald-400 border border-emerald-950/40 text-[10px] font-black rounded-lg">
                          ✓ Resolved Pass
                        </span>
                      )}
                    </div>

                    {/* Chat Bubble scroller */}
                    <div className="flex-1 p-4 bg-slate-950 overflow-y-auto space-y-4 relative" style={{ height: '320px' }}>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-3 py-1 rounded border border-slate-800 font-mono inline-block">
                          Ticket Opened {currentTicket.createdAt}
                        </span>
                      </div>

                      {currentTicket.messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col max-w-sm ${m.sender === 'Admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            m.sender === 'Admin' 
                              ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none' 
                              : 'bg-slate-900 text-slate-201 border border-slate-800 rounded-tl-none'
                          }`}>
                            {m.text}
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono mt-1">{m.time} via {m.sender}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat editor form */}
                    {currentTicket.status !== 'Resolved' ? (
                      <form onSubmit={handleSendSupportMessage} className="bg-slate-950 p-4 border-t border-slate-800 flex items-center gap-2">
                        <input
                          type="text"
                          value={chatInputMessage}
                          onChange={(e) => setChatInputMessage(e.target.value)}
                          placeholder="গ্রাহক সহায়তায় উত্তর লিখুন..."
                          className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-emerald-500 rounded-xl px-4 py-3 text-xs transition-colors"
                        />
                        <button
                          type="submit"
                          className="h-10 w-11 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-slate-500 text-xs font-mono">
                        অভিযোগ সমাধান করা হয়েছে। আর কোনো মেসেজ টাইপ করা যাবে না।
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400">কোনো হেল্পডেস্ক টিকিট পাওয়া যায়নি।</div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ======================= TAB 5: BEFORE/AFTER PHOTO VERIFICATION ======================= */}
        {activeSubTab === 'photos' && (
          <div className="p-4 space-y-6 animate-fade-in font-sans" id="photos-sub-panel">
            <div className="bg-slate-900 border border-slate-808/80 p-4 rounded-2xl">
              <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-widest font-mono mb-2">
                ভিজ্যুয়াল রিপেয়ার অডিটিং সিস্টেম / Job Completion Quality Audit
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                আইন ও বিশ্বাসযোগ্যতার স্বার্থে মিস্ত্রিদের কাজের কাজের অগ্রীম প্রগতি দেখার জন্যে "কাজের আগের ছবি" (Before) এবং "কাজ শেষের ছবি" (After) বিশ্লেষণ প্যানেল। কোনো গরমিল বা দুর্নীতি ঠেকাতে ম্যানেজার এখান থেকে ভেরিফিকেশন মঞ্জুর বা ফ্লাগ করতে পারেন।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photoJobs.map(job => (
                <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between" id={`verification-card-${job.id}`}>
                  
                  {/* Card head */}
                  <div className="bg-slate-950 p-4 border-b border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-205 text-xs block">{job.technicianName}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Booking: {job.bookingId} • Category: {job.category}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono border ${
                      job.status === 'Pending Verification' 
                        ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' 
                        : job.status === 'Approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                    }`}>
                      {job.status === 'Pending Verification' && 'পেন্ডিং ভেরিফিকেশন'}
                      {job.status === 'Approved' && '✓ সম্পন্ন ও ভেরিফাইড'}
                      {job.status === 'Flagged' && '⚠ ফ্লাগড স্থগিত'}
                    </span>
                  </div>

                  {/* Body description text */}
                  <div className="p-4 space-y-4">
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                      <strong>বর্ণনা:</strong> {job.description}
                    </p>

                    {/* Parallel Comparative Photos Frame */}
                    <div className="grid grid-cols-2 gap-3" id="photo-comparisons">
                      <div className="space-y-1 pt-0.5">
                        <span className="text-[10px] text-rose-400 font-bold tracking-wide uppercase flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                          আগের ত্রুটি (BEFORE WORK)
                        </span>
                        <div className="h-36 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative">
                          <img 
                            src={job.beforePhoto} 
                            alt="Repair before state" 
                            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all cursor-zoom-in"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 pt-0.5">
                        <span className="text-[10px] text-emerald-400 font-bold tracking-wide uppercase flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          পরবর্তী সমাপ্তি (AFTER WORK)
                        </span>
                        <div className="h-36 bg-slate-950 border border-emerald-950 rounded-xl overflow-hidden relative">
                          <img 
                            src={job.afterPhoto} 
                            alt="Repair after state" 
                            className="w-full h-full object-cover text-xs text-slate-500 inline-block hover:scale-[1.03] transition-all cursor-zoom-in"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>

                    {job.notes && (
                      <div className="bg-slate-905 p-3 rounded-xl border border-slate-850 text-xs text-slate-400 font-sans">
                        <strong>প্যানেল অডিট নোট:</strong> {job.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  {job.status === 'Pending Verification' && (
                    <div className="bg-slate-950/70 p-3.5 border-t border-slate-850 flex justify-end gap-2">
                      <button
                        onClick={() => handleVerifyQuality(job.id, 'Flagged', 'ত্রুটি স্পষ্ট নয়, মিস্ত্রিকে আবার ছবি জমা দিতে বলা হলো')}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-rose-950/30 text-rose-400 border border-slate-800 hover:border-rose-800/40 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        ফ্ল্যাগ করুন (Flag Request)
                      </button>
                      <button
                        onClick={() => handleVerifyQuality(job.id, 'Approved', 'কাজের মান সর্বোচ্চ সন্তোষজনক, ভেরিফাইড')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>কাজ অনুমোদন করুন</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
