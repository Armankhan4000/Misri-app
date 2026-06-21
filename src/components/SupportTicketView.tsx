import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Send, 
  User, 
  HardHat, 
  AlertCircle, 
  Check, 
  CornerDownRight 
} from 'lucide-react';

interface TicketMessage {
  sender: 'Admin' | 'User';
  text: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  userName: string;
  userId: string;
  userRole: 'Customer' | 'Technician';
  userAvatar: string;
  category: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string; // ISO or human string
  openedTime: number; // Date.now() timestamp anchor for SLA tracking
  messages: TicketMessage[];
}

export default function SupportTicketView() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TIC-1092',
      userName: 'Aarav Sharma',
      userId: 'CUST-3049',
      userRole: 'Customer',
      userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      category: 'Billing Failure',
      subject: 'Double charge occurred during plumbing payment',
      description: 'I clicked the payment button once, but my banking app shows double deduction of ৳1500 for Suresh Kumars pipeline flush job. Please refund.',
      priority: 'High',
      status: 'Open',
      createdAt: '2026-06-20 12:40:00',
      openedTime: Date.now() - (3600 * 1000 * 4), // 4 hours ago
      messages: [
        { sender: 'User', text: 'I completed the payment but bkash sent two transaction messages. Kindly inspect.', timestamp: '2026-06-20 12:40:00' }
      ]
    },
    {
      id: 'TIC-3104',
      userName: 'Farhan Akhtar',
      userId: 'TECH-105',
      userRole: 'Technician',
      userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      category: 'Account Restrict',
      subject: 'Suspension query regarding dispute BOOK-1234',
      description: 'My dashboard is blocked from active dispatches due to safety reports. The pipeline dispute has already been logged. I need active support team review.',
      priority: 'Urgent',
      status: 'In Progress',
      createdAt: '2026-06-20 14:15:00',
      openedTime: Date.now() - (3600 * 1000 * 2.5), // 2.5 hours ago
      messages: [
        { sender: 'User', text: 'Please help unblock my account. I have been with Mistri Hub for 3 years without safety alerts.', timestamp: '2026-06-20 14:15:00' },
        { sender: 'Admin', text: 'Farhan, we are checking the dispute statements from Aarav regarding Suresh. Your suspension is pending assessment.', timestamp: '2026-06-20 15:00:00' }
      ]
    },
    {
      id: 'TIC-9912',
      userName: 'Ananya Sen',
      userId: 'CUST-9821',
      userRole: 'Customer',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      category: 'App Crash',
      subject: 'GPS map not tracking technicians dispatch pin',
      description: 'The green icon does not move on my screen. Tried restarting, but it shows stationary near Gushan checkpoint only.',
      priority: 'Medium',
      status: 'Open',
      createdAt: '2026-06-20 17:10:00',
      openedTime: Date.now() - (60 * 1000 * 40), // 40 minutes ago
      messages: [
        { sender: 'User', text: 'I am waiting for electrician Imran, map pins do not stream.', timestamp: '2026-06-20 17:10:00' }
      ]
    },
    {
      id: 'TIC-4011',
      userName: 'Imran Malik',
      userId: 'TECH-101',
      userRole: 'Technician',
      userAvatar: 'https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?w=150',
      category: 'Spares Store',
      subject: 'Replacement of Low Stock Copper Insulated Wire Coil',
      description: 'Havells wires have been ordered since Wednesday, but the delivery package is still compiling. Can I fetch from local Mirpur vendor?),',
      priority: 'Low',
      status: 'Closed',
      createdAt: '2026-06-18 09:30:00',
      openedTime: Date.now() - (3600 * 1000 * 56), // 56 hours ago
      messages: [
        { sender: 'User', text: 'Low stock wire catalog requested.', timestamp: '2026-06-18 09:30:00' },
        { sender: 'Admin', text: 'Order auto-replenishment triggered. You can buy locally and upload the cash slip for immediate reimbursement!', timestamp: '2026-06-18 11:15:00' },
        { sender: 'User', text: 'Thank you for approving local sourcing.', timestamp: '2026-06-18 12:00:00' }
      ]
    }
  ]);

  // Active / Selected Ticket State
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TIC-1092');
  const [replyText, setReplyText] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [tickerToggle, setTickerToggle] = useState(0);

  // Live SLA Timer Refresher
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerToggle(prev => prev + 1);
    }, 10000); // refresh every 10s to update SLA timers
    return () => clearInterval(timer);
  }, []);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Helper to format live SLA open durations
  const formatSLATimer = (openedTime: number) => {
    const diffMs = Date.now() - openedTime;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMins}m open`;
    }
    return `${minutes}m open`;
  };

  // Helper to resolve SLA Warning level
  const getSLAIndicator = (ticket: SupportTicket) => {
    if (ticket.status === 'Closed') return 'text-slate-500 bg-slate-950/40 border border-slate-800';
    const diffMs = Date.now() - ticket.openedTime;
    const hours = diffMs / 3600000;

    if (ticket.priority === 'Urgent') {
      if (hours >= 1) return 'text-rose-400 bg-rose-950/40 border border-rose-500/30 animate-pulse font-extrabold';
      return 'text-rose-400 bg-rose-950/20 border border-rose-800/20';
    }
    if (ticket.priority === 'High') {
      if (hours >= 2) return 'text-yellow-400 bg-yellow-950/40 border border-yellow-500/30 font-bold';
      return 'text-amber-500 bg-slate-900 border border-slate-800';
    }
    return 'text-slate-400 bg-slate-950/40 border border-slate-850';
  };

  // Action: Add Support Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply: TicketMessage = {
      sender: 'Admin',
      text: replyText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setTickets(tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'Open' ? 'In Progress' : t.status,
          messages: [...t.messages, newReply]
        };
      }
      return t;
    }));

    setReplyText('');
  };

  // Action: Escalate
  const handleEscalate = (id: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        // Change priority up
        const nextPriority: SupportTicket['priority'] = t.priority === 'Low' ? 'Medium' : t.priority === 'Medium' ? 'High' : 'Urgent';
        return { ...t, priority: nextPriority };
      }
      return t;
    }));
  };

  // Action: Close Ticket
  const handleCloseTicket = (id: string) => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Closed' as const };
      }
      return t;
    }));
  };

  // Action: Create ticket (Trigger mock incoming user ticket to prove end-to-end support ticket writing)
  const handleCreateMockTicket = () => {
    const categories = ['Booking Delay', 'App Crash', 'Payment Failed', 'Mistri behavior'];
    const subjects = ['AC Master delayed by 45 minutes', 'Voucher code rejected', 'Double card billing error', 'Incorrect wiring installed'];
    const descriptions = ['My service slot was 4:00 PM but tech is still locked in another call near Mirpur circle.', 'WINTER50 coupon is showing invalid scope error.', 'Card billing returned success but invoice says unpaid.', 'The electrician installed single core copper standard wires instead of heavy duty 3-core. Please review.'];
    const randIdx = Math.floor(Math.random() * categories.length);

    const mockId = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMock: SupportTicket = {
      id: mockId,
      userName: Math.random() > 0.5 ? 'Rahman Khan' : 'Vikram Singh',
      userId: Math.random() > 0.5 ? 'TECH-103' : 'CUST-4112',
      userRole: Math.random() > 0.5 ? 'Customer' : 'Technician',
      userAvatar: Math.random() > 0.5 ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      category: categories[randIdx],
      subject: subjects[randIdx],
      description: descriptions[randIdx],
      priority: Math.random() > 0.6 ? 'Urgent' : Math.random() > 0.3 ? 'High' : 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      openedTime: Date.now(),
      messages: [{ sender: 'User', text: descriptions[randIdx], timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) }]
    };

    setTickets([newMock, ...tickets]);
    setSelectedTicketId(mockId);
  };

  // Filtered List
  const filteredTickets = tickets.filter(t => {
    const meetPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    const meetStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return meetPriority && meetStatus;
  });

  return (
    <div className="space-y-6" id="support-ticket-container">
      {/* Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-black tracking-widest text-rose-500 uppercase bg-rose-950/40 border border-rose-800/40 rounded-md font-mono mb-2 inline-block">
            Support Desk & Chat v2.1
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans sm:text-3xl">
            সাপোর্ট টিকিট ও কমপ্লেন পোর্টাল <span className="text-cyan-400 font-mono text-lg font-bold">/ Support Tickets Desk</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            গ্রাহক এবং মিস্ত্রিদের উত্থাপিত বিভিন্ন পেমেন্ট, অ্যাকাউন্ট প্রবলেম ও কাজের ফিডব্যাক কমপ্লেনগুলোর উত্তর দিতে রিয়েল-টাইম লাইভ চ্যাটে যুক্ত হন।
          </p>
        </div>

        <button
          onClick={handleCreateMockTicket}
          className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/30 text-rose-400 text-xs font-black rounded-xl border border-rose-805 transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>নতুন টিকিট সিমুলেট করুন (Simulate Complaint)</span>
        </button>
      </div>

      {/* Ticket Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="ticket-dashboard-grid">
        {/* Ticket queue segment */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Filters */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block font-mono">
              ফিল্টার কিউ (Filtering Queue Index)
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-505 block">Urgency</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 text-slate-200 text-[10px] rounded focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-505 block">Ticket State</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 p-2 text-slate-200 text-[10px] rounded focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="Open">Unassigned/Open</option>
                  <option value="In Progress">Acting/Active</option>
                  <option value="Closed">Resolved/Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ticket Scrolllist */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredTickets.length > 0 ? (
              filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedTicketId === ticket.id 
                      ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/20' 
                      : 'bg-slate-950 border-slate-850/80 hover:bg-slate-900 hover:border-slate-800'
                  }`}
                >
                  {/* Priority strip indicator */}
                  <span className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-xl ${
                    ticket.priority === 'Urgent' ? 'bg-rose-500' :
                    ticket.priority === 'High' ? 'bg-orange-500' :
                    ticket.priority === 'Medium' ? 'bg-amber-400' : 'bg-slate-600'
                  }`} />

                  <div className="pl-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono font-bold">#{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] font-bold ${getSLAIndicator(ticket)}`}>
                        {formatSLATimer(ticket.openedTime)}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white truncate">{ticket.subject}</h4>
                      <p className="text-[10px] text-slate-450 truncate">{ticket.description}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-slate-850/60">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">{ticket.userRole === 'Customer' ? <User className="h-2.5 w-2.5" /> : <HardHat className="h-2.5 w-2.5 text-cyan-400" />}</span>
                        <span className="font-semibold text-slate-400">{ticket.userName}</span>
                      </div>

                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider font-mono ${
                        ticket.status === 'Open' ? 'text-cyan-400 bg-cyan-950/30' :
                        ticket.status === 'In Progress' ? 'text-amber-500 bg-amber-950/30' : 'text-slate-600 bg-slate-900'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center bg-slate-900/40 border border-slate-850 rounded-xl p-8 text-xs text-slate-500">
                কোন অভিযোগ পাওয়া যায়নি (No tickets matches).
              </div>
            )}
          </div>
        </div>

        {/* Selected ticket conversational hub */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between h-[610px] overflow-hidden shadow-lg shadow-black/40">
              
              {/* Header Box */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={selectedTicket.userAvatar} alt="user" className="h-10 w-10 rounded-xl object-cover border border-slate-800 shrink-0" referrerPolicy="referrer" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-white">{selectedTicket.userName}</h3>
                      <span className="text-[10px] text-slate-500 font-mono">({selectedTicket.userId})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="px-1 bg-slate-800 rounded font-bold font-mono uppercase text-[9px]">{selectedTicket.userRole}</span>
                      <span>•</span>
                      <span>Category: <strong className="text-slate-355">{selectedTicket.category}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEscalate(selectedTicket.id)}
                    className="px-2.5 py-1.5 bg-orange-950/30 hover:bg-orange-900/30 text-orange-400 text-[10px] font-bold rounded-lg border border-orange-800/30 transition-all cursor-pointer"
                  >
                    এস্ক্যালেট (Escalate)
                  </button>
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="px-2.5 py-1.5 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-450 text-[10px] font-bold rounded-lg border border-emerald-800/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check className="h-3 w-3 stroke-[3px]" /> সম্পন্ন (Close ticket)
                  </button>
                </div>
              </div>

              {/* Subject Banner */}
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex gap-2 items-start text-xs">
                <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-450 block uppercase font-mono tracking-wider">Complaint Premise:</span>
                  <p className="font-extrabold text-[#edf2f7]">{selectedTicket.subject}</p>
                </div>
              </div>

              {/* Chat Canvas Section */}
              <div id="support-chat-thread" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-955/40">
                {selectedTicket.messages.map((msg, idx) => {
                  const isAdmin = msg.sender === 'Admin';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[80%] ${isAdmin ? 'ml-auto items-end animate-slide-in' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 mb-1 text-[9px] font-mono text-slate-500">
                        <span className={isAdmin ? 'text-cyan-400 font-bold' : ''}>{msg.sender === 'Admin' ? 'Support Rep' : selectedTicket.userName}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div className={`p-3 rounded-2xl text-xs font-sans font-medium line-clamp-none ${
                        isAdmin 
                          ? 'bg-cyan-600 text-slate-950 rounded-tr-none font-bold' 
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none font-medium'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer text field */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/80">
                {selectedTicket.status !== 'Closed' ? (
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="এখানে উত্তরের বিবরণ টাইপ করুন (Say something to user...)"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="h-4 w-4 stroke-[3px]" />
                      <span>সেন্ড (Reply)</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-2.5 text-xs text-slate-505 font-mono flex items-center justify-center gap-1.5 uppercase font-black">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> This support incident ticket was solved and locked by safety team.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-550 space-y-2 h-full flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-slate-700 stroke-1" />
              <p className="text-xs">কিউ থেকে চলমান যেকোনো কমপ্লেন চ্যাট শুরু করতে বামের লিস্টে ট্যাপ করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
