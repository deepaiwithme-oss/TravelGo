import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, Compass, MapPin, Tag, ShieldAlert, CheckCircle, 
  Armchair, User, Sparkles, Receipt, CreditCard
} from 'lucide-react';
import { Bus, Booking } from '../types';

interface SeatSelectorModalProps {
  bus: Bus;
  passengersCount: number;
  walletBalance: number;
  onClose: () => void;
  onConfirmBooking: (booking: Booking, updatedWalletBalance: number) => void;
  onTriggerNotification: (msg: string) => void;
}

const BOARDING_POINTS = ["Victoria Bus Station, Bay 12", "Heathrow Airport, Terminal 5", "Stratford High Street Terminal"];
const DROPPING_POINTS = ["Edinburgh Central Coach Yard", "Haymarket Junction Stop C", "Princes Street West Gate"];

export default function SeatSelectorModal({ 
  bus, 
  passengersCount, 
  walletBalance, 
  onClose, 
  onConfirmBooking,
  onTriggerNotification
}: SeatSelectorModalProps) {
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState(BOARDING_POINTS[0]);
  const [droppingPoint, setDroppingPoint] = useState(DROPPING_POINTS[0]);
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Generate Bus Seats configuration (4 rows x 8 columns layout)
  // Let's mock a grid of seats
  const seatGrid = useMemo(() => {
    const rows = ['A', 'B', 'C', 'D'];
    const cols = Array.from({ length: 8 }, (_, i) => i + 1);
    
    // Predetermined unavailable seats to make it look realistic
    const unavailable = ['A2', 'B4', 'C1', 'D5', 'D8', 'A7'];
    
    return { rows, cols, unavailable };
  }, []);

  const handleSeatClick = (seatCode: string) => {
    if (seatGrid.unavailable.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      if (selectedSeats.length >= passengersCount) {
        onTriggerNotification(`You requested a booking for ${passengersCount} passengers. Deselect a seat first to change your selection!`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  // Price calculations
  const seatPriceUnit = bus.price;
  const rawTotal = useMemo(() => {
    return selectedSeats.length * seatPriceUnit;
  }, [selectedSeats, seatPriceUnit]);

  const finalTotal = useMemo(() => {
    const total = rawTotal - appliedDiscount;
    return total < 0 ? 0 : total;
  }, [rawTotal, appliedDiscount]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'TRAVELNEW') {
      const discount = rawTotal * 0.3;
      setAppliedDiscount(discount);
      setCouponSuccess(`Success! 30% discount applied: Save £${discount.toFixed(2)}`);
      setCouponError('');
      onTriggerNotification(`Applied promo TRAVELNEW! Got 30% discount.`);
    } else if (code === 'TRAVEL15') {
      const discount = Math.min(rawTotal, 15);
      setAppliedDiscount(discount);
      setCouponSuccess(`Success! Save £15.00 discount applied!`);
      setCouponError('');
      onTriggerNotification(`Applied promo TRAVEL15! Got £15 off.`);
    } else if (code === '') {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
    } else {
      setCouponError('Invalid coupon code. Try TRAVELNEW or TRAVEL15.');
      setCouponSuccess('');
    }
  };

  const handleCheckout = () => {
    if (selectedSeats.length < passengersCount) {
      onTriggerNotification(`Please select exactly ${passengersCount} seats to match your search criteria.`);
      return;
    }

    if (walletBalance < finalTotal) {
      onTriggerNotification(`Insufficient Wallet Balance. Final amount is £${finalTotal.toFixed(2)}, but you only have £${walletBalance.toFixed(2)}. Please top up your wallet or decrease your passenger count.`);
      return;
    }

    // Generate functional Booking ticket
    const newBooking: Booking = {
      id: `TG-${Math.floor(100000 + Math.random() * 900000)}`,
      bus: bus,
      seatNumbers: selectedSeats,
      boardingPoint: boardingPoint,
      droppingPoint: droppingPoint,
      date: 'Friday, 24 Oct, 2026',
      passengers: Array.from({ length: passengersCount }, (_, i) => i === 0 ? 'Alex Johnson' : `Passenger ${i + 1}`),
      totalPrice: finalTotal,
      status: 'Upcoming',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TravelGo-Ticket-${Date.now()}`
    };

    const remainingWallet = walletBalance - finalTotal;
    onConfirmBooking(newBooking, remainingWallet);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-background w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] border-4 border-[#050505] dark:border-white shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-left"
      >
        {/* Header Display */}
        <header className="p-5 border-b-4 border-[#050505] dark:border-white flex justify-between items-center bg-primary text-[#050505]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#050505]" />
              <h2 className="font-black text-xl font-display uppercase tracking-wider">{bus.operator} Seat Deck</h2>
            </div>
            <p className="text-xs text-[#050505] font-bold uppercase tracking-wider mt-1">
              {bus.type} • select {passengersCount} {passengersCount === 1 ? 'seat' : 'seats'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 border-2 border-[#050505] bg-white text-[#050505] hover:bg-slate-100 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_rgba(5,5,5,1)] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Bus Seat Matrix (5 cols) */}
            <div className="md:col-span-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">
                FRONT OF COACH
              </span>

              {/* Driver & Dashboard Indicator */}
              <div className="w-full flex justify-between px-3 pb-3 border-b border-slate-200 dark:border-slate-700/80 mb-4">
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 uppercase">
                  Door Entry
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Seats Grid */}
              <div className="grid grid-cols-4 gap-x-6 gap-y-3 relative">
                {/* Seat Columns layout */}
                {seatGrid.cols.map((colNum) => {
                  return (
                    <React.Fragment key={colNum}>
                      {seatGrid.rows.map((rowLet, idx) => {
                        const seatCode = `${rowLet}${colNum}`;
                        const isUnavailable = seatGrid.unavailable.includes(seatCode);
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <div 
                            key={seatCode}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-black relative transition-all duration-150 cursor-pointer ${
                              idx === 2 ? 'ml-4' : '' /* creates aisle separating rows A/B and C/D */
                            } ${
                              isUnavailable 
                                ? 'bg-rose-200 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 cursor-not-allowed border-2 border-outline/30' 
                                : isSelected
                                  ? 'bg-primary text-[#050505] scale-105 border-2 border-[#050505]'
                                  : 'bg-white dark:bg-slate-900 hover:bg-[#fff2eb] text-slate-700 dark:text-slate-300 border-2 border-outline'
                            }`}
                            title={`Seat ${seatCode}`}
                          >
                            <Armchair className="w-4 h-4 opacity-50 absolute inset-0 m-auto" />
                            <span className="relative z-10 text-[9px] translate-y-[3px]">
                              {seatCode}
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Legends Row */}
              <div className="flex justify-center gap-4 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-white border border-slate-300 rounded" />
                  Available
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-primary dark:bg-blue-600 rounded" />
                  Selected
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-rose-100 border border-rose-200 rounded" />
                  Occupied
                </div>
              </div>
            </div>

            {/* Right: Boarding Point & Payment calculations (7 cols) */}
            <div className="md:col-span-6 space-y-5">
              
              {/* Boarding and Dropping dropdowns */}
              <div className="space-y-3.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Journey Directions
                </h3>
                
                <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4.5 h-4.5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Boarding Point</label>
                        <select 
                          value={boardingPoint}
                          onChange={(e) => setBoardingPoint(e.target.value)}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-800 dark:text-white mt-0.5 cursor-pointer"
                        >
                          {BOARDING_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    <div className="w-full border-t border-slate-200/60 dark:border-slate-700/60" />

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4.5 h-4.5 text-secondary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Dropping Point</label>
                        <select 
                          value={droppingPoint}
                          onChange={(e) => setDroppingPoint(e.target.value)}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-slate-800 dark:text-white mt-0.5 cursor-pointer"
                        >
                          {DROPPING_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo code entry */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. TRAVELNEW (30% off)"
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-1 focus:ring-primary focus:border-primary uppercase"
                    />
                  </div>
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {couponSuccess}
                  </p>
                )}
              </div>

              {/* Receipt Breakdowns */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                  <Receipt className="w-4 h-4" /> Booking Receipt
                </h4>
                
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Seats Price ({selectedSeats.length} x £{bus.price.toFixed(2)})</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">£{rawTotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-500 font-bold">
                    <span>Discount Discount</span>
                    <span>- £{appliedDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center text-sm">
                  <span className="font-black text-slate-900 dark:text-white">Amount Due</span>
                  <span className="font-black text-primary dark:text-blue-400 text-lg">£{finalTotal.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer actions with Wallet Check */}
        <footer className="p-4 bg-surface border-t-2 border-outline flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400">Your Wallet Balance</p>
              <p className={`text-sm font-extrabold ${walletBalance >= finalTotal ? 'text-slate-700 dark:text-slate-300' : 'text-rose-500 font-black'}`}>
                £{walletBalance.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-white border-2 border-outline hover:bg-slate-50 text-[#050505] font-black uppercase tracking-wider rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              id="confirm-booking-pay"
              onClick={handleCheckout}
              disabled={selectedSeats.length < passengersCount}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-primary disabled:bg-slate-300 text-[#050505] border-2 border-[#050505] dark:border-white font-black uppercase tracking-wider rounded-xl text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              Pay & Confirm
            </button>
          </div>
        </footer>

      </motion.div>
    </div>
  );
}
