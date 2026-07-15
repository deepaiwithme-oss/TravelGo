import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Send, Gift, Ticket, Landmark, Download, 
  ArrowUpRight, ArrowDownLeft, X, DollarSign, Wallet, ChevronRight
} from 'lucide-react';
import { Transaction, Offer } from '../types';
import { OFFERS } from '../data';

interface WalletViewProps {
  walletBalance: number;
  onAddFunds: (amount: number) => void;
  onTransferFunds: (amount: number, recipient: string) => boolean;
  transactions: Transaction[];
  onTriggerNotification: (msg: string) => void;
}

export default function WalletView({ 
  walletBalance, 
  onAddFunds, 
  onTransferFunds, 
  transactions,
  onTriggerNotification 
}: WalletViewProps) {
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  // Form states
  const [addAmount, setAddAmount] = useState('50.00');
  const [transferAmount, setTransferAmount] = useState('20.00');
  const [transferRecipient, setTransferRecipient] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      onTriggerNotification("Please enter a valid amount greater than zero.");
      return;
    }
    onAddFunds(amt);
    setShowAddModal(false);
    onTriggerNotification(`Successfully loaded £${amt.toFixed(2)} into your TravelGo wallet via Visa.`);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      onTriggerNotification("Please enter a valid amount greater than zero.");
      return;
    }
    if (!transferRecipient.trim()) {
      onTriggerNotification("Please enter a recipient email or phone number.");
      return;
    }
    const success = onTransferFunds(amt, transferRecipient.trim());
    if (success) {
      setShowTransferModal(false);
      setTransferRecipient('');
    }
  };

  const copyPromo = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    onTriggerNotification(`Copied discount code: ${code}! Keep this for your seat checkout page.`);
  };

  return (
    <div className="space-y-6 pb-6 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Wallet Balance Mesh Card */}
      <section className="relative">
        <div className="glass-card rounded-2xl p-6 overflow-hidden relative">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center py-4">
            <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1.5 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Available Wallet Balance
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 font-display uppercase tracking-wider">
              £{walletBalance.toFixed(2)}
            </h1>

            {/* Quick Actions */}
            <div className="flex gap-4 w-full max-w-sm">
              <button 
                id="wallet-add-money"
                onClick={() => setShowAddModal(true)}
                className="flex-1 bg-primary text-[#050505] py-3.5 px-4 rounded-xl font-black uppercase tracking-wider border-2 border-[#050505] shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-[#fff2eb] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </button>
              <button 
                id="wallet-transfer"
                onClick={() => setShowTransferModal(true)}
                className="flex-1 bg-white text-[#050505] border-2 border-[#050505] py-3.5 px-4 rounded-xl font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transfer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Refer & Earn Banner */}
      <section>
        <div className="bg-primary-container text-white p-4 rounded-2xl flex items-center gap-4 shadow-lg border border-primary/20">
          <div className="bg-white/20 p-3 rounded-xl">
            <Gift className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-base leading-tight">Refer & Earn £10 Bonus</h3>
            <p className="text-xs text-blue-100 mt-1">
              Invite your friends to TravelGo. Get £10 credited on their first booking.
            </p>
          </div>
          <button 
            onClick={() => onTriggerNotification("Shared referral link to clipboard! Share with friends to earn £10.")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Coupons & Promo Codes */}
      <section className="space-y-3">
        <div className="flex justify-between items-end">
          <h2 className="text-sm font-black text-on-background tracking-wider font-display uppercase">Active Offers</h2>
          <button 
            onClick={() => onTriggerNotification("Copied default active offer: TRAVELNEW to clipboard")}
            className="text-xs font-black uppercase text-primary"
          >
            View All
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {/* Coupon 1 */}
          <div className="min-w-[280px] bg-surface rounded-xl p-4 border-2 border-outline shadow-[3px_3px_0px_0px_#F27D26] flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <p className="font-bold text-sm text-slate-900 dark:text-white">Save £15 on London Trips</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Code: <span className="font-extrabold text-slate-800 dark:text-slate-200">TRAVEL15</span></p>
              <button 
                onClick={() => copyPromo('TRAVEL15')}
                className="text-primary font-extrabold text-xs flex items-center gap-1 mt-2 hover:underline cursor-pointer"
              >
                Apply Coupon Code →
              </button>
            </div>
          </div>

          {/* Coupon 2 */}
          <div className="min-w-[280px] bg-surface rounded-xl p-4 border-2 border-outline shadow-[3px_3px_0px_0px_rgba(244,63,94,1)] flex items-start gap-4">
            <div className="bg-rose-100 dark:bg-rose-950/20 text-rose-500 p-2 rounded-xl">
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-left space-y-1">
              <p className="font-bold text-sm text-slate-900 dark:text-white">30% Off First Booking</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Code: <span className="font-extrabold text-slate-800 dark:text-slate-200">TRAVELNEW</span></p>
              <button 
                onClick={() => copyPromo('TRAVELNEW')}
                className="text-rose-500 font-extrabold text-xs flex items-center gap-1 mt-2 hover:underline cursor-pointer"
              >
                Apply Coupon Code →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction History Logs */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Transaction History
        </h2>
        
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div 
                key={tx.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isCredit 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {isCredit ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {tx.title}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {tx.date}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-extrabold text-sm ${isCredit ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isCredit ? '+' : '-'} £{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {tx.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => alert("Downloading digital wallet statements... Complete. Your statements are compiled into your device downloads.")}
          className="w-full py-3 text-primary dark:text-blue-400 font-bold bg-primary/5 dark:bg-blue-500/10 rounded-xl border border-dashed border-primary/20 dark:border-blue-500/30 hover:bg-primary/10 transition-colors cursor-pointer text-xs uppercase tracking-wider"
        >
          Download Statements
        </button>
      </section>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-sm rounded-xl p-5 border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b-2 border-[#050505] dark:border-white pb-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white uppercase font-display tracking-wide flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-primary" /> Load Money via Cards
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Amount (£)</label>
                  <input 
                    type="number" 
                    value={addAmount} 
                    onChange={(e) => setAddAmount(e.target.value)} 
                    step="5"
                    className="w-full mt-1 p-3 border-2 border-[#050505] dark:border-white bg-white dark:bg-slate-800 rounded-lg font-black text-lg focus:ring-0" 
                    placeholder="Enter amount"
                  />
                </div>
                <div className="flex gap-2">
                  {['20', '50', '100'].map(val => (
                    <button 
                      key={val}
                      type="button" 
                      onClick={() => setAddAmount(val)} 
                      className="flex-1 py-1.5 px-3 border-2 border-outline/25 hover:bg-slate-100 rounded-lg text-xs font-black"
                    >
                      + £{val}
                    </button>
                  ))}
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-[#050505] border-2 border-[#050505] dark:border-white font-black uppercase tracking-wider rounded-xl text-xs cursor-pointer shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                  Confirm & Load Wallet
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Funds Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-sm rounded-xl p-5 border-4 border-[#050505] dark:border-white shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b-2 border-[#050505] dark:border-white pb-2">
                <h3 className="font-black text-base text-slate-900 dark:text-white uppercase font-display tracking-wide flex items-center gap-1.5">
                  <Send className="w-5 h-5 text-primary" /> Transfer to Friend
                </h3>
                <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Recipient Email / UPI</label>
                  <input 
                    type="text" 
                    value={transferRecipient} 
                    onChange={(e) => setTransferRecipient(e.target.value)} 
                    className="w-full mt-1 p-3 border-2 border-[#050505] dark:border-white bg-white dark:bg-slate-800 rounded-lg font-black text-xs focus:ring-0" 
                    placeholder="e.g. sam.r@travelgo.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Amount (£)</label>
                  <input 
                    type="number" 
                    value={transferAmount} 
                    onChange={(e) => setTransferAmount(e.target.value)} 
                    className="w-full mt-1 p-3 border-2 border-[#050505] dark:border-white bg-white dark:bg-slate-800 rounded-lg font-black text-xs focus:ring-0" 
                    placeholder="Enter transfer amount"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 bg-primary text-[#050505] border-2 border-[#050505] dark:border-white font-black uppercase tracking-wider rounded-xl text-xs cursor-pointer shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
                  Initiate Transfer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
