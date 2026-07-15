import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MessageSquare, Phone, Mail, HelpCircle, 
  ChevronDown, AlertTriangle, Send, User, X, CheckSquare, 
  FileText, ArrowRight, Bot, ShieldCheck
} from 'lucide-react';
import { FAQS } from '../data';

interface SupportViewProps {
  onTriggerNotification: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function SupportView({ onTriggerNotification }: SupportViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Chat Simulator State
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'agent', text: 'Hello! Welcome to TravelGo Priority Support. I am Emily, your digital assistant. How can I help you today?', time: 'Just now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Complaint Form State
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintType, setComplaintType] = useState('Booking Issue');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [complaintSuccessRef, setComplaintSuccessRef] = useState('');

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Filter FAQs based on search
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const query = searchQuery.toLowerCase();
    return FAQS.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const queryText = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // Simulate smart agent response
    setTimeout(() => {
      let replyText = "Thank you for reaching out. A premium care team specialist is reviewing your file. May I have your TravelGo booking reference ID if applicable?";
      
      if (queryText.includes('cancel') || queryText.includes('refund')) {
        replyText = "To cancel your ticket, go to 'My Trips', tap your ticket, and click 'Cancel Booking'. You get a 100% refund into your TravelGo Wallet immediately if cancelled 24 hours prior to departure!";
      } else if (queryText.includes('wallet') || queryText.includes('balance')) {
        replyText = "Your TravelGo Wallet is secure. You can load money via Visa/UPI directly from the 'Wallet' tab and check your live transaction ledger anytime.";
      } else if (queryText.includes('luggage') || queryText.includes('bag')) {
        replyText = "Each premium ticket includes 1 check-in bag (up to 23kg) and 1 hand luggage (up to 10kg) free of charge. Excess luggage terms depend on the operator.";
      } else if (queryText.includes('discount') || queryText.includes('promo')) {
        replyText = "You can apply active promo coupons like TRAVELNEW (30% off first trip) or TRAVEL15 (£15 off) directly on the seat selection page!";
      } else if (queryText.includes('seat')) {
        replyText = "You select your precise seat (luxury recliner or sleeper berth) from an interactive coach layout during checkout. Seats cannot be changed after payment.";
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDetails.trim()) {
      onTriggerNotification("Please provide details of your complaint or enquiry.");
      return;
    }
    const refId = `TG-TICKET-REF-${Math.floor(100000 + Math.random() * 900000)}`;
    setComplaintSuccessRef(refId);
    setComplaintDetails('');
    onTriggerNotification(`Enquiry submitted successfully! Reference: ${refId}`);
  };

  return (
    <div className="space-y-6 pb-6 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Search Help Center Header */}
      <section className="relative py-8 overflow-hidden rounded-2xl bg-surface p-5 border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
        <div className="relative z-10 text-center space-y-4 max-w-lg mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-on-background font-display uppercase tracking-wider">
            How can we help?
          </h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs, cancellation, baggage rules..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#050505] dark:border-white bg-background shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] focus:ring-0 text-sm font-semibold text-on-background"
            />
          </div>
        </div>
      </section>

      {/* Support Channels Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Chat Support Card (Primary CTA) */}
        <div className="md:col-span-2 bg-surface rounded-2xl p-5 flex flex-col justify-between border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="bg-primary/20 border-2 border-[#050505] w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-4 shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
                <MessageSquare className="w-6 h-6 fill-current text-[#050505]" />
              </div>
              <h3 className="text-lg font-black uppercase font-display tracking-wider text-on-background">
                24/7 Priority Chat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-semibold">
                Connect instantly with Emily and our premium passenger support team for instant modifications.
              </p>
            </div>
            <span className="bg-emerald-500 text-white border-2 border-emerald-700 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse shadow-sm">
              Online
            </span>
          </div>
          <button 
            id="support-start-chat"
            onClick={() => {
              setShowChatWindow(true);
              onTriggerNotification("Starting priority live chat simulation with Emily...");
            }}
            className="w-full py-3 bg-primary text-[#050505] font-black uppercase tracking-wider border-2 border-[#050505] dark:border-white rounded-xl text-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
          >
            Start Chat Now
          </button>
        </div>

        {/* Call and Email Columns */}
        <div className="flex flex-col gap-4">
          <a 
            href="tel:+15550123456"
            className="bg-surface rounded-xl p-4 border-2 border-[#050505] dark:border-white flex flex-col justify-center items-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-1 group shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
          >
            <Phone className="w-7 h-7 text-[#050505] dark:text-white group-hover:scale-110 transition-transform mb-2" />
            <h4 className="font-black uppercase text-xs text-[#050505] dark:text-white font-display">Call Us Directly</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Avg wait time: 2 mins</p>
          </a>

          <a 
            href="mailto:support@travelgo.com"
            className="bg-surface rounded-xl p-4 border-2 border-[#050505] dark:border-white flex flex-col justify-center items-center text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-1 group shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
          >
            <Mail className="w-7 h-7 text-[#050505] dark:text-white group-hover:scale-110 transition-transform mb-2" />
            <h4 className="font-black uppercase text-xs text-[#050505] dark:text-white font-display">Email Desk</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Response: under 24 hours</p>
          </a>
        </div>
      </section>

      {/* Categories & Complaint Form */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Popular Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-on-background tracking-wider font-display uppercase">Popular Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Booking', color: 'text-primary bg-blue-100/40 dark:bg-blue-950/20' },
              { label: 'Cancellation', color: 'text-rose-500 bg-rose-100/40 dark:bg-rose-950/20' },
              { label: 'Wallet Refunds', color: 'text-emerald-500 bg-emerald-100/40 dark:bg-emerald-950/20' },
              { label: 'Route Tracking', color: 'text-amber-500 bg-amber-100/40 dark:bg-amber-950/20' }
            ].map(cat => (
              <button
                key={cat.label}
                onClick={() => {
                  setSearchQuery(cat.label);
                  onTriggerNotification(`Filtering FAQs for: ${cat.label}`);
                }}
                className="flex items-center p-3 bg-surface rounded-xl border-2 border-[#050505] dark:border-white shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-none transition-shadow text-left cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${cat.color} font-black group-hover:scale-105 transition-transform text-xs`}>
                  {cat.label[0]}
                </div>
                <span className="text-xs font-black uppercase text-[#050505] dark:text-slate-200">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Complaint / Need Help form */}
        <div className="bg-surface rounded-2xl p-5 border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <h3 className="font-black text-base text-slate-900 dark:text-white uppercase font-display tracking-wide mb-2">Need more help?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-semibold">
            If you have an outstanding issue, can't find your ticket, or want to register feedback about an operator, please file a complaint below.
          </p>
          
          {complaintSuccessRef ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-[#050505] dark:border-white rounded-xl text-center space-y-2"
            >
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">Enquiry Logged Successfully</p>
              <p className="text-[10px] text-slate-400 font-bold">Our customer desk will review and update you under 12 hours.</p>
              <p className="text-[10px] font-black text-[#050505] dark:text-white bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest w-fit mx-auto">
                {complaintSuccessRef}
              </p>
              <button 
                onClick={() => setComplaintSuccessRef('')}
                className="text-xs font-bold text-primary dark:text-blue-400 hover:underline cursor-pointer block pt-2 mx-auto"
              >
                File Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="space-y-3">
              <div className="flex gap-2">
                <select 
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-2 border-[#050505] dark:border-white rounded-lg px-3 py-2 text-xs font-black focus:ring-0"
                >
                  <option value="Booking Issue">Booking Issue</option>
                  <option value="Cancellation/Refund">Refund/Wallet</option>
                  <option value="Bus operator delay">Operator Delay</option>
                  <option value="Other Feedback">Other feedback</option>
                </select>
                <input 
                  type="text" 
                  value={complaintDetails}
                  onChange={(e) => setComplaintDetails(e.target.value)}
                  placeholder="Summarize your issue..."
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-[#050505] dark:border-white rounded-lg px-3 py-2 text-xs font-black focus:ring-0 text-on-background"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-[#050505] dark:bg-white text-white dark:text-[#050505] rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer border-2 border-[#050505] dark:border-white active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(242,125,38,1)]"
              >
                Raise a Complaint Case
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t-2 border-[#050505]/10 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            Reference ID for this session: #TG-8829-SUPPORT
          </div>
        </div>

      </section>

      {/* FAQs Collapsible Accordion */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-bold text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed text-left border-t border-slate-50 dark:border-slate-700/40 pt-2.5">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support Chat Simulator Floating Widget Modal */}
      <AnimatePresence>
        {showChatWindow && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-background w-full sm:max-w-md h-[80vh] sm:h-[600px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-4 border-[#050505] dark:border-white"
            >
              {/* Chat Header */}
              <header className="p-4 bg-primary text-[#050505] border-b-4 border-[#050505] dark:border-white flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#050505] flex items-center justify-center text-[#050505] relative shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
                    <Bot className="w-5 h-5 fill-current" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#050505] rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase font-display tracking-wide">Emily (TravelGo Help)</h4>
                    <p className="text-[10px] text-[#050505]/70 font-black uppercase tracking-wider">Priority Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChatWindow(false)}
                  className="w-8 h-8 rounded-lg border-2 border-[#050505] bg-white text-[#050505] hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isUser 
                          ? 'bg-primary border-2 border-[#050505] text-[#050505]' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isUser ? 'ME' : <Bot className="w-4.5 h-4.5" />}
                      </div>
                      <div className="space-y-1">
                        <div className={`p-3 rounded-lg text-xs font-semibold leading-relaxed border-2 border-[#050505] ${
                          isUser 
                            ? 'bg-[#ffebe0] text-[#050505] shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]' 
                            : 'bg-white text-[#050505] shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wide">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2.5 max-w-[80%] text-left">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <div className="bg-white border-2 border-[#050505] p-3.5 rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChatMessage} className="p-3 border-t-2 border-[#050505] dark:border-white bg-slate-50 dark:bg-slate-950 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type message (e.g. cancel, baggage, wallet)..."
                  className="flex-1 px-4 py-2.5 text-xs font-black border-2 border-[#050505] dark:border-white bg-white dark:bg-slate-900 rounded-lg focus:ring-0 text-on-background"
                />
                <button 
                  type="submit"
                  className="w-10 h-10 rounded-lg bg-primary border-2 border-[#050505] dark:border-white text-[#050505] flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)]"
                >
                  <Send className="w-4 h-4 translate-x-0.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
